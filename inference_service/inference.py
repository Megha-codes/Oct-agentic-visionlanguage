"""Preprocessing, prediction, and clinical uncertainty rules for the OCT model."""

from __future__ import annotations

import io

import torch
from PIL import Image
import torchvision.transforms as T

from model import TASK_ORDER


# Human-readable task labels for the UI / grounding prompt.
TASK_LABELS = {
    "vri": "Vitreoretinal Interface",
    "foveal": "Foveal Contour",
    "architecture": "Retinal Architecture",
    "rpe": "RPE / Choriocapillaris",
}

# Confidence below this is flagged uncertain for every task.
CONFIDENCE_THRESHOLD = 0.6

# Predicting one of these (task -> class) is flagged uncertain because the
# class is rare in training and prone to error.
RARE_CLASS_FLAGS = {
    "vri": {"Other"},
    "foveal": {"Altered"},
}

# Tasks that always carry a fixed caveat.
ALWAYS_CAVEAT = {
    "rpe": (
        "Consistent with CNV/DME disease class, not an independent "
        "RPE-layer assessment."
    ),
}


def build_transform(meta: dict) -> T.Compose:
    """Inference transform matching training exactly.

    Grayscale->RGB (repeat 3x), resize to img_size, ToTensor, Normalize.
    """
    img_size = int(meta["img_size"])
    mean = meta["normalize"]["mean"]
    std = meta["normalize"]["std"]
    return T.Compose(
        [
            T.Grayscale(num_output_channels=3),  # repeat single channel 3x; RGB passes through
            T.Resize((img_size, img_size)),
            T.ToTensor(),
            T.Normalize(mean=mean, std=std),
        ]
    )


def load_image(image_bytes: bytes) -> Image.Image:
    return Image.open(io.BytesIO(image_bytes)).convert("RGB")


@torch.inference_mode()
def run_inference(
    model,
    meta: dict,
    transform: T.Compose,
    image_bytes: bytes,
    device: str | torch.device = "cpu",
) -> list[dict]:
    """Return a list of finding dicts, one per task, in TASK_ORDER."""
    img = load_image(image_bytes)
    x = transform(img).unsqueeze(0).to(device)

    logits = model(x)  # dict task -> [1, num_classes]
    task_classes: dict[str, list[str]] = meta["task_classes"]

    findings: list[dict] = []
    # Preserve the canonical task order, but tolerate a model that omits a task.
    ordered_tasks = [t for t in TASK_ORDER if t in logits] + [
        t for t in logits if t not in TASK_ORDER
    ]

    for task in ordered_tasks:
        classes = task_classes[task]
        probs = torch.softmax(logits[task][0], dim=-1)
        conf, idx = torch.max(probs, dim=-1)
        confidence = float(conf)
        prediction = classes[int(idx)]

        uncertain = confidence < CONFIDENCE_THRESHOLD or (
            prediction in RARE_CLASS_FLAGS.get(task, set())
        )

        findings.append(
            {
                "task": task,
                "task_label": TASK_LABELS.get(task, task),
                "prediction": prediction,
                "confidence": round(confidence, 4),
                "uncertain": bool(uncertain),
                "caveat": ALWAYS_CAVEAT.get(task),
                "probs": {
                    cls: round(float(p), 4) for cls, p in zip(classes, probs.tolist())
                },
            }
        )

    return findings
