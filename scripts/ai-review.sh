#!/usr/bin/env bash
# ESC external second-opinion runner.
#   GPT-6 Astra (OpenAI Responses API, reasoning effort high) for adversarial code, plan and data reviews.
#   GPT-5.6 SOL as the cheaper fallback on the same API.
#   Gemini 3.8 Flash (generateContent, thinking_level high) as the third seat (SEO, copy, idea generation).
#
# Usage:  scripts/ai-review.sh <astra|sol|gemini> <brief-file> <out-dir> [label]
# Output: <out-dir>/<label>.<provider>.response.json (raw) and <out-dir>/<label>.<provider>.md (extracted text)
#
# Requires OPENAI_API_KEY or GEMINI_API_KEY exported in the environment (run `source ~/.bashrc` first).
# This committed script deliberately does NOT source ~/.bashrc, never puts a key on argv (600-perm curl config
# file via -K), never prints a key, and runs with no set -x. Corp-AV safe: curl --ssl-no-revoke.
# Astra at effort=high takes 5 to 10 minutes; launch it detached (Bash run_in_background) so a tool timeout
# cannot kill it mid-flight. Read the .md output, then adjudicate every finding (ACCEPTED / REJECTED with
# reason / DEFERRED) in the plan record. Doctrine: docs/reference/EXTERNAL_AI_PANEL.md
set -euo pipefail

PROVIDER="${1:?usage: ai-review.sh <astra|sol|gemini> <brief-file> <out-dir> [label]}"
BRIEF="${2:?usage: ai-review.sh <astra|sol|gemini> <brief-file> <out-dir> [label]}"
OUT_DIR="${3:?usage: ai-review.sh <astra|sol|gemini> <brief-file> <out-dir> [label]}"
LABEL="${4:-review}"

[ -f "$BRIEF" ] || { echo "ERROR: brief file not found: $BRIEF" >&2; exit 1; }
case "$LABEL" in *[!A-Za-z0-9_-]*|'') echo "ERROR: label must match [A-Za-z0-9_-]+" >&2; exit 1;; esac
mkdir -p "$OUT_DIR"

umask 077
AUTH_FILE="$(mktemp)"
PAYLOAD_FILE="$(mktemp)"
trap 'rm -f "$AUTH_FILE" "$PAYLOAD_FILE"' EXIT

RESP="$OUT_DIR/$LABEL.$PROVIDER.response.json"
TEXT="$OUT_DIR/$LABEL.$PROVIDER.md"

case "$PROVIDER" in
  astra|sol)
    [ -n "${OPENAI_API_KEY:-}" ] || { echo "ERROR: OPENAI_API_KEY is not exported (source ~/.bashrc first)" >&2; exit 1; }
    MODEL="gpt-6-astra"
    [ "$PROVIDER" = "sol" ] && MODEL="gpt-5.6-sol"
    printf 'header = "Authorization: Bearer %s"\n' "$OPENAI_API_KEY" > "$AUTH_FILE"
    AI_MODEL="$MODEL" python -X utf8 - "$BRIEF" > "$PAYLOAD_FILE" <<'PY'
import json, os, sys
brief = open(sys.argv[1], encoding="utf-8").read()
# Reasoning is billed as output and consumed first; under ~25k the answer arrives as status=incomplete with no text.
print(json.dumps({
    "model": os.environ["AI_MODEL"],
    "input": brief,
    "reasoning": {"effort": "high"},
    "max_output_tokens": 30000,
}))
PY
    URL="https://api.openai.com/v1/responses"
    ;;
  gemini)
    [ -n "${GEMINI_API_KEY:-}" ] || { echo "ERROR: GEMINI_API_KEY is not exported (source ~/.bashrc first)" >&2; exit 1; }
    MODEL="gemini-3.8-flash"
    printf 'header = "x-goog-api-key: %s"\n' "$GEMINI_API_KEY" > "$AUTH_FILE"
    python -X utf8 - "$BRIEF" > "$PAYLOAD_FILE" <<'PY'
import json, sys
brief = open(sys.argv[1], encoding="utf-8").read()
print(json.dumps({
    "contents": [{"parts": [{"text": brief}]}],
    "generationConfig": {"thinkingConfig": {"thinking_level": "high"}, "maxOutputTokens": 16000},
}))
PY
    URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent"
    ;;
  *)
    echo "ERROR: provider must be astra, sol or gemini (got '$PROVIDER')" >&2; exit 1;;
esac

echo "[$PROVIDER/$MODEL] sending $(wc -c < "$BRIEF") bytes, label '$LABEL' ..." >&2
HTTP_CODE="$(curl -sS --ssl-no-revoke --max-time 1500 -w '%{http_code}' -o "$RESP" \
  -X POST "$URL" -K "$AUTH_FILE" -H "Content-Type: application/json" --data-binary @"$PAYLOAD_FILE")"

AI_PROVIDER="$PROVIDER" AI_HTTP="$HTTP_CODE" python -X utf8 - "$RESP" "$TEXT" <<'PY'
import json, os, sys
resp_path, text_path = sys.argv[1], sys.argv[2]
try:
    d = json.load(open(resp_path, encoding="utf-8"))
except Exception as e:
    sys.stderr.write("ERROR: response is not JSON (HTTP %s): %s\n" % (os.environ["AI_HTTP"], e)); sys.exit(1)
if isinstance(d, dict) and d.get("error"):
    sys.stderr.write("ERROR (HTTP %s): %s\n" % (os.environ["AI_HTTP"], json.dumps(d["error"])[:600])); sys.exit(1)
out = []
if os.environ["AI_PROVIDER"] == "gemini":
    for c in d.get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            if "text" in p and not p.get("thought"):
                out.append(p["text"])
    meta = d.get("usageMetadata", {})
else:
    status = d.get("status")
    if status != "completed":
        sys.stderr.write("WARNING: status=%s (an incomplete response carries no text but is still billed)\n" % status)
    for item in d.get("output", []):
        if item.get("type") == "message":
            for c in item.get("content", []):
                if c.get("type") == "output_text":
                    out.append(c["text"])
    meta = d.get("usage", {})
text = "\n".join(out)
open(text_path, "w", encoding="utf-8").write(text)
print("saved %s (%d chars); usage %s" % (text_path, len(text), json.dumps(meta)[:300]))
PY
