# Session report, 12 September 2026 (evening): Revolut Merchant, payment flow, draft wording

*ESC Claude. Owner present throughout. Nothing was sent to any third party. All drafts remain drafts.*

## What was done

**Revolut Business Merchant (owner logged in himself, Claude never entered credentials)**
- Invoice numbering prefix `2026`; Revolut strips leading zeros, so the format is `2026-N` (next is `2026-2`).
- Payment schedule default 14 days after sending (saved twice; the first save did not persist).
- PDF template "Default": logo (tent mark uploaded as business avatar), title "Invoice", bank details on PDF off, no VAT number, header `CVR 46200462 | partnerships@europeansummercamps.com | europeansummercamps.com`, footer "Invoice note" with the VAT line.
- Payment page branding published: tent logo from `public/favicon.svg` at 1024 px, colour #2563EB, website on, phone on, address hidden; customer-facing email changed to partnerships@. Statement descriptor left at "ResourceHub".
- Test invoice `2026-1` to ISC SARL created for comparison, closed with "Later", then **cancelled** (status Cancelled).
- Two payment links created, Active, single use, EUR 199: "Invoice 2026-001 (International Summer Camps, Premium listing)" and "Invoice 2026-002 (Les Elfes International, Premium listing)". Not shared. URLs not stored in the repo.
- Fees confirmed by Revolut support (relayed by the owner): EEA consumer cards and Revolut Pay 1% + EUR 0.20 (EUR 2.19 on 199); Amex 1.7% + 0.20; commercial and non-EEA 2.8% + 0.20; EUR lands unconverted; EUR to DKK free on weekdays within DKK 13,500 a month.
- Playground informed: `Claude bridge/2026-09-12-to-playground-revolut-merchant-setup-and-what-it-offers.md` and `shared-machine-facts.md` §6 (account-wide branding and numbering affect every brand).

**Owner decisions on the payment flow**
1. ILC (invoice 2026-001, due 17 Sept) and Les Elfes (2026-002, due 24 Sept): no second invoice; if unpaid after the due date, the reminder carries the payment link in one sentence. Reminders are drafted only after the due date. Calendar reminders set for 18 and 25 Sept, 09:00.
2. Everyone else, after their first reply: Revolut invoice created in the app and closed with "Later", then PDF plus pay link in our own mail from partnerships@.
3. First contact: no link, no invoice. Payment sentence in the template and in all 57 outreach drafts: "Your invoice for the 2027 season follows as soon as we have your details. It is a standard invoice, payable by bank transfer, and it also offers a secure online card payment should you prefer that; either way there is nothing to set up on your side. The next invoice date after that is 1 September 2027." Verified on a fresh listing of every draft: 57 carry it exactly once, no old wording, no URL, no em dash, recipients and subjects unchanged.
4. ILC and Les Elfes reply drafts shortened to: card updated as you asked, tell us if anything should change, thank you. New threaded drafts; the long ones retitled [SUPERSEDED, DISCARD]. **13** superseded drafts for the owner to discard.

**Site**
- ILC card highlight now "Accommodation at boutique Hotel Au Vieux Moulin in the heart of Megeve" (commit 5a7bb1f). Push before the ILC reply is sent.

## Commits (all local at the time of writing; owner pushes in GitHub Desktop)
5a7bb1f ILC boutique hotel line · 5499d71, b86061e, aff5a7c, 49a744e NEXT_STEPS · 539e7e9, 285e3ec outreach template · plus the lessons and this report.

## Open
- `2026-N` numbering (cosmetic) and the ESC branding on the shared payment page for other brands: owner decisions, Playground informed.
- Production check of the ILC card after the push (desktop and phone width).
