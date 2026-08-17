# Security audit report, 17 Aug 2026

*Agent: security-audit-specialist (Fable), read-only, full App.jsx coverage in 10 segments. Adjudicated by lead in HEALTH_CHECK_2026-08-17.md.*

## 1. Findings, ranked

**HIGH: EmailJS credentials plus caller-controlled recipient make the account an open relay and a quota-burn target.**
src/App.jsx:160-179: templateParams = { to_email: recipientEmail, ... } sent with emailjs.send('service_vnise8u','template_lm9wnse', templateParams, 'RLTeapLFs4m6Y18HQ'). Scenario: anyone POSTs to api.emailjs.com with these three IDs and their own to_email/message, sending branded spam to arbitrary addresses (if the template's To field is {{to_email}}, which the five-address routing design implies; COULD NOT VERIFY dashboard) or, at minimum, flooding the owner's inboxes and exhausting the monthly quota so real partner enquiries silently fail. Only client-side mitigations exist: honeypot (line 149) and disabled-while-submitting (line 4477); no rate limit; the honeypot is bypassed by calling the API directly. Smallest fix: hard-code the To address in the EmailJS template (or one template per route) and stop passing to_email; then enable the dashboard controls in section 4. Confidence: code Confirmed, template behaviour Likely.

**HIGH (availability/business): the full-size hero PNG ships as a card thumbnail, and Vercel plan limits are unverified.**
src/data/camps.js:3 import heroImage from '../assets/european-summer-camps-lakeside-hero.png'; 21 camps use image: heroImage, rendered as plain img src={camp.image} at App.jsx:1209 with no webp/avif fallback. The same file also sits in public/ as og:image. ~1,674KB. Scenario: one script fetching that URL in a loop burns Vercel Hobby's 100GB/month in ~60k requests, after which Vercel pauses the project until the next cycle; on Pro it becomes overage billing. Also, Vercel Hobby forbids commercial use, and paid listings start now (plan COULD NOT VERIFY). Smallest fix: switch card thumbnails to the existing 127KB webp/avif, confirm plan is Pro, put Cloudflare proxy (orange cloud) with caching in front.

**MEDIUM (GDPR): pre-consent connections and a thin privacy notice.**
index.html:62-63 preconnect to googletagmanager.com and google-analytics.com fire on every load before consent (browser opens TLS to Google, revealing IP; German courts have fined IP transfer to Google without consent). index.html:60-61,64 preconnect Google Fonts, yet nothing loads Google Fonts: dead weight and needless third-party contact. Privacy page App.jsx:3403-3460 names no controller, legal basis, retention, processors (EmailJS, Google LLC, Vercel Inc.), US transfer, or right to complain to Datatilsynet; contact-form data flows through EmailJS (US) undisclosed. Consent gating itself is correct: GA4 only after cookieConsent === true (App.jsx:589-606); Analytics and SpeedInsights likewise (4688-4692). Vercel Analytics is cookieless, so gating it is stricter than required. Fix: delete the lines 60-66 preconnects (or inject GA preconnects post-consent), expand the privacy text. Confirmed.

**MEDIUM (data integrity as security): booking links are trusted with no scheme check, and some are wrong.**
App.jsx:76-88 new URL(baseUrl) and App.jsx:108 window.open(...): a javascript: value would execute. All 65 bookingUrl values are https today (Confirmed by grep). But camps.js:597 (ID 28, Jagiellonian) points to an ONLINE course page while the listing describes dormitory accommodation; camps.js:506 (our-summer-camps-2025) and camps.js:667 (semenic_explorer25) are 2025 URLs. Fix: add https and youtube-host checks for bookingUrl/videoUrl to scripts/validate-camps.js; re-verify IDs 24, 28, 31. Confirmed.

**MEDIUM (trust/consumer claim):** App.jsx:4206 "We do not handle bookings, process payments, or receive commissions from camps. This independence ensures our recommendations remain unbiased" while 4220 says featured listings are marked. Once camps pay for placement, 4206 is a misleading commercial claim. Fix wording. Confirmed.

**LOW: repo hygiene.** Third-party personal data in the public repo: megan.miller@boundless.life (CLAUDE.md:149, NEXT_STEPS.md:20 and 330, FEATURED_CAMPS.md:94, MONETIZATION_STRATEGY.md:15, FEATURED_LISTINGS_POLICY.md:279), jolita.beciene@linesa.lt (FEATURED_CAMPS.md:129), operator name at camps.js:644, owner's personal Gmail in CLAUDE.md and CODE_STRUCTURE.md. No credentials found (case-insensitive scan). .gitignore covers .env, .env.local, .env.*.local, .claude/, .vercel, backups, but not .env.production; Vite would inline any future VITE_* var into the public bundle. Confirmed.

**LOW: build/dev config.** vite.config.js:30-32 puts esbuild.drop under build; Vite's esbuild option is top-level, so console stripping is Likely ineffective and console.log('Honeypot triggered ...') (150) and the success log at 182 probably ship. Confirm by grepping dist for "Honeypot triggered". vite.config.js:35 host: '0.0.0.0' exposes the dev server (with the 13 dev-only vulns) to the LAN whenever npm run dev runs.

**LOW: hash handling and form robustness.** App.jsx:561-573 sets activeSection to any hash string; no sink renders it, so no XSS (Confirmed). Unknown hashes render an empty main; the SearchAction schema at index.html:96 emits #discover?search=..., which the app does not parse, so that Google sitelinks entry lands on a blank page. App.jsx:166 calls inquiryType.replace before the try block, so a missing subject leaves the button stuck (DOM tampering only). No maxLength on name/email/message/preferredCountries (4354-4456). alert() at 191.

**LOW: SECURITY_STATUS.md vs reality:** claims headers "Enterprise-grade" citing _headers (false live until tonight), GA "placeholder ID" (false), honeypot and Vite 7 as "future" (both done). Needs rewrite.

**Confirmed clean:** no dangerouslySetInnerHTML, innerHTML, eval, iframes or target=_blank anchors; all four window.open calls pass noopener,noreferrer (108, 1381, 1929, 2111); search term rendered as React text (1191, 1731); localStorage holds only cookieConsent; robots.txt leaks nothing (trailing Disallow block after the Sitemap line is orphaned per spec, harmless); sitemap single URL.

## 2. Honeypot verdict: PRESENT
App.jsx:4341-4348 (name="website", className="hidden", tabIndex="-1", aria-hidden) plus check at 149. Stops form-driven bots only; direct API calls bypass it.

## 3. CSP compatibility notes (for the report-only policy)
- No inline executable scripts: index.html has only application/ld+json blocks (CSP-exempt) and the module script; Vite emits external chunks. Safe.
- Styles: 'unsafe-inline' present; React/vaul/Radix inline styles fine. Google Fonts are not loaded; delete the preconnects rather than widen CSP.
- GA4: script from www.googletagmanager.com allowed; hits go to *.google-analytics.com / *.analytics.google.com, both in connect-src. If Google Signals/ads features are on, stats.g.doubleclick.net and www.google.com will be blocked; report-only will show it.
- Vercel Analytics/Speed Insights in production load /_vercel/insights/script.js and /_vercel/speed-insights/script.js and beacon same-origin: covered by 'self'. Preview builds use va.vercel-scripts.com (production unaffected).
- EmailJS SDK is bundled; only connect-src https://api.emailjs.com is required.
- No YouTube embed (window.open), so no frame-src needed.
- HSTS preload only if the apex also serves HSTS and you intend to submit to the preload list.

## 4. Owner-dashboard actions (cannot see; must check)
- EmailJS: Account > Security: disable API calls from non-browser apps, set domain allowlist to europeansummercamps.com/www, enable reCAPTCHA (small code change to pass the token), set per-IP rate limit and auto-suspend threshold, check monthly usage and set a usage alert; Template: hard-code To, remove {{to_email}} (why: finding 1).
- Vercel: confirm plan (Hobby is non-commercial), enable Vercel Firewall/Attack Challenge Mode, set Spend Management alerts, review bandwidth graph for the PNG (why: finding 2); confirm no env vars hold secrets.
- Cloudflare: is the record proxied or DNS-only? DNS-only gives no caching/WAF/rate-limit. Add SPF, DKIM and DMARC (p=quarantine or reject) for europeansummercamps.com so nobody can spoof partnerships@ to camps you are now invoicing.
- GitHub: enable 2FA, secret-scanning push protection (free on public repos), Dependabot alerts.
- GA4: turn off Google Signals unless needed (CSP and consent scope).

## 5. Coverage
App.jsx read in full (10 segments to 4700). Read fully: src/main.jsx, index.html, public/_headers, public/robots.txt, public/sitemap.xml, vite.config.js, package.json, .gitignore, eslint.config.js, scripts/validate-camps.js, src/components/ErrorBoundary.jsx, docs/reference/SECURITY_STATUS.md, camps.js lines 1-100, 578-670, 1219-1240; camps.js remainder by grep (all URL fields, http:, image fields). Not read: node_modules, dist, docs/ except SECURITY_STATUS.md, scripts/*loader.mjs, src/components/ui/*, src/App.css, src/index.css, public/Guides/*.docx. No commands run; npm audit not executed.
