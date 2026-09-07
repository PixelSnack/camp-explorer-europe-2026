# Morning report for the owner, 7 September 2026

*Written by the lead at 04:45 after the AFK night (6 Sept 22:30 to 7 Sept 04:45, with the usage-limit pause from about 00:15 to 03:08). Nothing was sent to a third party except the one form the owner authorised. Everything below is committed; the owner pushes in GitHub Desktop.*

## What you asked for, done

**One Gmail draft per listed camp, none sent.** 64 drafts are in Gmail, all still drafts: 56 fee-bearing messages (48 template drafts for the summer listings, with Enforex and Village Camps as one two-camp message each, plus tailored letters to Les Elfes, Funside, Camp Suisse, La Garenne, Auersperg, Ridgway, Camp Semenic and Bold Earth) and 8 winter operator questions. Every fee-bearing draft carries your 00:20 framing: the invoicing details are requested, the value delivered is stated, the listing continues through 2026, the fee or Premium now keeps them listed in 2027, and the next invoice date is 1 September 2027. The template is in `docs/drafts/2026-09-06-wave2-data-request-and-base-fee-DRAFT.md`.

**Addresses.** Four read-only agents read every operator's contact page; I then confirmed each address as a string on the cited page, or by a second fetch, or by decoding Cloudflare and entity-encoded addresses. None was guessed. Two camps have no email at all: Bold Earth (phone and Calendly only) and Romanian United Fund (form only, and its domain is blocked for my browser tab); their drafts have an empty recipient and say so in the first line.

**Forms.** Atlas Summer Courses (the renamed Oxford Summer Courses) received the message through its contact form as a group and agency enquiry; the site confirmed receipt. HIF's form is an admissions form that demands a phone number, a student's name and a date of birth, so it was not submitted; the question stays in its draft, and the phone is +41 81 861 22 11.

**Exempt.** LINEŠA gets no fee message: your 2 September reply promised the standard listing stays free for 2027, and their project manager wrote on 24 August that the listing is not relevant this season.

**Invoice.** The template, the policy file and the ILC draft in the bridge folder now say "VAT exempt" with no reason, and name ResourceHub as the umbrella company for EuropeanSummerCamps.com. The template carries restrained European Summer Camps branding (the site mark and wordmark, a blue rule and total line, a soft blue VAT note); a rendered preview was checked. The PDF already sent to ILC stays as it is.

## Winter selection: every answer followed up

Recorded in `docs/reports/WINTER_VETTING_2026-09-06.md`, gate status at the end.

- **Ready for rows (eight, gate needs four):** Les Elfes, Lovell, Ecole d'Humanité, friLingue Braunwald, friLingue Liddes, FILOLO, Préfleuri (2027 fees found in a PDF the fees page does not link), La Garenne (its winter conditions PDF answered the inclusion question in full). Rows wait for your go; I re-read every figure in a browser and read the Google rating there when I write them, since no agent could reach Google this night.
- **Waiting on operators (drafts made):** AR-Sport (lodge exclusivity, English booking), Camp Suisse (transfer-free price, hotel exclusivity), HIF (lift pass, hire), LPM (lift pass, nights), Nuovaera (booking opens 1 November), Djuringa, Croq' Vacances, Vacances pour tous, Tábory Mamut.
- **Your decisions:**
  1. Djuringa: Trustpilot 4.4 from 171 and a UNOSEL label, but the newest review (29 August) alleges repeated physical assault of a child by other participants, with further one-star accounts of weak supervision. I recommend reading the Trustpilot page before any row.
  2. Camp Suisse: CHF 2,500 bundles the Geneva or Aigle transfer; no transfer-free price exists. Does a bundled airport transfer count as transport in the price?
  3. Helsingin Nuoret Kotkat: EUR 195 includes the coach from Helsinki, no drop-off price; the operator is asked, and the camp is otherwise good.
  4. Tábory Mamut: the best new find (own base, six 2027 sessions, CZK 7,100 without transport), but the legal entity dates from 2023 against a "since 2008" claim, and a parents' forum thread alleges pressure against negative reviews.
  5. Piispala: closed. No camp on its site can be booked by an individual family for February 2027; its camps are sold to congregations, municipalities and clubs.
- **Parked with a month to look again:** Kazimírka, Poszukiwacze, Volareza, Wachumba (October); One Ski School, Lingvo, snowfun4kids (November); KFUM Vatnaskógur (February). **Rejects confirmed:** Champions' Camp (a self-described tour operator), Ski-Club Rötteln (coach in the price), mountain-action (sole trader, no instructor qualifications stated).

## Wave 2 corrections landed

| Camp | Change | Commit |
|---|---|---|
| Camp Semenic Explorer (ID 31) | Dates set to the verified July 2025 edition; the linked page publishes no 2026 or 2027 camp; operator asked | 2bd99c7 |
| Oxford Summer Courses (ID 5) | Renamed Atlas Summer Courses, Oxford; 2027 season, ages 13 to 17, Plus tier GBP 6,995 re-read on the new site; booking URL updated | 6c63d1a |

**Flag, no change made:** EUROCAM Bohemia (ID 9), our most-clicked listing with 86 referrals since March, is organised by SYKA AGENCY a.s., a Prague company that calls itself a travel agency on its own contact page. The camp-operator criterion needs your judgement before the 2027 update.

## Weekly watch (first of the series, `docs/reports/WEEKLY_WATCH_2026-09-07.md`)

| Measure, 31 Aug to 6 Sept | Value |
|---|---|
| Search Console clicks | 39 |
| Search Console impressions | 1,867 |
| Average position | 13.6 |
| GA4 active users | 33 |
| GA4 sessions | 65 |
| Booking clicks | 34 |

Post-season trough; no signal to act on.

## After the push

Run the production check: `node scripts/cdp-verify.mjs --url https://www.europeansummercamps.com/ --hash discover --width 1280 --dump x.txt` and look for the Atlas card name and the Camp Semenic dates; then a Claude in Chrome look at the two cards on desktop and phone width.

## Still running when this was written

A research agent re-verifying the four new summer camps (Furudals, Club Adventure, Stadium Sports Camp, Leksand) and the security agent reviewing your Cloudflare security-insights CSV. Their findings are appended below when they arrive; nothing from them changes the site without my own re-read of every figure.

## Records

- Session record: `docs/reports/SESSION_2026-09-06_WINTER_WAVE2.md` (AFK stretch, draft ledger with every draft id).
- Pickup block: NEXT_STEPS.md START HERE (rewritten 03:50).
- Lessons: eight new entries at the end of LESSONS_LEARNED.md.

## Appended 05:05: Cloudflare security-insights review (security agent, adjudicated by the lead)

The agent read your CSV and verified every claim against live DNS. Both hostnames are DNS-only (nothing passes through Cloudflare's proxy), which settles three of the five rows.

| Cloudflare row | Verdict | Why |
|---|---|---|
| Unproxied A record (moderate) | Ignore | The exposed address is Vercel's anycast edge, not an origin of ours; proxying would put two CDNs in series, risk redirect loops, hide visitor IPs from Vercel Analytics and add a hop to a site whose speed is a ranking asset. |
| Bot Fight Mode (moderate) | Ignore | Inert while DNS-only; if proxied it would challenge the AI crawlers robots.txt deliberately admits (ChatGPT referrals were about a fifth of sessions). |
| AI Labyrinth (low) | Ignore | Feeds decoy content to the AI crawlers we court. |
| security.txt (low) | Done in the repo | `public/.well-known/security.txt` added (contact@, expires 7 Sept 2027); live after the push. |
| DMARC (low in the CSV, the one real finding) | Your action in Cloudflare DNS | `_dmarc.europeansummercamps.com` does not exist. SPF and the Cloudflare DKIM selector are fine for the forwarding. |

**The DMARC record to add** (Cloudflare DNS, type TXT, name `_dmarc`):

```
v=DMARC1; p=none; rua=mailto:contact@europeansummercamps.com; fo=1; adkim=r; aspf=r
```

Zero delivery risk at `p=none`; aggregate reports arrive as XML attachments for a few weeks. The caveat that matters: mail sent from the five addresses through Gmail's "send mail as" without a custom SMTP server is signed by gmail.com and would fail a strict policy, so stay on `p=none` until 30 days of reports show our own sources aligned, then `p=quarantine; pct=25`, then full quarantine; reject is not worth the risk. A CAA record is optional and a wrong one breaks Vercel's certificate renewal, so not now.
