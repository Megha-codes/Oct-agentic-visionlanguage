"""OCT multi-task model definition and checkpoint loader.

Reconstructed from the training spec:
  - Backbone: timm 'vit_small_patch14_reg4_dinov2' (DINOv2 ViT-S/14 + reg4),
    img_size=(392, 392), num_classes=0, global_pool='avg' -> 384-d features.
  - One linear head per task over the 384-d pooled feature.

The checkpoint (best_model.pt) is a dict:
    {
      'model_state': <state_dict>,
      'arch': 'vit_small_patch14_reg4_dinov2',
      'collapse_vri': bool,
      'task_classes': {task_name: [class names in index order]},
      'normalize': {'mean': [...], 'std': [...]},
      'img_size': 392,
    }

`load_model_from_checkpoint()` returns (model, meta) where `meta` mirrors the
checkpoint metadata (task_classes, collapse_vri, img_size, normalize, arch).
"""

from __future__ import annotations

import torch
import torch.nn as nn
import timm


# Fixed task ordering used everywhere downstream (report cards, prompts).
TASK_ORDER = ["vri", "foveal", "architecture", "rpe"]


class TaskHead(nn.Module):
    """Per-task head. Matches checkpoint keys `heads.<task>.net.<i>.*`.

    With `hidden=None` (this checkpoint): net = [Dropout, Linear] so the Linear
    is `net.1` (Dropout at net.0 has no params). With a hidden size, an extra
    Linear+activation is prepended.
    """

    def __init__(self, in_features: int, num_classes: int, hidden: int | None = None, dropout: float = 0.0):
        super().__init__()
        if hidden is None:
            self.net = nn.Sequential(
                nn.Dropout(dropout),                 # net.0 (no params)
                nn.Linear(in_features, num_classes),  # net.1
            )
        else:
            self.net = nn.Sequential(
                nn.Linear(in_features, hidden),       # net.0
                nn.GELU(),                            # net.1
                nn.Dropout(dropout),                  # net.2
                nn.Linear(hidden, num_classes),       # net.3
            )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


class OCTMultiTaskModel(nn.Module):
    """DINOv2 ViT-S backbone with one classification head per task."""

    def __init__(
        self,
        arch: str,
        task_classes: dict[str, list[str]],
        img_size: int = 392,
        head_hidden: int | None = None,
        dropout: float = 0.0,
    ):
        super().__init__()
        self.arch = arch
        self.task_classes = task_classes

        # Reconstruct the backbone exactly as trained: num_classes=0 (default
        # pooling), then override global_pool to 'avg' as an attribute. Passing
        # global_pool='avg' to create_model would add an fc_norm layer and
        # change the state dict, so we must set it post-hoc.
        self.backbone = timm.create_model(
            arch,
            img_size=(img_size, img_size),
            num_classes=0,
        )
        self.backbone.global_pool = "avg"
        num_features = self.backbone.num_features  # 384 for vit_small

        # Keys become 'heads.<task>.net.<i>.weight/bias'.
        self.heads = nn.ModuleDict(
            {
                task: TaskHead(num_features, len(classes), head_hidden, dropout)
                for task, classes in task_classes.items()
            }
        )

    def forward(self, x: torch.Tensor) -> dict[str, torch.Tensor]:
        feats = self.backbone(x)
        return {task: head(feats) for task, head in self.heads.items()}


def load_model_from_checkpoint(
    checkpoint_path: str,
    device: str | torch.device = "cpu",
) -> tuple[OCTMultiTaskModel, dict]:
    """Load best_model.pt and return (model_in_eval_mode, meta).

    Raises RuntimeError with a readable key diff if the state dict does not
    align with the reconstructed architecture (so failures are loud, never
    silent mispredictions from randomly-initialized heads).
    """
    ckpt = torch.load(checkpoint_path, map_location="cpu")

    meta = {
        "arch": ckpt["arch"],
        "collapse_vri": ckpt["collapse_vri"],
        "task_classes": ckpt["task_classes"],
        "normalize": ckpt["normalize"],
        "img_size": ckpt["img_size"],
        "head_hidden": ckpt.get("head_hidden"),
        "dropout": ckpt.get("dropout", 0.0),
    }

    model = OCTMultiTaskModel(
        arch=meta["arch"],
        task_classes=meta["task_classes"],
        img_size=meta["img_size"],
        head_hidden=meta["head_hidden"],
        dropout=meta["dropout"] or 0.0,
    )

    state = ckpt["model_state"]
    missing, unexpected = model.load_state_dict(state, strict=False)
    if missing or unexpected:
        raise RuntimeError(
            "Checkpoint keys do not match the reconstructed model.\n"
            f"  Missing (not found in checkpoint):   {missing}\n"
            f"  Unexpected (in checkpoint, unused):  {unexpected}\n"
            "The backbone/head attribute names in model.py must match the "
            "names used when best_model.pt was saved. Send the checkpoint key "
            "names if this persists."
        )

    model.to(device)
    model.eval()
    return model, meta
