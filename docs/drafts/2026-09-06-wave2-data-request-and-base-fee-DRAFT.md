# DRAFT, never sent: Wave 2 message to every listed camp, with the administration fee and the Premium option

*Written 6 September 2026 by ESC Claude at the owner's direction; re-framed 7 September 2026 on the owner's instruction (invoice details requested, value made clear, listing continues through 2026, next invoice 1 September 2027, successful-business tone). Every message is sent by the owner from partnerships@, one camp at a time; Claude only drafts. Web addresses are written with a space before the top-level domain, as in "www.site .com", and the owner closes the space (Gmail draft rule). The Gmail drafts created on 6 and 7 September carry this text with each camp's own lines.*

## Owner decisions

1. **Administration fee: EUR 79 per year** for every listing from the 2027 cycle; it covers the listing and its seasonal re-verification. Premium EUR 299 a year, EUR 199 the first year on the 2027 cycle, up to three camp cards, own image allowed; the administration fee is included in Premium.
2. **Stay-listed rule:** every listing continues for the full 2026 season at no charge; a camp that does not respond stays listed for now.
3. **Framing (7 Sept):** ask for the details the invoice needs; state the value delivered and continuing; say we very much hope they pay the fee or take Premium now so they stay listed in 2027; next invoice date 1 September 2027; the message projects a successful business (no apology, no mention of costs).
4. **Invoice wording (7 Sept):** "VAT exempt", never the reason; ResourceHub is the umbrella company for EuropeanSummerCamps.com.

## Template (English)

Subject: Your listing on European Summer Camps: the 2027 season, and your listing from 2027

Dear [name or team at CAMP],

We list CAMP on European Summer Camps (www.europeansummercamps .com), the directory of verified residential camps that families across Europe use to plan their children's summers. Your listing has been live since [month year], and it is kept accurate for you: every season we re-verify dates, prices and ages against your own pages, and every family who clicks through arrives on your booking page tagged as coming from us, visible in your analytics under the source "europeansummercamps". [If ten or more: Since March, when we began counting referrals per camp, your listing has sent N families through to your site.]

Your listing continues for the full 2026 season at no charge. From the 2027 season every listing carries an annual administration fee of EUR 79, which covers the listing and its yearly re-verification, and we very much hope you will pay it now, or sign up for Premium, so that CAMP stays listed for 2027. Premium is EUR 299 a year, or EUR 199 for the first year when taken on the 2027 cycle, and gives your camp a highlighted card at the top of its category, a video button and up to four updates a year, with the administration fee included. Your invoice for the 2027 season follows as soon as we have your details; the next invoice date after that is 1 September 2027.

So that we can invoice you correctly, please send us:

- The legal name of the operator and the invoicing address
- Your VAT or company registration number
- The email address that should receive the invoice

And for the 2027 listing itself: session dates, the per-child price for one session and what it includes, ages accepted, and the page where families should book.

We check every detail against your own pages before it goes live, and we correct it as soon as you tell us. If you have any questions, reply to this email and I will answer personally.

Kind regards,

Søren Thoning
European Summer Camps
partnerships@europeansummercamps .com

## Notes for the sender

- Fill the bracketed fields from camps.js (the listing month from the first commit that added the camp) and the referral figure from `scripts/ga4-pull.py --camp "<name>"` (only where ten or more).
- Camps already in a thread (Funside, Les Elfes) get the same substance inside their thread. LINEŠA is exempt for 2027 (the 2 September message promised the standard listing stays free).
- Two-camp operators (Enforex, Village Camps) get one message covering both listings; a Premium covers up to three cards.
- Invoicing follows FEATURED_LISTINGS_POLICY.md section 4 (ResourceHub, EUR, VAT exempt, bank details only on the invoice, never in the repo).
- No em dash anywhere in the message; under 300 words.
