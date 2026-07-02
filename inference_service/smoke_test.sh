#!/usr/bin/env bash
#
# Smoke test for the OCT inference service.
#
# Usage:
#   ./smoke_test.sh [path/to/oct_image.png]
#
# With no argument it generates a synthetic grayscale test image so you can
# verify the service end-to-end before you have a real scan handy.
#
# Override the target with:  INFERENCE_URL=http://host:8001 ./smoke_test.sh
#
set -euo pipefail

BASE="${INFERENCE_URL:-http://127.0.0.1:8001}"
IMG="${1:-}"

pp() { python3 -m json.tool 2>/dev/null || cat; }

echo "== 1. Health check: GET $BASE/health =="
if ! curl -fsS "$BASE/health" | pp; then
  echo "ERROR: /health failed. Is the service running on $BASE ?" >&2
  exit 1
fi

CLEANUP=""
if [ -z "$IMG" ]; then
  IMG="$(mktemp --suffix=.png)"
  CLEANUP="$IMG"
  python3 - "$IMG" <<'PY'
import sys
from PIL import Image, ImageDraw
img = Image.new("L", (600, 400), 20)          # dark background
d = ImageDraw.Draw(img)
for y in range(150, 250, 8):                   # a few bright retinal-ish bands
    d.line([(0, y), (600, y)], fill=190, width=2)
img.save(sys.argv[1])
PY
  echo
  echo "(generated synthetic test image: $IMG)"
fi

echo
echo "== 2. Analyze: POST $BASE/analyze  (file=$IMG) =="
# NOTE: the ;type=image/png is required — the service rejects octet-stream.
curl -fsS -F "file=@${IMG};type=image/png" "$BASE/analyze" | pp

[ -n "$CLEANUP" ] && rm -f "$CLEANUP"
echo
echo "== Smoke test complete. =="
