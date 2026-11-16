# JSFun: PDPA and international privacy considerations

Last updated: 16 November 2026

This is an internal working document for James Abela. It records the project's circumstances, technical safeguards and questions about applicable privacy law. It is not legal advice or a declaration of compliance.

The public explanation is in [privacy.html](privacy.html). Technical findings, provider details and outstanding actions are in [PRIVACY_AUDIT.md](PRIVACY_AUDIT.md).

## Project circumstances

James describes JSFun as a free educational project that makes no money. Its main audiences are in the US, Australia, Thailand, UK and EU. James is based in Malaysia.

The reviewed first-party code provides no JSFun accounts or central database of student submissions. Student work is generally processed in the browser, with some tools saving drafts locally or allowing downloads and sharing links.

This does not mean that no information is processed anywhere:

- GitHub Pages receives network requests to deliver the site.
- External libraries, images, remote files and loaded embeds contact their providers.
- Optional GoatCounter analytics receives a limited page-count request when enabled by the visitor.
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

- A central English privacy notice linked from all 450 existing HTML pages.
- Analytics off by default, with a persistent choice across same-origin JSFun tools.
- Fixed analytics page identifiers, excluding student work, live URL queries/fragments, dynamic titles, referrers and screen sizes; no session tracking requested.
- Respect for Do Not Track and Global Privacy Control signals, plus a central analytics disable switch.
- Click-to-load external embeds and Code Lab previews, with referrer suppression.
- Removal of Google Fonts requests and reuse of an existing licensed local presentation library.
- Explanations of browser storage, shared devices, content-bearing links and activity-log downloads.
- Offline access to the notice through the updated Python Code Lab cache.

These controls reduce unnecessary disclosure. They do not establish that consent is valid for every child, verify provider contracts or resolve legal scope. Existing deployed pages are not changed until these local changes are published.

## Contact route

James supplied this [Google Forms contact form](https://docs.google.com/forms/d/e/1FAIpQLSerF3lnj9XmX_upnRCICPi1dcFNdH--okWj6UM2HpFo3W4f2Q/viewform) for privacy enquiries. It is linked in the public notice; no residential address has been added.

Confirm that the form is accessible to intended users, responses are private, access is restricted appropriately, and enquiries are monitored. Define how long correspondence is retained. The form's contents and account settings were not verified during the review.

## Remaining decisions and checks

- Confirm territorial scope and any commercial connection before making categorical legal claims.
- GoatCounter settings have now been reviewed from James’s screenshot: individual pageviews and region collection off, private dashboard, 365-day retention; sessions, referrers, browser/system, screen size and country collection remain on. Inspect historical data and verify the no-session behaviour. See the evidence update in PRIVACY_AUDIT.md.
- Identify actual provider roles, relevant agreements, processing countries and any required transfer safeguards.
- Confirm the appropriate lawful bases and applicable children's consent requirements where a law applies. A visitor clicking an analytics button is not automatically sufficient parental consent.
- Set a practical retention policy for contact responses and any records James receives separately.
- Review remaining remote libraries, images and proxy services; retain licences when hosting replacements locally.
- Keep the public notice accurate and understandable. Consider additional languages if a legal requirement or audience need is established.
- Reassess before introducing accounts, centrally stored student records, paid services, advertising, profiling or formal school integrations.

For detailed request-handling and incident procedures, see [PRIVACY_AUDIT.md](PRIVACY_AUDIT.md).

## Publication status

Changes are local and awaiting review. No site deployment or provider-account changes were made as part of this work. The technical review is not a certification of PDPA, GDPR, UK GDPR or worldwide compliance.


## GoatCounter clarification

James supplied the current settings screenshot on 16 November 2026. A subsequent screenshot shows the Saved confirmation with retention changed to 365 days and Region disabled. The public notice now records the 365-day setting. GoatCounter argues that its aggregate analytics probably does not require GDPR consent; this is relevant provider guidance, not a blanket compliance guarantee. Disabling analytics remains a conservative option rather than an established legal requirement. The prepared code's opt-in policy is unchanged. See [the technical audit](PRIVACY_AUDIT.md) for the settings table, sources and proposed minimisation options.
