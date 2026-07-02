"""FastAPI inference service for the OCT multi-task model.

Runs on localhost:8001. Exposes:
  GET  /health   -> readiness + model metadata
  POST /analyze  -> multipart image upload, returns 4 structured findings

Only the local Next.js server should call this (bind to 127.0.0.1).
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from model import load_model_from_checkpoint
from inference import build_transform, run_inference


WEIGHTS_PATH = os.environ.get("WEIGHTS_PATH", "weights/best_model.pt")
DEVICE = os.environ.get("DEVICE", "cuda" if torch.cuda.is_available() else "cpu")
MAX_BYTES = 10 * 1024 * 1024  # 10 MB, mirrors the Next.js validation
ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}

# Populated at startup.
STATE: dict = {"model": None, "meta": None, "transform": None}


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.path.exists(WEIGHTS_PATH):
        raise RuntimeError(
            f"Model weights not found at '{WEIGHTS_PATH}'. Place best_model.pt "
            "there or set WEIGHTS_PATH."
        )
    model, meta = load_model_from_checkpoint(WEIGHTS_PATH, device=DEVICE)
    STATE["model"] = model
    STATE["meta"] = meta
    STATE["transform"] = build_transform(meta)
    yield
    STATE.clear()


app = FastAPI(title="OCT Multi-Task Inference", version="1.0.0", lifespan=lifespan)


@app.get("/health")
def health():
    ready = STATE["model"] is not None
    meta = STATE["meta"] or {}
    return {
        "status": "ok" if ready else "loading",
        "device": DEVICE,
        "arch": meta.get("arch"),
        "img_size": meta.get("img_size"),
        "tasks": list((meta.get("task_classes") or {}).keys()),
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if STATE["model"] is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type: {file.content_type}",
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image upload")
    if len(image_bytes) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")

    try:
        findings = run_inference(
            STATE["model"],
            STATE["meta"],
            STATE["transform"],
            image_bytes,
            device=DEVICE,
        )
    except Exception as exc:  # noqa: BLE001 - surface a clean 500 to the caller
        return JSONResponse(
            status_code=500,
            content={"detail": f"Inference failed: {exc}"},
        )

    meta = STATE["meta"]
    return {
        "findings": findings,
        "model": {"arch": meta["arch"], "img_size": meta["img_size"]},
    }
