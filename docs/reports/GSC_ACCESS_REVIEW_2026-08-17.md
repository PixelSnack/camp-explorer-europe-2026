# Search Console access for the Claude agent: paired security review, 17 August 2026

*Lead and adjudicator: ESC Claude (Fable 5). Panel: security-audit-specialist (Fable, read-only, live web research + read of the installed server source) and GPT-5.6-SOL (adversarial, no web access), same brief (`GSC_ACCESS_REVIEW_2026-08-17_brief.md`). SOL's full text: `GSC_ACCESS_REVIEW_2026-08-17_sol.md`. The Fable agent's full report is reproduced in section 5. Every finding below is ACCEPTED, REJECTED with reason, or DEFERRED. Load-bearing claims were verified by the lead against Google's own pages.*

## 1. What was reviewed

On 17 Aug 2026 the owner (with the agent driving Chrome, owner watching) added the service account `claude-mcp@gen-lang-client-0613109458.iam.gserviceaccount.com` to the Search Console property `https://www.europeansummercamps.com/` (URL-prefix property; `sc-domain:` does not exist for this site) with permission **Full**. The MCP server is `mcp-gsc` v0.1.0 (real upstream: github.com/AminForou/mcp-gsc), OAuth scope `auth/webmasters` (read/write), service-account JSON key in `site-packages\mcp_gsc\`, exposing sitemap submit/delete and site add/delete tools to the LLM. The owner asked for a Fable + SOL safety review with field research (GitHub, Reddit, Hugging Face).

## 2. Verdict

**Full was disproportionate. Downgrade to Restricted (read-only) and fix the credential plumbing.** Both reviewers converged on this independently; the lead verified the permission table and agrees. Everything ESC needs (search analytics, performance, URL inspection, sitemap status, indexing issues) works at Restricted with the read-only scope. The only thing Full buys is sitemap submission, which for a one-URL site is a discovery hint, not a recrawl trigger, and which the owner can do in ten seconds when needed.

## 3. Adjudicated findings

| # | Finding | Source | Verdict | Action |
|---|---|---|---|---|
| 1 | Full permits sitemap submit/delete, URL removal requests, **disavow uploads**, reconsideration requests; Restricted is view-only (support.google.com/webmasters/answer/7687615, verified by lead) | Google table, SOL, agent | **ACCEPTED** | Downgrade to Restricted (owner, GSC UI) |
| 2 | SOL: "disavow requires Owner" | SOL | **REJECTED**: Google's table shows Disavow = Full ✓. Strengthens the downgrade case | none |
| 3 | A service account cannot sign into the Search Console UI; the public API has only searchanalytics, sitemaps, sites, urlInspection. Removals/disavow/reconsideration/users have no API. So a stolen JSON key **cannot** deindex the site; the "6-month removal" fear in the brief was wrong | agent (High), SOL (High) | **ACCEPTED** (lead: brief corrected) | none |
| 4 | Real blast radius of a stolen key at Full: full read of query/page data (+ the SA's GA4 Viewer data), submit a hostile sitemap, delete the sitemap (already-indexed URLs stay indexed), `sites.delete` = self-revocation only. At Restricted: read-only exfiltration only | agent, SOL | **ACCEPTED** | Restricted removes every write path |
| 5 | The greater risk is an injected agent driving the **owner-authenticated** Search Console browser tab (owner authority, UI actions reachable) | SOL, agent | **ACCEPTED** | Close owner-authenticated GSC tabs when the task is done; never keep one open while processing untrusted content |
| 6 | Read-only OAuth scope constrains only the honest runtime; a key thief can request the write scope. Permission tier is the real control | SOL | **ACCEPTED** | Tier downgrade first, scope second |
| 7 | mcp-gsc v0.1.0 registers `add_site`/`delete_site`/`delete_sitemap` unconditionally; upstream v0.3.3 disables them by default (`GSC_ALLOW_DESTRUCTIVE`) | agent (read source + upstream README) | **ACCEPTED** | Upgrade (Playground custody) |
| 8 | v0.1.0 ignores `GOOGLE_APPLICATION_CREDENTIALS`; reads `GSC_CREDENTIALS_PATH` or the site-packages copy. The env var in `~/.claude.json` is inert | agent (read source) | **ACCEPTED** (matches Aug memory note) | Set `GSC_CREDENTIALS_PATH`, remove site-packages copy (Playground) |
| 9 | `token.json` + `client_secrets.json` sit next to the key; server tries OAuth first. Could mean a human account is the active identity | agent | **ACCEPTED as hazard, REJECTED as active path**: `list_properties` was empty before the grant and `siteFullUser` after, so the service account is the identity in use | Delete artefacts, set `GSC_SKIP_OAUTH=true` (Playground) |
| 10 | Two key files on disk; unknown whether one or two keys in GCP | agent | **ACCEPTED** | Inventory keys in GCP, delete surplus, rotate, ACL (Playground) |
| 11 | Plaintext OAuth client secret for a different MCP server in `~/.claude.json` | agent | **ACCEPTED** (out of ESC scope) | Rotate at leisure (Playground/owner) |
| 12 | Key expiry org-policies unavailable on a no-organization project; Google recommends rotation over expiry | agent, SOL | **ACCEPTED** | Rotation + ACL |
| 13 | Two-account split (Restricted daily + Full on demand as second key) is theatre on one laptop | SOL, agent | **ACCEPTED** | Single account; tier toggle in UI when needed |
| 14 | Field evidence: no incident reports found for this setup; read-only scope is the norm among GSC MCP servers; upstream issues are functional only | agent (live search), SOL (NOT FOUND, no web) | **ACCEPTED** (absence is not safety) | Recorded |
| 15 | Deny destructive tools in Claude Code permissions as belt-and-braces | agent, SOL | **ACCEPTED** | DONE: `.claude/settings.local.json` denies `mcp__gsc__delete_site`, `delete_sitemap`, `add_site`, `submit_sitemap`, `manage_sitemaps` |
| 16 | The pip metadata repo URL (`aminfseo/mcp-gsc`) is wrong; real repo is `AminForou/mcp-gsc` | agent | **ACCEPTED** (brief corrected) | none |
| 17 | Norton TLS interception (`HTTPLIB2_CA_CERTS`) terminates TLS on GSC API traffic; tokens (not the key) could be visible to the AV | agent, SOL | **NOTED** | Accepted cost of the machine |

## 4. Actions

Done tonight (ESC side): deny list for destructive GSC tools; owner-authenticated GSC and EmailJS tabs closed after use; bridge note to Playground with items 7-12 (key custody is Playground's per CLAUDE.md); this record.

Owner: downgrade claude-mcp to **Begrænset/Restricted** in Search Console (Settings → Users and permissions → ⋮ → Rediger tilladelser). Lead verifies with `list_properties` (expects `siteRestrictedUser`).

Playground (bridge note `2026-08-17-to-playground-gsc-key-custody-actions.md`): upgrade mcp-gsc to 0.3.3, set `GSC_CREDENTIALS_PATH` + `GSC_SKIP_OAUTH=true`, delete site-packages key copy and OAuth artefacts, inventory/rotate keys in GCP, NTFS ACL, rotate the unrelated OAuth client secret.

Residual risk after all of the above: a stolen Restricted key still exposes query/page performance data and the SA's GA4 data (read-only, undetectable). Same-user malware or a shell-capable agent can still read whatever key exists on the machine. The largest un-mitigated risk is structural: an agent that reads untrusted camp websites and email holds live read credentials on a consumer Windows box with no audit trail the owner can read.

## 5. Fable security agent report (verbatim, delivered 17 Aug 2026 ~21:55)

**Headline: the brief's central fear is not reachable, but three things I found on disk are worse than what the brief describes.**

### A. Threat model, what a stolen key actually buys

A1. A service account cannot sign into the Search Console web UI. Service accounts are not Google accounts and cannot access Google product web interfaces; they are API-only principals. (High for the general rule, explicitly documented for Merchant Center; an explicit GSC-specific sentence: NOT FOUND.) https://developers.google.com/shopping-content/guides/how-tos/service-accounts

A2. Therefore the attacker's entire capability is Search Console API v1, which has exactly four resources: `searchanalytics.query`; `sitemaps` list/get/submit/delete; `sites` list/get/add/delete; `urlInspection.index.inspect`. There is no API endpoint for removals, disavow, change of address, international targeting, or user management. (High) https://developers.google.com/webmaster-tools/v1/api_reference_index. This contradicts the brief: the scenario "temporary removal ~6 months deindexes the only URL" is not achievable with the key. The Removals tool is UI-only and the key cannot reach the UI. Drop it from the threat model. (High)

A3. What the key can do, ranked by real damage: `sitemaps.submit` of a hostile sitemap (the actual SEO-damaging move; historically how compromised GSC access is abused; Medium, secondary sources: blog.sucuri.net/2015/09/malicious-google-search-console-verifications.html, wordfence.com/learn/recovering-website-seo-after-a-hack/); `sitemaps.delete` (removes the sitemap from GSC only; already-indexed URLs stay indexed; low impact for a one-URL SPA; High; developers.google.com/webmaster-tools/v1/sitemaps/delete); `sites.delete` ("Removes a site from the set of the user's Search Console sites": removes the service account's own access, does not delete the owner's property; effectively self-revocation; High; developers.google.com/webmaster-tools/v1/sites/delete); full read of query/page performance (competitive intelligence exfiltration; quiet, permanent, unloggable at your end).

A4. Full vs Owner in the UI (moot given A1): Full may submit sitemaps, remove URLs, disavow, request reconsideration. Full may not add/remove users, link Analytics, or delete the property; Change of Address is view-only. (High) https://support.google.com/webmasters/answer/7687615

A5. Correction to a bad search result you may also hit: several SEO blogs claim "Full/Restricted gives 403, the service account must be Owner." That is the Indexing API (`indexing.googleapis.com`, separate scope), not the Search Console API. Do not act on it. (High)

### B. Least privilege, Full is not justified

Read search analytics: Restricted, `webmasters.readonly`. URL Inspection: Restricted, `webmasters.readonly` explicitly accepted. Submit sitemap: Full, `webmasters`. Sources: developers.google.com/webmaster-tools/v1/prereqs; developers.google.com/webmaster-tools/v1/urlInspection.index/inspect. Restricted-tier per-method behaviour is inferred from the permission table, not enumerated by Google (Medium). The stated rationale for Full is weak: after a title/meta rework, resubmitting an unchanged single-URL sitemap does approximately nothing; sitemap submission is a discovery hint, not a recrawl trigger. The lever that accelerates recrawl is "Request Indexing" in URL Inspection, which is UI-only and absent from the API, so Full does not buy it either. Two-account split: theatre here. Changing the tier in the GSC dropdown takes ~20 seconds. Keep one account at Restricted, elevate to Full for the five minutes you genuinely need a submit, drop back.

### C. Agent-specific risk, the real exposure

C1. The installed version has no safety gate. `__version__ = "0.1.0"`. `add_site`, `delete_site`, `delete_sitemap`, and `manage_sitemaps(action="delete")` are all registered unconditionally, no confirmation, no env gate. (High)

C2. Upstream fixed this and you are 3 minor versions behind. README for v0.3.3 (July 2026): "By default, `add_site`, `delete_site`, and `delete_sitemap` are disabled", enabled only via `GSC_ALLOW_DESTRUCTIVE=true`. Upgrading is the single highest-leverage action in this review. (High) https://github.com/AminForou/mcp-gsc

C3. The injection path is live and demonstrated. The agent reads camp websites and email. The documented pattern is privileged access + untrusted input + external output channel. Real 2026 cases: JHU researchers hijacked Claude Code / Gemini CLI / Copilot via poisoned GitHub PR titles; Supabase/Cursor service-role exfiltration via support tickets. (Medium, secondary roundups) checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/; upguard.com/blog/mcp-security-incidents

C4. Restricted is the only mitigation that does not depend on the agent behaving. Tool allow-listing and confirmation gates fail open if the model is convinced; Google returning 403 does not.

### D. Key custody, three findings the brief gets wrong

D1. `GOOGLE_APPLICATION_CREDENTIALS` is inert for this server. mcp-gsc v0.1.0 reads `GSC_CREDENTIALS_PATH`, never `GOOGLE_APPLICATION_CREDENTIALS`. `.claude.json` sets the latter to `C:/Users/Soda/.claude/mcp-servers/service-account.json`. The server ignores it and falls back to the copy in its own package directory. (High, read from source)

D2. The server tries OAuth first, and OAuth artefacts are present. `SKIP_OAUTH` defaults to false and is not set. `token.json` and `client_secrets.json` both exist in the package directory. If that token is valid, the MCP server is authenticating as a human Google account, not the service account, plausibly an account with Owner rights on the property. Resolve this before anything else. (High that the code path exists; Unknown whether the token is live; not opened.)

D3. At least two service-account key copies exist on disk (site-packages + `.claude\mcp-servers\`). Whether they are the same key or two separate keys is NOT FOUND without opening them; check the key count in the GCP console instead.

D4. Storing the key inside `site-packages` means a `pip install --upgrade` destroys or resurfaces it, the same failure mode CLAUDE.md already records.

D5. Separate finding, unrelated to GSC: a plaintext Google OAuth client secret for a different MCP server sits in `~/.claude.json`. Not quoted. Treat it as exposed-at-rest and rotate at leisure.

D6. Org policies are unavailable: `iam.disableServiceAccountKeyCreation`, `constraints/iam.serviceAccountKeyExpiryHours` and the Key Exposure Response constraint are organization policies; an AI-Studio auto-project with no organization cannot enforce them. (Medium-High) docs.cloud.google.com/iam/docs/service-accounts-custom-constraints. Google's guidance: avoid service account keys where possible; do not chase key expiry in production; rotate, restrict file ACLs, delete surplus keys. docs.cloud.google.com/iam/docs/best-practices-service-accounts; docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys

### E. Field evidence

The repo name in the brief is wrong: `aminfseo/mcp-gsc` returns 404; the real project is `AminForou/mcp-gsc`, MIT, ~1.4k stars, v0.3.3. Open issues #37 (keyless/ADC auth), #42, #31, #9 are functional; no issue reports an actual deletion or credential incident. https://github.com/AminForou/mcp-gsc/issues. Read-only is the ecosystem norm: several competing GSC MCP servers advertise `webmasters.readonly` and state they do not request write access; one stores OAuth tokens in the OS keychain (Medium, aggregator READMEs) https://glama.ai/mcp/servers/integrations/google-search-console. NOT FOUND: any documented real-world incident of a leaked GSC service-account key being used to damage a site. NOT FOUND: substantive Reddit/HN/Hugging Face discussion of GSC MCP permission tiers; searches surfaced only vendor blogs and MCP registries.

### F. Verdict and ranked actions (under 30 minutes)

Restructure, then downgrade to Restricted. 1. Resolve which identity is in use (`GSC_SKIP_OAUTH=true`, restart, `list_properties`). 2. Delete `token.json` and `client_secrets.json` from the package directory. 3. Upgrade to mcp-gsc 0.3.3, leave `GSC_ALLOW_DESTRUCTIVE` unset, re-point via `GSC_CREDENTIALS_PATH`. 4. Downgrade the service account to Restricted; elevate only for the minutes a sitemap submit is needed. 5. One key, one place: keep `.claude\mcp-servers\service-account.json`, delete the site-packages copy, NTFS ACL to the owner only, outside OneDrive (it is). 6. GCP console → service account → Keys: delete surplus, diary rotation. 7. Deny-list `delete_*` and `add_site` in Claude Code permissions. 8. Later: rotate the OAuth client secret in `~/.claude.json`.

Residual risk after all eight: a stolen Restricted key still permits full exfiltration of query and page performance data, irreversible and undetectable. It cannot submit or delete sitemaps, cannot touch removals, disavow, or users, and cannot affect ranking. If step 1 reveals an Owner-level OAuth token was in use, treat that token as compromised, revoke it at myaccount.google.com, and audit the property's user and sitemap lists. The largest un-mitigated risk is not GSC: an agent reading untrusted camp websites and email holds live credentials to several Google properties on a consumer Windows box with no audit trail you can read.
