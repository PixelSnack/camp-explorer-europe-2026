#!/usr/bin/env bash
# ESC image generator: Gemini image model via curl (the Python image skill cannot be fixed for corp AV).
# Usage:  scripts/gen-image.sh <prompt-file> <output.png> [aspect-ratio] [model]
#         aspect-ratio default 16:9; model default gemini-3-pro-image (GA)
# Requires GEMINI_API_KEY exported (source ~/.bashrc first). This committed script never sources ~/.bashrc,
# never puts the key on argv (600-perm curl config via -K), never prints it, no set -x. Corp-AV safe: --ssl-no-revoke.
# Every generated asset that ships is ledgered in docs/reference/GENERATED_ASSETS.md (prompt, model, params, date, hash).
set -euo pipefail

PROMPT_FILE="${1:?usage: gen-image.sh <prompt-file> <output.png> [aspect-ratio] [model]}"
OUTPUT="${2:?usage: gen-image.sh <prompt-file> <output.png> [aspect-ratio] [model]}"
ASPECT="${3:-16:9}"
MODEL="${4:-gemini-3-pro-image}"

[ -f "$PROMPT_FILE" ] || { echo "ERROR: prompt file not found: $PROMPT_FILE" >&2; exit 1; }
[ -n "${GEMINI_API_KEY:-}" ] || { echo "ERROR: GEMINI_API_KEY is not exported (source ~/.bashrc first)" >&2; exit 1; }
mkdir -p "$(dirname "$OUTPUT")"

umask 077
AUTH_FILE="$(mktemp)"
PAYLOAD_FILE="$(mktemp)"
RESPONSE_FILE="$(mktemp)"
trap 'rm -f "$AUTH_FILE" "$PAYLOAD_FILE" "$RESPONSE_FILE"' EXIT
printf 'header = "x-goog-api-key: %s"\n' "$GEMINI_API_KEY" > "$AUTH_FILE"

IMG_ASPECT="$ASPECT" python -X utf8 - "$PROMPT_FILE" > "$PAYLOAD_FILE" <<'PY'
import json, os, sys
prompt = open(sys.argv[1], encoding="utf-8").read().strip()
print(json.dumps({
    "contents": [{"parts": [{"text": prompt}]}],
    "generationConfig": {
        "responseModalities": ["TEXT", "IMAGE"],
        "imageConfig": {"aspectRatio": os.environ["IMG_ASPECT"]},
    },
}))
PY

URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent"
echo "[$MODEL] generating $ASPECT image -> $OUTPUT" >&2
HTTP_CODE="$(curl -sS --ssl-no-revoke --max-time 300 -w '%{http_code}' -o "$RESPONSE_FILE" \
  -X POST "$URL" -K "$AUTH_FILE" -H "Content-Type: application/json" --data-binary @"$PAYLOAD_FILE")"

IMG_OUT="$OUTPUT" IMG_HTTP="$HTTP_CODE" python -X utf8 - "$RESPONSE_FILE" <<'PY'
import base64, hashlib, json, os, sys
out = os.environ["IMG_OUT"]
try:
    d = json.load(open(sys.argv[1], encoding="utf-8"))
except Exception as e:
    sys.stderr.write("ERROR: response not JSON (HTTP %s): %s\n" % (os.environ["IMG_HTTP"], e)); sys.exit(1)
if isinstance(d, dict) and d.get("error"):
    sys.stderr.write("ERROR (HTTP %s): %s\n" % (os.environ["IMG_HTTP"], json.dumps(d["error"])[:500])); sys.exit(1)
cand = (d.get("candidates") or [{}])[0]
finish = cand.get("finishReason", "UNKNOWN")
if finish not in ("STOP", "MAX_TOKENS"):
    sys.stderr.write("ERROR: finishReason=%s\n" % finish); sys.exit(1)
for p in cand.get("content", {}).get("parts", []):
    if "inlineData" in p:
        raw = base64.b64decode(p["inlineData"]["data"])
        open(out, "wb").write(raw)
        print("SAVED %s (%d bytes) sha256=%s mime=%s" % (out, len(raw), hashlib.sha256(raw).hexdigest(), p["inlineData"].get("mimeType")))
        sys.exit(0)
sys.stderr.write("ERROR: no image in response\n"); sys.exit(1)
PY
