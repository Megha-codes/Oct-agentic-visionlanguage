# OCT Multi-Task Inference Service

FastAPI service that serves the trained OCT model (`best_model.pt`) for the
OCTina chatbot. It runs locally on the VPS at `127.0.0.1:8001`; only the Next.js
app calls it. It returns **4 structured findings** (one per task) with confidence
and uncertainty flags. The findings — not the raw image — are then used to ground
Gemini in the Next.js layer.

## Model

- Backbone: `timm` `vit_small_patch14_reg4_dinov2` (DINOv2 ViT-S/14 + reg4),
  `img_size=(392,392)`, `num_classes=0`, `global_pool='avg'` → 384-d features.
  `global_pool` is set as an attribute *after* `create_model` (matching training)
  so no `fc_norm` layer is added and the `backbone.*` keys line up exactly.
- 4 heads (one per task), each `nn.Sequential(Dropout(0.1), Linear(384, n))` →
  state-dict keys `heads.<task>.net.1.{weight,bias}`. `head_hidden=None` in the
  checkpoint, so there is no hidden layer; if a future checkpoint sets
  `head_hidden`, the loader threads it through automatically.

Verified checkpoint (`best_model.pt`) top-level keys: `model_state`, `arch`,
`collapse_vri`, `head_hidden`, `dropout`, `img_size`, `normalize`,
`task_classes`, `fold`, `val_metrics`, `val_mean_macro_f1`. Only the first eight
are used at inference; the rest are training bookkeeping.

Tasks:

| task           | label                     | classes (index order)              |
|----------------|---------------------------|------------------------------------|
| `vri`          | Vitreoretinal Interface   | `Normal`, `PVD`, `Other`           |
| `foveal`       | Foveal Contour            | `Normal`, `Lost`, `Altered`        |
| `architecture` | Retinal Architecture      | `Normal`, `Altered`                |
| `rpe`          | RPE / Choriocapillaris    | `Not_disrupted`, `Disrupted`       |

Uncertainty rules (applied in `inference.py`):
- confidence `< 0.6` → `uncertain`
- rare class predictions `vri=Other` or `foveal=Altered` → `uncertain`
- `rpe` always carries the caveat: *"Consistent with CNV/DME disease class, not
  an independent RPE-layer assessment."*

Preprocessing (must match training): grayscale→RGB (channel repeat), resize to
392×392, `ToTensor`, normalize `mean=[0.5,0.5,0.5] std=[0.5,0.5,0.5]`.

## Endpoints

- `GET /health` → `{status, device, arch, img_size, tasks}`
- `POST /analyze` (multipart, field `file`) → `{findings: [...], model: {...}}`

Each finding:
```json
{
  "task": "vri",
  "task_label": "Vitreoretinal Interface",
  "prediction": "PVD",
  "confidence": 0.87,
  "uncertain": false,
  "caveat": null,
  "probs": {"Normal": 0.10, "PVD": 0.87, "Other": 0.03}
}
```

## VPS deployment (exact commands)

Assumes deploy dir `/opt/octina/inference_service`. Adjust paths as needed.

```bash
# 1. Copy this folder to the VPS
sudo mkdir -p /opt/octina
sudo rsync -av inference_service /opt/octina/          # or git clone / scp
cd /opt/octina/inference_service

# 2. Put the trained weights in place
#    (upload best_model.pt from your machine to the VPS first)
mkdir -p weights
mv /path/to/best_model.pt weights/best_model.pt

# 3. Create the virtualenv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip

# 4. Install torch (CPU wheel — avoids the multi-GB CUDA build on a CPU VPS)
pip install torch==2.10.0 torchvision==0.25.0 --index-url https://download.pytorch.org/whl/cpu
#    On a GPU VPS instead: pip install torch==2.10.0 torchvision==0.25.0

# 5. Install the rest
pip install -r requirements.txt

# 6. Start it (Ctrl+C to stop) and smoke test from another shell
uvicorn app:app --host 127.0.0.1 --port 8001 &
bash smoke_test.sh                 # synthetic image, or:
bash smoke_test.sh path/to/scan.png
```

`smoke_test.sh` hits `GET /health` then `POST /analyze` (generating a synthetic
grayscale image if you don't pass one) and pretty-prints the JSON. Override the
target with `INFERENCE_URL=http://host:8001 bash smoke_test.sh`.

### Run under systemd (auto-start on reboot)

```bash
# Edit User / paths in oct-inference.service if your layout differs, then:
sudo cp /opt/octina/inference_service/oct-inference.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now oct-inference
sudo systemctl status oct-inference
journalctl -u oct-inference -f          # follow logs
```

The unit sets `WEIGHTS_PATH` and `DEVICE=cpu`. It binds to `127.0.0.1:8001`, so
the service is not reachable from the public internet — the Next.js app reaches
it over localhost via `INFERENCE_URL`.

## Environment variables

| var            | default                      | purpose                                  |
|----------------|------------------------------|------------------------------------------|
| `WEIGHTS_PATH` | `weights/best_model.pt`      | path to the checkpoint                   |
| `DEVICE`       | `cuda` if available else `cpu` | inference device                       |

## Troubleshooting

- **Startup error "Checkpoint keys do not match"**: the head/backbone attribute
  names in `model.py` differ from how `best_model.pt` was saved. Compare
  `torch.load('weights/best_model.pt')['model_state'].keys()` with the model's
  `state_dict().keys()` and align the names.
- **`python-multipart` error**: it's in `requirements.txt`; FastAPI needs it for
  file uploads.
