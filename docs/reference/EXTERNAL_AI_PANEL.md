# External AI panel for ESC: the complement to the multi-model-second-opinions skill

*Created 6 September 2026 by ESC Claude at the owner's request. The user-level skill `multi-model-second-opinions` (canonical master in the Playground repo, mirrored to `~/.claude/skills/`) is the doctrine and the model inventory. This file is the ESC-specific layer: which ESC task goes to which seat, the briefs that work for a camp directory, the runner script, the ledger rules for generated images, and the cost discipline. Read the skill first; this file assumes it.*

## 1. The seats, as verified live on 6 September 2026

| Seat | Model | ESC role | Status |
|---|---|---|---|
| Adjudicator | Claude (Fable 5.1 when available, else the highest Anthropic model in the session) | Leads, reviews the same surface itself, decides every finding | always |
| Adversarial second | `gpt-6-astra` (OpenAI Responses API, `reasoning.effort=high`, `max_output_tokens` 30k) | App.jsx diffs touching routing, filtering, counts, analytics or security; plan and design docs before a build; adversarial pass on new camp data ("why might this be a tour operator, a group price, a wrong age range") | BLOCKED since 6 Sept 2026 afternoon: OpenAI credit balance exhausted (HTTP 429 credit_balance_exhausted); owner adds credits, then the winter SEO brief is re-run |
| Cheap fallback | `gpt-5.6-sol` | Same API and prompts, about 2.5x cheaper, roughly twice Astra's hallucination rate | live |
| Third seat | `gemini-3.8-flash` (`thinking_level: high`) | SEO and competitive second opinions, outward copy review (FAQ, teasers, meta text), idea generation, science or statistics questions | live, $0.75/$3.75 per M until 31 Dec 2026 |
| Vision pair partner | Grok 4.6 | Not available: primary xAI key out of credit since August 2026; the ALT key carries an exfiltration-incident history and is never used for ESC | blocked |
| Off-context web research | `gpt-6-astra` with the hosted `web_search` tool (`scripts/ai-review.sh astra <brief> <out> <label> web`) | Bounded research and verification runs that would otherwise cost this session's context: operator pages, fee tables, booking forms. Proven 6 Sept 2026: 25 pages opened in about 7 minutes, resolved a fee table the WebFetch agents could not render, reported NOT FOUND honestly where a value was missing. The lead still re-checks every number that enters camps.js on the operator page. | BLOCKED since 6 Sept 2026 afternoon: OpenAI credit balance exhausted (HTTP 429 credit_balance_exhausted); owner adds credits, then the winter SEO brief is re-run |
| Image generation | `gemini-3-pro-image` (GA), `gpt-image-1.5` (transparent backgrounds), `gpt-image-2` (rejects transparency), `imagen-4.0-*` (unexplored) | Hero and section backdrops, illustrative assets for the winter section, badge or icon artwork | live |

Verify IDs against the live `/models` endpoints before every dispatch; stale IDs and stale tiers have both bitten. The check is free and takes one curl.

## 2. Which ESC task goes where

| ESC situation | Seat | Pairing |
|---|---|---|
| App.jsx diff touching `KNOWN_SECTIONS`, the hash handler, `filteredCamps`, counts derived from `allCamps`, GA4 events, the consent gate, `window.open` or CSP | Astra diff review | Always paired with the lead's own full review of the same diff |
| Design spec or implementation plan (for example the winter section spec) | Astra plan review, Gemini for the SEO-facing parts | Paired; run BEFORE asking the owner to approve (lesson: review gates trigger on artefact type, not on felt confidence) |
| Batch of new camps ready for camps.js | Astra adversarial data pass on the agent reports plus the lead's own spot checks on operator pages | The lead verifies price, ages and dates on the operator page regardless of what any model says |
| Outward copy that Google reads: title, meta description, FAQ answers, home teasers, JSON-LD names | Gemini SEO opinion (and Astra when the change touches the head terms) | Lead adjudicates; head-term protection outranks any suggestion |
| Strategy call made on inference (rollover, winter positioning, tier pricing) | Three-consult when the seats disagree; otherwise Astra plus Gemini | Synthesize, do not average |
| Routine data update, provenance comment, typo, doc edit, small mechanical fix | Nobody | Build, validators, lint |

## 3. Running a review: `scripts/ai-review.sh`

```
source ~/.bashrc                       # keys into the environment; the script never does this itself
scripts/ai-review.sh astra  brief.md "$SCRATCH/reviews" winter-spec
scripts/ai-review.sh gemini brief.md "$SCRATCH/reviews" winter-seo
```

- Output: `<label>.<provider>.md` (extracted text) and `.response.json` (raw) in the scratchpad. Persist the verdict summary and every adjudication into the plan record in `docs/reports/` or the spec; the scratchpad is session-bound.
- Astra at effort high takes 5 to 10 minutes. Launch it with the Bash tool's `run_in_background` so a tool timeout cannot kill it; the curl `--max-time` is 25 minutes.
- Keys: never on argv, never printed, never under the repo tree. The script writes the auth header into a 600-permission temp file and passes it with `curl -K`. No `set -x`, ever.
- Corp AV intercepts TLS on this machine: every curl carries `--ssl-no-revoke`. Never disable certificate validation.
- Python reads and writes with `-X utf8`; the console is cp1252 and Astra emits arrows and dashes.
- An Astra response with `status: incomplete` has no text and is still billed; the 30k token cap avoids it. If it happens, resend unchanged (the cached input is cheap).

## 4. The brief that works for ESC

Every brief carries these lines, in this order:

1. **Audience**: "parents making booking decisions for their children on a live production site (www.europeansummercamps.com)". Without it reviewers invent an audience and flag against it.
2. **Precedence**: "The instructions in this brief take precedence over any skill or file instructions you carry."
3. **Action bias** (Astra asks clarifying questions otherwise): "Bias toward action; complete the review with the evidence supplied; if something is missing, state the assumption and continue."
4. **The constraints that are not negotiable**: single-URL SPA with hash routes invisible to crawlers; title and H1 carry the head terms and are protected; 70 percent mobile traffic (iOS half of it); em-dash ban and no unverified numbers in outward text; `allCamps` drives every summer count; validators run before every build; no AggregateRating schema; camps must pass the five-point test (residential facility, camp operator, camp-only pricing, on-site programme, operator-run facility).
5. **The artefact**: the diff, spec, data rows or copy, inline. Paste code, do not describe it.
6. **The ask, ranked**: "Return findings ranked by severity, each with the concrete evidence line and the smallest fix. State what you checked and found clean. Under 1,500 words."
7. **Format**: "Prose or short tables, no preamble" (Astra defaults to long, heavily formatted answers).
8. **For anything a parent sees**: "Walk the card as a first-time parent and press everything: every chip, badge, button and hover; report anything that looks clickable and is not, and any term a non-specialist parent would not understand." Added 12 Sept 2026 after the owner found a dead "+N more" chip on every card and an unexplained "Via Ferrata" that three fact-checking reviews had passed.

For data passes add the no-fabrication clause used for the agents: quote a source for every number, write NOT FOUND rather than guess, never infer a per-child price from a group or facility rate. For date and price passes also paste the six-step search order from `.claude/agents/camp-data-verifier.md` (dates page by URL pattern, enrolment form, brochure PDF, interactive widgets need a browser, unlabelled years reported as printed, every price label reported); the enrolment form is the only source that verifies "open".

## 5. Adjudication record

Every finding gets one of three verdicts written down where the next session will read it: ACCEPTED (with the commit), REJECTED with the reason, DEFERRED with the trigger. The Wave 1 record in `docs/reports/WAVE1_ROLLOVER_PLAN_2026-09-03.md` is the model. An external verdict is never applied without the lead having read the same surface; the pairing rule has caught real bugs in both directions and it does not lapse for small rounds.

## 6. Generated images for ESC

The site's images are optimized (AVIF, WebP, PNG fallback, 93 to 96 percent reduction). Generated assets follow the same pipeline and a ledger.

- **Backdrops and section headers**: `gemini-3-pro-image`, 16:9, art-directed prompt, no text in the image, no recognizable people, daylight scenes that read as European (Alpine, Nordic, Mediterranean). The Playground wrapper pattern (`mythstats/visual-experiments/gen-image.sh`) is curl-based because the Python image skill cannot be fixed for corp AV; ESC's own wrapper lives next to `ai-review.sh` when needed.
- **Transparent assets** (icons, badges, cut-outs): `gpt-image-1.5` with `background: "transparent"`; `gpt-image-2` rejects transparency, test before switching.
- **Pipeline**: generate at the largest size, review the PNG by eye (the lead reads the image), then `sharp` to AVIF and WebP at the display size plus a compressed PNG fallback, into `src/assets/` (or `public/` when a static URL is needed for og:image or preload). Add width and height on the element.
- **Ledger**: `docs/reference/GENERATED_ASSETS.md`, one row per asset: file, model, exact prompt, size and aspect, date, SHA-256 of the raw output, deviations, commercial-use basis. No prompt on record means saying so; provenance is never invented.
- **Never** generate camp photos that could be mistaken for a specific listed camp's facility; every camp image on the site is either the camp's own material with permission or a clearly generic scene.

## 7. Cost discipline

The battery scales to the task. A Wave 2 date update gets validators and a build, not a reviewer. A new camps batch gets one Astra data pass. A diff on the routing or the counts gets Astra plus the lead's review. A design spec gets Astra plus Gemini. Do not run reviewers to look diligent; Astra is $10/$50 per M tokens and a full review costs real money and ten minutes.

## 8. Related files

- Skill (doctrine and inventory): `~/.claude/skills/multi-model-second-opinions/SKILL.md`
- TLS workaround matrix for this machine: Playground repo `.claude/rules/corp-av-ssl-workarounds.md`
- Shared machine and key facts: `Claude bridge/reference/shared-machine-facts.md`
- Agent no-fabrication clause: `.claude/agents/camp-content-researcher.md`, `.claude/agents/camp-data-verifier.md`
- Runner: `scripts/ai-review.sh`
- CLAUDE.md section 4.8 points here.
