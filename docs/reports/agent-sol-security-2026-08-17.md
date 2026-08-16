# SOL (gpt-5.6-sol, effort=high) adversarial security review, 17 Aug 2026

*External model output, verbatim. Adjudicated by the lead in HEALTH_CHECK_2026-08-17.md. Not authoritative.*

(A) Verdict on proposed vercel.json with concrete edits if any

The proposal is functionally compatible with the shown application, but the JSON as written is invalid. In JSON, `\.` is not a valid escape:

`"source": "/(.*)\.(png|jpg|jpeg|webp|avif|svg|ico)"`

Use:

`"source": "/(.*)\\.(png|jpg|jpeg|webp|avif|svg|ico)"`

or omit the cache rule from the first security-header deployment. Otherwise Vercel should reject the configuration and no headers will be deployed.

Header compatibility:

- X-Frame-Options, nosniff, Referrer-Policy, and Permissions-Policy do not conflict with shown functionality.
- CSP is report-only, so it cannot currently break anything.
- GA4 script loading is covered by `www.googletagmanager.com`; its collection endpoints are covered.
- EmailJS is bundled as same-origin JavaScript and its API request is covered by `connect-src https://api.emailjs.com`. It does not need to be in `script-src` or `form-action`.
- Vercel Analytics and Speed Insights use same-origin scripts/endpoints, covered by `'self'`; `vitals.vercel-insights.com` is also allowed.
- `style-src 'unsafe-inline'` permits React style attributes and the inline `<p style="...">`.
- Hash navigation is unaffected.
- `img-src ... https:` is complete but broad. Restrict it to inventoried image hosts if camp data does not require arbitrary HTTPS images.

One known enforcement issue is the inline structured-data script:

`<script type="application/ld+json">`

It is not authorized by `script-src`. Expect a report-only violation. Before enforcement, add a SHA-256 hash for its exact production content. Do not add general script `'unsafe-inline'`.

There is no reporting endpoint, so “real traffic” violations are only visible in individual browser consoles. A manual production console test is valid but not comprehensive.

`interest-cohort=()` is obsolete and ignored by current browsers. Replace it with `browsing-topics=()` if that privacy control is intended.

HSTS `includeSubDomains` is reasonable only after confirming every current and delegated subdomain supports HTTPS. MX/email delivery is unaffected, but webmail, autodiscover, or future third-party web subdomains could be affected. Confirm the header is returned from the apex itself, because an HSTS header seen only on `www` does not protect sibling subdomains. Do not add `preload` without a full DNS/subdomain review.

The one-day image cache is safe but reduces caching compared with the ignored one-year rule. Hashed Vite assets can safely remain immutable; stable public filenames should not.

(B) Findings ranked by severity

1. EmailJS can be abused outside the form

What: A low-skill attacker can replay the EmailJS request directly, bypassing the honeypot, browser validation, and submit-button state. Likely impacts are inbox spam and EmailJS quota exhaustion. If the template accepts caller-controlled `to_email`, it may also permit sending through the configured service to arbitrary recipients.

Evidence:
`to_email: recipientEmail`
`emailjs.send('service_vnise8u', 'template_lm9wnse', templateParams, 'RLTeapLFs4m6Y18HQ')`

The JSX has a honeypot but no server-side rate limit or CAPTCHA. Name, country, and message fields have no `maxLength`.

Severity: Medium

Smallest fix: Enable EmailJS-supported CAPTCHA and account quotas/alerts, restrict allowed origins where available, and hard-code recipients in EmailJS templates rather than accepting `to_email`. Add sensible `maxLength` values. For reliable abuse prevention, proxy submission through a Vercel function that validates Turnstile and rate-limits requests.

Confidence: Likely. Client replay is possible; actual quota, origin, CAPTCHA, and recipient restrictions in the EmailJS dashboard were not provided.

2. Production is currently frameable

What: An attacker can embed the live site in a deceptive page and overlay instructions or controls to induce contact-form or outbound-link clicks. There is no account or payment action, limiting impact.

Evidence: Production is confirmed to have `NO X-Frame-Options`, while the proposed `frame-ancestors 'none'` is report-only.

Severity: Low

Smallest fix: Deploy the proposed enforced `X-Frame-Options: DENY`. When CSP is enforced, retain `frame-ancestors 'none'`.

Confidence: Confirmed

3. Development dependency advisories affect the build chain, not the deployed runtime

What: The reported 13 advisories are not demonstrated production exploits because the affected packages are dev-only. They still matter in GitHub/Vercel builds if an advisory concerns malicious input, plugins, or install-time behavior.

Evidence: Vite, Rollup/PostCSS-related tooling, Sharp, and ESLint are under `devDependencies`; the stated audit result is zero production vulnerabilities.

Severity: Low

Smallest fix: Review the individual advisories, update compatible versions, commit the lockfile, use `npm ci`, and enable dependency update alerts. Do not treat the aggregate count as evidence that the live SPA is exploitable.

Confidence: Likely

4. No demonstrated search XSS or window.opener abuse

What: The shown search path performs string comparisons and exposes no HTML execution sink. Booking windows explicitly disable opener access. The EmailJS public key, service ID, template ID, and GA measurement ID are identifiers intended to appear in browser code, not secrets.

Evidence:
`camp.name.toLowerCase().includes(term)`
`window.open(trackedUrl, '_blank', 'noopener,noreferrer')`

Severity: Low residual risk

Smallest fix: Validate booking URLs with `url.protocol === 'https:'` before opening them. Continue avoiding `dangerouslySetInnerHTML`, `eval`, and HTML assignment.

Confidence: Confirmed for the shown search and window-opening paths. Hash handling was not shown sufficiently to assess.

5. No confirmed referrer or consent-gating defect

What: Booking links use `noreferrer`, and the added UTM values are intentional destination parameters, not Referer leakage. GA4 is initialized only after stored explicit acceptance. The supplied context states Vercel analytics is similarly gated.

Evidence:
`window.open(..., 'noopener,noreferrer')`
`if (cookieConsent === true) ... initializeGA4()`

Severity: Low

Smallest fix: No security fix established. Document UTM partner analytics and EmailJS processing accurately in the privacy policy.

Confidence: Confirmed for the shown behavior

(C) What you could NOT assess from this material

- The omitted `handleHashChange` implementation, including hash allowlisting, DOM sinks, and redirect behavior.
- Actual camp booking URL schemes and external image/font hosts because `camps.js` and full CSS were not supplied.
- EmailJS dashboard restrictions, template recipient configuration, quotas, CAPTCHA, retention, and processing region.
- Complete DNS inventory and HTTPS support for all subdomains.
- Individual npm advisory applicability, lockfile integrity, GitHub protections, and Vercel build settings.
- Privacy-policy accuracy, consent withdrawal, GA cookie deletion, EmailJS DPA/transfers, and data-retention practices.