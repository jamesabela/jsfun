# JSFun: PDPA and international privacy considerations

Last updated: 18 November 2026

This is an internal working document for James Abela. It records the project's circumstances, technical safeguards and questions about applicable privacy law. It is not legal advice or a declaration of compliance.

The public explanation is in [privacy.html](privacy.html). Technical findings, provider details and outstanding actions are in [PRIVACY_AUDIT.md](PRIVACY_AUDIT.md).

## Project circumstances

James describes JSFun as a free educational project that makes no money. Its main audiences are in the US, Australia, Thailand, UK and EU. James is based in Malaysia.

The reviewed first-party code provides no JSFun accounts or central database of student submissions. Student work is generally processed in the browser, with some tools saving drafts locally or allowing downloads and sharing links.

This does not mean that no information is processed anywhere:

- GitHub Pages receives network requests to deliver the site.
- External libraries, images, remote files and loaded embeds contact their providers.
- First-party analytics (GoatCounter) has been completely removed; no analytics or tracking requests are sent by JSFun.
- James receives information that people choose to submit through the Google Forms contact route.
- Shared links and exported activity logs can contain work or personal information, depending on what the user enters and shares.

Network requests do not themselves make the project commercial. Provider processing and James's own processing should be assessed separately rather than treating all provider activity as data collected directly by James.

## Malaysia: does the PDPA apply?

Section 2 of Malaysia's Personal Data Protection Act 2010 connects its application to processing personal data in respect of commercial transactions. Section 4 defines commercial transactions by their commercial nature, including matters relating to supplying or exchanging goods or services, whether contractual or not.

Being based in Malaysia is not, by itself, enough to establish that all JSFun activities fall within the Act. Equally, having no income is not a universal exemption: a free service can have a commercial connection, for example when it supports a paid service.

Based on James's description of JSFun as an independent, free educational project with no earnings, there is a reasonable argument that its operation lacks the relevant commercial connection. This document does not make a definitive finding of exemption. Reconsider the position if the site becomes connected to paid services, commercial school arrangements, advertising or other commercial activities.

Source: [Official Act 709, 2026 reprint, sections 2 and 4](https://pdp.gov.my/wp-content/uploads/2026/10/Akta-709-cetakan-semula-2026-BI.pdf).

## Language of the privacy notice

Where the Malaysian PDPA notice requirement applies, section 7(3) requires the notice in both the national language and English. An English-language website does not remove that requirement.

James has chosen an English-only notice for the current site because PDPA applicability has not been established. This is a project decision under an unresolved scope assessment, not a confirmed legal exemption. Restore and review a Bahasa Malaysia version if applicability is established. The entire educational site does not need translation merely because a bilingual privacy notice is required.

Source: [Malaysian Commissioner's quick guide to privacy notices](https://www.pdp.gov.my/wp-content/uploads/2025/01/A-Quick-Guide-to-PRIVACY-NOTICE.pdf).

## International users

A visitor's location alone does not determine every obligation. Different laws examine factors such as the operator's establishment, the intended audience, the processing involved, commercial status, thresholds and behavioural monitoring. The Malaysian commercial-transaction test must not be assumed to apply elsewhere.

| Jurisdiction | Relevant scope considerations | Implication for JSFun |
| --- | --- | --- |
| EU | GDPR Article 3(2) can cover overseas processing related to offering services to people in the EU, even without payment, or monitoring their behaviour there. Mere website accessibility or incidental visitors does not establish a targeted offering. | Assess intended audience, promotion, school relationships and actual tracking. No income is not an exemption. Do not automatically equate limited aggregate statistics with behavioural monitoring. |
| UK | UK GDPR can cover overseas services offered to people in the UK or monitoring their behaviour there. | Assess the relevant connection and personal-data processing. Children's privacy and storage/access requirements need separate consideration where applicable. |
| Thailand | PDPA section 5 covers certain overseas processing connected to offering services to people in Thailand regardless of payment, or monitoring behaviour there. | Do not rely on the site's free status to exclude the Thai PDPA. Assess the service's connection to users in Thailand. |
| Australia | Most small businesses with turnover of A$3 million or less are exempt from the federal Privacy Act, subject to exceptions. Overseas operators also need an applicable Australian link. | Australian visits alone do not establish coverage. Check exceptions and context rather than assuming either coverage or exemption. |
| US | COPPA concerns covered commercial services directed at under-13s, or with actual knowledge of collecting their personal information. Certain third-party collection is included. State laws have different scopes and thresholds. | No earnings alone does not establish exempt nonprofit status. Review children's data practices and external services. No comprehensive 50-state assessment has been completed. |

Sources:

- [EDPB: GDPR territorial scope](https://www.edpb.europa.eu/documents/guideline/guidelines-32018-on-the-territorial-scope-of-the-gdpr-article-3-version-adopted_en).
- [ICO: who UK GDPR applies to](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/who-does-the-uk-gdpr-apply-to/).
- [Thai government-hosted English PDPA translation, section 5](https://pdpa.dmh.go.th/news/files/pdpa.pdf).
- [OAIC: small businesses](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business) and [Australian link](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-b-key-concepts).
- [FTC: COPPA questions and answers](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions).
- [California Privacy Protection Agency: CCPA scope](https://cppa.ca.gov/pdf/business_comply.pdf). This is one state example, not a summary of all US privacy law.

## Current technical safeguards

The local changes prepared for review include:

- A central English privacy notice linked from all existing HTML pages, plus a subtle bottom privacy summary panel on the main pages (`index.html`, `computing.html`, `whatsnew.html`, and `pythonmobile.html`, plus the home screen of `pythoncopy.html`, hidden when the code editor is open) styled via `privacy-summary.css`.
- Complete removal of GoatCounter and any analytics/tracking scripts or opt-in banners from `privacy.js`, `privacy.html`, and all site pages.
- Click-to-load external embeds (`iframe[data-private-src]`) rendered as a centred placeholder card identifying the provider (`Google Slides`, `YouTube Video`, or `Spotify Audio`) with a direct link to the provider's privacy policy (Google Privacy Policy or Spotify Privacy Policy) before any external request is made, plus referrer suppression.
- Click-to-load external Code Lab previews (`previewWebLink` in `pythoncopy.js`), while same-site JSFun tutorial pages load directly without an external request.
- Removal of Google Fonts requests and reuse of an existing licensed local presentation library.
- Explanations of browser storage, shared devices, content-bearing links and activity-log downloads.
- Offline access to the notice through the updated Python Code Lab cache.

These controls reduce unnecessary disclosure. They do not establish that consent is valid for every child, verify provider contracts or resolve legal scope. Existing deployed pages are not changed until these local changes are published.

## Contact route

James supplied this [Google Forms contact form](https://docs.google.com/forms/d/e/1FAIpQLSerF3lnj9XmX_upnRCICPi1dcFNdH--okWj6UM2HpFo3W4f2Q/viewform) for privacy enquiries. It is linked in the public notice; no residential address has been added.

Confirm that the form is accessible to intended users, responses are private, access is restricted appropriately, and enquiries are monitored. James selected no fixed deletion schedule: responses remain in Google Forms until manually deleted, and visitors can request deletion. The form's contents and account settings were not verified during the review.

## Remaining decisions and checks

- Confirm territorial scope and any commercial connection before making categorical legal claims.
- GoatCounter has now been completely removed from the site (and no opt-in banner or analytics storage key is used). Previously recorded GoatCounter settings notes in `PRIVACY_AUDIT.md` remain as historical context only.
- Identify actual provider roles, relevant agreements, processing countries and any required transfer safeguards.
- Confirm the appropriate lawful bases and applicable children's consent requirements where a law applies (for example, when a visitor chooses to load an external Google Slides, YouTube, or Spotify embed or submit the Google Forms contact form).
- Contact-form retention is now documented as manual deletion with no fixed schedule, as selected by James. Review necessity periodically; retention of any records received separately still needs consideration.
- Review remaining remote libraries, images and proxy services; retain licences when hosting replacements locally.
- Keep the public notice accurate and understandable. Consider additional languages if a legal requirement or audience need is established.
- Reassess before introducing accounts, centrally stored student records, paid services, advertising, profiling or formal school integrations.

For detailed request-handling and incident procedures, see [PRIVACY_AUDIT.md](PRIVACY_AUDIT.md).

## Publication status

James reports pushing the privacy changes; the live notice and shared analytics script were subsequently fetched and checked. James also supplied evidence of saved GoatCounter settings. Later notice wording and developer-documentation edits are local until pushed. No deployment or provider-account changes were performed by the assistant. The technical review is not a certification of PDPA, GDPR, UK GDPR or worldwide compliance.

## Analytics status

GoatCounter and all first-party/third-party analytics scripts have been removed across all pages as of 18 November 2026. No analytics requests are sent and no analytics opt-in banner or `localStorage` analytics preference is used. Earlier GoatCounter configuration notes in [PRIVACY_AUDIT.md](PRIVACY_AUDIT.md) are retained for historical audit context only.

## public privacy statement

### Message on site

Privacy by design. No JSFun accounts. No analytics or tracking. No automatic central collection of student work.

This summary is displayed subtly at the bottom of the main pages above the footer (and on the home screen of `pythoncopy.html`, hidden while editing). There is no analytics opt-in banner.

### Detailed message

JSFun is built with privacy by design. Our free educational tools require no JSFun accounts, use no analytics or tracking, and prioritise processing in your browser without automatically uploading student work to a central JSFun database. External embeds (such as Google Slides, YouTube videos, and Spotify audio) are click-to-load and link to the provider's privacy policy before loading. Our Privacy Notice explains browser storage, external services and how to raise privacy enquiries.

These safeguards support the data-minimisation, transparency and privacy-by-design principles reflected in GDPR, UK GDPR and Malaysia’s PDPA.

------

This wording describes implemented safeguards, not certification or a finding of full GDPR, UK GDPR or PDPA compliance. It does not mean that hosting providers receive no technical data, that external services never process information, or that users cannot choose to share work. Contact-form submissions, content-bearing share links and exports remain covered by the fuller notice. Keep this statement accurate if accounts, central submissions or the analytics default ever change. These latest page edits require a push before they appear on the live site.
