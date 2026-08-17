# Security review

## Executive verdict

**Restructure. Do not leave this service account at Full for daily LLM use.** [High]

Use **Restricted** for routine analytics and URL inspection, switch the MCP server to the `.readonly` scope, and remove all mutating tools. Submit the sitemap manually as the owner, or elevate a separate credential only for a short, supervised operation. A Full credential stored on the same machine and accessible to the agent is not a meaningful separation. [High]

## A. Threat model and exact permissions

Google’s permission table is here:  
https://support.google.com/webmasters/answer/7687615

| Action | Restricted | Full | Public API exposure |
|---|---:|---:|---|
| Read Search Analytics | Yes | Yes | `searchanalytics.query`, including with `.readonly` scope. [High] |
| URL Inspection | Yes | Yes | Inspection works with `.readonly`. The API does not provide live testing or request-indexing. [High] |
| View sitemaps | Yes | Yes | List/get support read-only access. [High] |
| Submit or delete sitemaps | No | Yes | `sitemaps.submit` and `sitemaps.delete` require the read/write scope and sufficient property permission. [High] |
| Temporary URL removal | No | Yes | Full users can request removal through Search Console. Google describes this as blocking results for about six months. [High] |
| Manage users or ownership | No | No | Owner required; no public Search Console API for this. [High] |
| Change of address | No | No | Verified owner of both properties required; no public API. [High] |
| Upload disavow file | No | No | Property owner required; no public API. [High] |
| International targeting | N/A | N/A | The report and country-targeting feature were deprecated in 2022. [High] |
| Delete property globally | No | No | Search Console has no destructive global “delete website/property” operation. [High] |

Sources:

* Removals: https://support.google.com/webmasters/answer/9689846
* Sitemaps: https://support.google.com/webmasters/answer/7451001
* Change of address: https://support.google.com/webmasters/answer/9370220
* Disavow: https://support.google.com/webmasters/answer/2648487
* International targeting retirement: https://developers.google.com/search/blog/2022/08/international-targeting-deprecation
* API reference: https://developers.google.com/webmaster-tools/v1/api_reference_index

**The six-month deindexing scenario requires an important qualification.** The Full identity is authorized to make removal requests, but Google exposes no documented public removal API. Service accounts do not ordinarily sign into the Search Console browser UI. Therefore, possession of the JSON key alone has no documented supported path to submit a removal request. [High for documented API absence; Medium for declaring every undocumented route impossible]

A prompt-injected agent controlling the owner’s already-authenticated browser is much more dangerous. It could potentially issue the removal using the owner’s authority, independently of the service-account key. [High]

`sites.delete`, exposed as `delete_site`, only removes the property from the authenticated identity’s Search Console site set. It does not delete the website, remove the owner’s property, or deindex the URL. It can lock the service account out and disrupt automation. [High]  
https://developers.google.com/webmaster-tools/v1/sites/delete

Deleting a submitted sitemap removes it from the report. Google says this does not make Google forget already discovered URLs. For this one-page site, the immediate ranking effect should be limited, though it can impair future discovery or diagnostics. [High]  
https://support.google.com/webmasters/answer/7451001

The key also inherits the service account’s GA4 Viewer access and any undiscovered GCP/IAM permissions. An attacker can read whatever GA data that identity is authorized to access. Inventory the whole identity, not only Search Console. [High]

### OAuth scope caveat

OAuth scope does not override Search Console property permissions. Both must authorize an operation. [High]

Conversely, changing the MCP to `.readonly` does **not** constrain someone who steals the JSON key. The key holder can request a new token with the `webmasters` scope. Downgrading the identity to Restricted is therefore the stronger control; read-only scope mainly constrains the honest MCP runtime. [High]  
https://developers.google.com/webmaster-tools/v1/how-tos/authorizing

## B. Least privilege

* Search Analytics works with Restricted and `.readonly`. [High]
* URL Inspection works with Restricted and `.readonly`. [High]  
  https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
* Sitemap submission requires Full. [High]
* The normal URL Inspection API does not request indexing, so Full adds nothing for inspection itself. [High]

Full is functionally necessary for automated sitemap submission, but not proportionate as a permanent daily permission for a one-URL property. [High]

A split is useful only if the Full credential is absent from the agent environment except during the operation. A second Full JSON key stored on the same laptop, readable by Claude Code, would largely be security theatre. [High]

## C. Agent-specific risk

Untrusted camp pages and emails can contain instructions aimed at the LLM. If those instructions influence tool selection, the current MCP permits sitemap deletion/submission and removal of its own property association. [High]

Recommended layers:

1. Set the Search Console identity to Restricted. [High]
2. Change MCP authorization to `.readonly`. [High]
3. Remove `delete_site`, `delete_sitemap`, `submit_sitemap`, and `add_site` from the server code or expose a read-only fork. [High]
4. Verify Claude Code’s installed-version tool permission controls and deny mutating GSC tools by default. Exact 17 Aug 2026 behavior must be verified. [Low]
5. Do not let the agent control an owner-authenticated Search Console browser while processing untrusted content. Use a separate browser profile and close it afterward. [High]
6. Treat confirmation prompts as secondary protection. A plausible injected explanation can induce approval, especially under time pressure. [High]

Tool filtering alone is insufficient if Claude Code can run PowerShell/Python as the same Windows user. It can read the JSON or call Google APIs directly. [High]

## D. Key custody

Storing a credential inside `site-packages` is poor practice. Package upgrades, uninstallers, dependency code, malware, and any process running as the same Windows user can access it. Moving it does not create isolation, but prevents accidental packaging or overwrite. [High]

`GOOGLE_APPLICATION_CREDENTIALS` contains only the path, not the private key. The JSON itself is the secret. [High]

Actions:

* Move it to a dedicated non-repository, non-OneDrive directory under `%LOCALAPPDATA%`. [High]
* Restrict the directory ACL to the owner, SYSTEM, and Administrators. This does not stop same-user malware or the agent. [High]
* Search Git history, shell logs, MCP logs, crash reports, and backups for accidental copies. [Medium]
* Rotate now: create a replacement, test it, then explicitly delete the old key. Rotation without deleting the old key achieves nothing. [High]
* Review all service-account keys, IAM roles, enabled APIs, GA access, and project owners. The “AI Studio project” origin provides no security boundary. [High]

Google recommends avoiding service-account keys where practical and protecting/rotating those that remain:  
https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys

Keys do not expire by default. `constraints/iam.serviceAccountKeyExpiryHours` can impose lifetimes on newly created keys through Organization Policy, but availability and authority on this personal “No organization” project must be checked. It is not a substitute for deleting the existing key. [Medium]  
https://cloud.google.com/iam/docs/service-account-key-expiry

Norton TLS interception should not receive the private key because the key signs authentication assertions locally, but intercepted or logged access tokens may be exposed for their limited lifetime. Do not work around interception failures by disabling TLS verification. [Medium]

## E. Field evidence

I have no live web access and cannot verify the state of these sources on 17 Aug 2026.

* `aminfseo/mcp-gsc` issues/PRs reporting credential or destructive-tool incidents: **NOT FOUND**
* Other GSC MCP repositories documenting standard permission choices: **NOT FOUND**
* Reddit r/SEO, r/TechSEO, r/bigseo, r/ClaudeAI, or r/mcp incidents involving this exact setup: **NOT FOUND**
* Hugging Face reports or deployments: **NOT FOUND**
* Blogs/forums with verified incidents or consensus permission levels: **NOT FOUND**

Repository to verify manually: https://github.com/aminfseo/mcp-gsc

Absence of found reports is not evidence of safety, especially for a small v0.1.0 project. [High]

## F. Ranked actions under 30 minutes

1. **Downgrade the service account to Restricted immediately.** [High]
2. **Stop giving the agent access to an owner-authenticated Search Console browser.** [High]
3. **Switch MCP to `.readonly` and disable/remove all mutating tools.** [High]
4. **Submit the sitemap manually as owner when needed.** [High]
5. **Rotate the JSON key, delete the old key, and move the replacement out of `site-packages`.** [High]
6. **Restrict ACLs and confirm the new directory is outside OneDrive and backups.** [High]
7. **Audit the service account’s GA4 and GCP permissions.** [High]

Residual risk remains: a stolen Restricted key can expose Search Console analytics, URL status, GA4 data, and any other permissions attached to the identity. Same-user malware or a shell-capable agent can still steal the replacement key. The proposed changes materially remove the documented ranking-impacting mutations from normal agent operation. [High]