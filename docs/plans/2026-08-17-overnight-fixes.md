# Plan: Overnight fixes, 17 Aug 2026 (lead-authored, self-approved under delegated authority)

*Written before any code change per the owner's plan-mode rule. Owner reviews in the morning; nothing is pushed.*

## Principles
Scalpel not axe. Live site ranking 1-3 on Google/Bing. Each fix: smallest change, independently committed, build+lint green, zero UI/behavior change unless stated. Anything visual or risky is recommended, not applied.

## Fix 1: Security headers via vercel.json  (Priority: CRITICAL, Risk: LOW)
Why: production serves no CSP/X-Frame-Options/nosniff/Referrer-Policy; public/_headers is ignored by Vercel.
Change: add `vercel.json` with enforced X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera, microphone, geolocation, payment, usb, browsing-topics), and Content-Security-Policy-Report-Only. HSTS untouched (Vercel default max-age=63072000; includeSubDomains deferred until DNS subdomain inventory). Cache-Control 1 day for public/ images.
Verify: JSON parses (python json.load); `npm run build` passes (vercel.json is not part of the bundle). After owner pushes: `curl -sI https://www.europeansummercamps.com/` shows the new headers; check browser console for CSP report-only violations over 48h; then flip CSP to enforced in a separate commit.
Rollback: delete vercel.json.

## Fix 2: Contact-form maxLength  (Priority: MEDIUM, Risk: LOW)
Change: add maxLength to firstName/lastName (100), email (254), preferredCountries (200), message (3000) in App.jsx form JSX (~4339-4480). No visual change.
Verify: build+lint. Rollback: revert commit.
NOT tonight: removing `to_email` from templateParams. Owner must first hardcode the recipient in the EmailJS template (dashboard), otherwise mail could stop routing. Owner action list in HEALTH_CHECK.

## Fix 3: Broken booking URLs (5)  (Priority: HIGH for accuracy, Risk: LOW)
Change: replace only with URLs verified live on the operator's official domain (wave-2 verifier or lead WebFetch). If no replacement is verifiable, keep and flag.
Verify: curl 200 on each new URL; build (prebuild validator).

## Fix 4: npm audit fix (non-breaking)  (Priority: LOW, Risk: LOW-MED)
Change: `npm audit fix` (no --force), commit package-lock separately.
Verify: build+lint pass; if not, revert.

## Fix 5: Lint warnings  (Priority: LOW, Risk: LOW)
Change: remove `allCamps` from the two useMemo dependency arrays (module-scope constant; harmless but noisy). Only if code reviewer confirms.
Verify: lint shows 2 warnings (shadcn only), build passes.

## Fix 6: Docs truth  (Priority: MEDIUM, Risk: none)
Change: correct CSP/security claims in CLAUDE.md, QUICK_REFERENCE.md, docs/reference/SECURITY_STATUS.md; add build-time https-scheme check to scripts/validate-camps.js if trivial.

## Deferred / recommend only
- CSP enforce flip (after report-only observation)
- HSTS includeSubDomains + preload (after DNS review)
- EmailJS template recipient hardcoding, CAPTCHA, rate limit (owner dashboard)
- 1.6MB hero PNG fallback served as camp card image (visual, needs owner eyes)
- Filter UI / camp card extraction (Phase 2 refactor)
