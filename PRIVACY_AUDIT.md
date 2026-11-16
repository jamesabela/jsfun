# JSFun privacy review

Date: 16 November 2026. Repository review; James subsequently pushed the changes and the live notice/module were fetched successfully. Subsequent edits still require a new push.

## Scope and limitations

Recursively scanned all 473 tracked HTML, JavaScript, CSS, JSON, YAML, TOML, webmanifest and fragment files present before the change, including vendor code. `privacy-inventory.json` records 2,313 matching file/line locations, categories, referenced hosts and risk triage. This is a **pre-change inventory**: line numbers refer to the original files. References include inert links, examples and library internals, not only actual network transmissions. Untracked backups, ignored build artefacts, remote code, live provider accounts and dashboards were not audited. Manual review focused on first-party network calls, analytics, URL sharing, storage, embeds, forms and the Python Code Lab service worker. This is not exhaustive execution of every application or a legal certification.

No JSFun registration, central student-submission database or advertising SDK was identified in the reviewed first-party code. This is not proof that third-party resources never track users. The absolute suggested homepage claim about advertising trackers was therefore replaced with narrower verified wording.

## Processing and risk register

| Activity / evidence | Information and recipient | Purpose / basis to confirm | Retention / transfers | Risk and outcome |
|---|---|---|---|---|
| GitHub Pages delivery; repository hosting | IP, browser headers, requested path and query to GitHub/infrastructure | Deliver and secure requested pages; assess legitimate interests and provider roles | Hosting retention and locations not verified; provider policy applies, transfer review required | Medium: necessary network exposure; no-referrer reduces onward disclosure, not initial hosting logs |
| Original GoatCounter tags on 447 pages | Default tracker could read query, title, referrer and screen data | Usage statistics; now explicit opt-in, subject to valid consent requirements | Latest saved-settings screenshot shows 365-day retention; provider states Finland/Germany hosting; contracts unverified | High where URLs contain work: removed direct tags; fixed page identifier only, no remote script, no q/t/r/s fields; ns=true requests no sessions |
| localStorage/sessionStorage in Python/mobile, flowcharts and classroom tools | Drafts, settings, progress, names or other user content on device | Requested functionality; determine applicable necessity exception / legal basis | Local storage until deletion/eviction; session data normally until session ends | Low for preferences; medium/high for identifiable work on shared profiles. Notice explains scope and deletion; no bulk destructive delete added |
| pythoncopy-activity.js / Python Code Lab | Code edits, timings, optional feelings/frustration in memory and downloaded TSV | User-requested learning review; schools must establish their own basis for receiving records | Memory until page lifetime ends; downloads retained by user; subsequent sharing outside JSFun control | High if identifiable student records exported; disclose explicitly, no automatic upload identified |
| Python/mobile, flowchart, connections and other URL sharing | Content encoded in query/hash, copied links and history; recipients and any sharing platform | User-directed sharing; basis depends on content and school context | Copied links/history/recipient retention uncontrolled; query reaches host, fragment normally does not | High: analytics never reads live URL; notice explains links are not private. Per-tool point-of-use warnings still need wider coverage |
| jsDelivr, cdnjs/Cloudflare, unpkg, Tailwind CDN; Python/Blockly libraries | IP, browser headers; provider JS executes in page context | Runtime functionality; assess necessity, provider roles and lawful basis | Provider retention/transfers not verified | Medium supply-chain and network exposure; retained functionality-critical dependencies pending licensed vendoring/regression work |
| Google Fonts in HTML and two CSS files | Previously IP/headers to Google font infrastructure | Typography | Previously provider controlled | Medium: removed font stylesheet imports and preconnects; existing fallback fonts used |
| connections.html presentation export | Previously jsDelivr library request | Export slides | Local library now | Low residual: reused vendor/pptxgenjs with existing licence |
| GitHub/Gist/raw files, arbitrary user-supplied URLs, Pastebin via corsproxy.io (Python Code Lab and python2flow) | Requested URLs to source provider; proxy sees URL and returned content | Load selected educational examples | Provider controlled; unknown retention/locations | High if private tokens or student content occur in URLs. Existing loaders retained; notice and Code Lab warning added. Review proxy terms and replace/disable for sensitive use |
| Static YouTube, Google Slides and other external frames | IP/headers and provider-side cookies/state once loaded | User-requested media; provider terms and any consent requirements need review | Provider controlled; possible international processing | Medium: explicit load buttons, no-referrer; YouTube embeds changed to youtube-nocookie. This does not make playback tracking-free |
| Python Code Lab dynamic preview | External URL, IP/headers and embedded provider state | Preview linked learning content | Provider controlled | Medium/high depending on URL: new explicit load button and no-referrer; YouTube privacy-enhanced host |
| Certificate Google Drawings images and other remote images | IP/headers, selected image URL to provider | Display badges/resources | Provider controlled | Medium: remain live dependencies; no-referrer applied. Local copying/licensing review outstanding |
| pythonmanual.html search forms | Search terms to docs.python.org or Google | Explicit user search | Provider controlled | Medium: external destination retained; never enter student records. Other reviewed forms are local/dialog controls |
| AI, Classroom, Teams, Wise and other external links in resource JSON/HTML | IP/headers on navigation; anything the user subsequently submits; shared URLs to sharing services | User-selected separate services | Their policies, retention and transfer arrangements | Medium/high for user-submitted work. No first-party direct AI API upload found; links are not equivalent to automatic uploads |
| Python Code Lab service worker | Local application cache | Offline use | Until cache update/deletion/eviction | Low: v48 caches privacy assets; offline navigation returns cached notice; activation now deletes only this application's old cache versions |

No first-party cookie-setting or IndexedDB workflow was identified by manual review of the matching source; third-party runtime behaviour is outside that assurance. The inventory preserves candidates for further investigation.

Contact enquiries are an additional processing activity: Google Forms receives submitted request details and network information, and James uses responses to handle enquiries. Risk: medium, potentially high if sensitive records are submitted. The notice asks for minimal information. Basis, access controls and international safeguards require confirmation; James selected manual deletion with no fixed response-retention schedule; no submissions were made during testing.

## Implemented controls

- Responsive English-only `privacy.html` and self-hosted stylesheet. James requested removal of the Bahasa Malaysia translation; Malaysian PDPA applicability has not been established.
- Static Privacy Notice links on all 450 existing HTML pages, including nested courses, homepage, Python Code Lab and mobile version. Links do not require JavaScript.
- Shared `privacy.js` opts out by default and stores only `jsfun.analytics.v1` when a choice is made. Storage failure stays off on future loads. Opt-out persists across same-origin tools; storage events update other open tabs. No recurring tracking is installed.
- Analytics is blocked for frames, local preview hosts, Do Not Track and Global Privacy Control. Central kill switch: `ANALYTICS_ENABLED` in privacy.js. Only the production hostname is eligible.
- Uses GoatCounter's documented pixel endpoint with a fixed source HTML identifier and no-session request. No names, work, dynamic titles, URL parameters/fragments, referrers, screen sizes or event labels are read into the payload. The provider still receives IP/headers. Browser caching may undercount repeated requests; no unique visitor claim is made.
- No-referrer meta placed before subresource loads; pixels and preview frames also set explicit referrerPolicy. Initial navigation queries still reach hosting servers.
- Removed Google Fonts/preconnects; used the already licensed local PPTX library for Connections. Other libraries retained to preserve tools.
- Click-to-load static external frames and Code Lab previews. No external thumbnails added.
- Browser-data deletion instructions instead of an origin-wide delete button, which could erase unrelated GitHub Pages projects.
- Added AGENTS.md (none existed in this repository) with future privacy requirements.

## James's dashboard and administrative actions before publication

1. James supplied the [Google Forms contact route](https://docs.google.com/forms/d/e/1FAIpQLSerF3lnj9XmX_upnRCICPi1dcFNdH--okWj6UM2HpFo3W4f2Q/viewform); linked in the English notice. Confirm the controller details and that the form accepts privacy requests, is accessible to intended users, does not expose responses, and is monitored. The form contents/settings could not be inspected through the web tool. Record correspondence retention, access controls and Google provider/transfer arrangements. Verify whether separately applicable business or representative rules require additional contact information; no residential address was requested.
2. In GoatCounter, verify **individual pageviews are disabled** (provider default is off), disable session/unique-visitor features where offered, and confirm `ns=true` is honoured by the deployed account. Disable geographic information, screen sizes, language, browser and operating-system breakdowns where unnecessary. Disable campaign extraction and any referrer collection. The screenshot supplied on 16 November confirms the available controls and displayed values; see the evidence update below. No authenticated account access or settings changes were performed.
3. Completed by James, evidenced by the Saved screenshot: 365-day analytics retention and logged-in-only dashboard access. Still review old reports/exports for content-bearing URLs and delete sensitive historical records. Opt-out cannot retract existing aggregates or exports.
4. Verify provider roles, locations, subprocessors and applicable DPAs. Establish any necessary EU/UK/Malaysian transfer basis and safeguards; do not assume provider policy wording proves a particular agreement exists.
5. Confirm GDPR/UK GDPR territorial scope and Malaysian PDPA applicability, including its commercial-transaction scope. Review current Malaysian amendments, breach/DPO duties, any registration requirements and whether representation is needed. No DPO or representative requirement is asserted automatically.
6. Assess ePrivacy/PECR separately from GDPR. Current UK statistical-purpose exceptions have conditions; EU national implementation can differ. This implementation chooses opt-in and does not rely on an exemption. Confirm that consent is valid for the intended audience, particularly children; otherwise disable analytics centrally.
7. Review the English notice and replace outstanding draft wording with verified facts. Confirm the contact workflow is monitored before publication.
8. Review remaining remote scripts, image hosts, arbitrary URL loaders and proxy terms; vendor compatible libraries with licences and relevant regression testing. Add in-context share warnings to remaining tools. Existing cached pages/open tabs may retain the previous tracker until refreshed; deployment cannot instantly replace every historical copy.

## Analytics legitimate interests assessment — provisional, not adopted

Purpose: learn which educational resources warrant maintenance. Necessity: aggregate counts could help, but operating without analytics is feasible; detailed sessions, geography and individual pageviews are unnecessary. Balancing: children and classroom devices create an elevated expectation of privacy; URLs and learning records can be sensitive. Safeguards: opt-in, fixed page IDs, no sessions requested, no referrers/screens/content, privacy signals, restricted access and 365-day retention evidenced by the saved-settings screenshot. Outcome: do **not** use legitimate interests as the analytics basis without a completed owner/legal assessment and separate storage/access analysis. Current code requests permission; consent validity and child-specific requirements remain to be confirmed. If these cannot be established, use the central off switch.

## Requests and incidents

Requests: receive privately; record date, scope and applicable jurisdiction; verify identity proportionately without requesting unnecessary identity documents; distinguish local-only data, provider-held data and records received separately by schools; locate and respond within applicable legal deadlines, including any permitted extensions; document action and reasons, coordinate with providers, and explain complaint routes. Never ask users to post student records in public issues. Do not claim James can recover or erase browser-only data remotely.

Incidents: stop the relevant integration (analytics kill switch where appropriate), preserve minimal access-controlled evidence, assess affected data and people, revoke exposed credentials if relevant, contact providers, determine legally required regulator/individual notifications and deadlines, document decisions and remediation, and review how recurrence can be prevented. Confirm jurisdiction-specific duties with competent advice; do not invent a universal deadline.

## Validation

- `node tests/privacy.mjs`: checks all 450 original pages for working relative links/module paths, referrer metadata, absence of direct analytics and automatic external frames. Exercises default deny, consent withdrawal/persistence, privacy signals, central off switch, blocked storage and a hostile URL/title/referrer payload.
- `node tests/pythoncopy-activity.mjs`: existing activity logging/export tests pass.
- JavaScript syntax checks for shared module, Code Lab and service worker; `git diff --check`.
- Local Chrome at 390×844: notice has no horizontal overflow, choices persist after navigation, index/Code Lab links exist, representative embed stays unloaded, no Google Fonts or analytics request on local preview, offline cached notice loads with correct title.
- Local preview deliberately never sends live analytics. Payload verified in isolated tests; account acceptance/configuration not verified. All application workflows, third-party requests and every mobile page have not been exhaustively tested.

## Sources checked

- [GoatCounter privacy](https://www.goatcounter.com/help/privacy), [pixel fields](https://www.goatcounter.com/help/pixel), [JS API](https://www.goatcounter.com/help/js), [sessions](https://www.goatcounter.com/help/sessions). Inspected current count.js: it separately includes `q: location.search`, so removing query from path alone would be insufficient.
- [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
- [ICO consent guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/) and [DUAA schedules](https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-duaa-summary-of-the-changes/schedules/).
- [Malaysia PDPA FAQ](https://www.pdp.gov.my/en/faq/) and [privacy notice guidance](https://www.pdp.gov.my/en/akta/guidance-on-the-preparation-of-personal-data-protection-notices/).


## International audience review — 16 November 2026

James confirms the site makes no money and identifies its principal audiences as the US, Australia, Thailand, UK and EU. No income is not a universal privacy-law exemption. This is an initial scope assessment, not a determination that every listed law applies. Do not label the site compliant with all of these regimes.

- **Malaysia:** the PDPA commercial-transaction connection remains relevant. English-only is the owner's current choice, not a finding of exemption. Revisit the bilingual notice requirement if Malaysian PDPA applicability is established.
- **EU:** Article 3(2) can cover processing related to offering services to people in the EU, even free services, or monitoring their behaviour there. Mere accessibility or incidental visitors is insufficient to establish an offer directed at the EU. Assess actual intended audience, promotion, school relationships and tracking purpose. Minimal aggregate analytics should not automatically be described as behavioural monitoring. [EDPB territorial scope guidance](https://www.edpb.europa.eu/documents/guideline/guidelines-32018-on-the-territorial-scope-of-the-gdpr-article-3-version-adopted_en).
- **UK:** overseas services offered to UK individuals or monitoring within the UK can bring processing within UK GDPR. No revenue does not establish exemption. Children's privacy and storage/access rules require separate consideration where applicable. [ICO scope guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/who-does-the-uk-gdpr-apply-to/).
- **Thailand:** section 5 extends to overseas collection/use/disclosure connected to offering goods or services to people in Thailand, regardless of payment, or monitoring behaviour there. Assess the connection and data processing; do not import Malaysia's commercial-transaction test. [Government-hosted English Act translation, section 5](https://pdpa.dmh.go.th/news/files/pdpa.pdf).
- **Australia:** most small businesses with annual turnover of AUD 3 million or less are exempt from the federal Privacy Act, subject to exceptions such as health services and trading in personal information. An overseas operator's Australian link also needs consideration. A small free site is not automatically subject merely because Australians visit, nor is this an exhaustive assessment of other Australian laws. [OAIC small-business guidance](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business), [Australian link guidance](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-b-key-concepts).
- **US:** COPPA is particularly relevant to covered commercial services directed at under-13s, or with actual knowledge of collecting their personal information; third-party collection can matter. No income alone does not prove an operator is an exempt nonprofit entity. California CCPA generally concerns qualifying for-profit businesses and thresholds; other state privacy and student-data rules differ. No comprehensive 50-state review performed. [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions), [California scope guidance](https://cppa.ca.gov/pdf/business_comply.pdf).

Practical approach: one accurate English notice for the current English-language service, local processing, no student accounts/submissions database, optional analytics off by default, explicit external-content loading, and a minimal contact route. These controls reduce exposure but do not establish valid children's consent, satisfy every provider obligation or resolve territorial scope. Translation needs depend on applicable law and audience comprehension; no automatic requirement to translate into every visitor's language is asserted. Reassess before targeted regional expansion, school contracts, collecting centrally stored student records, advertising or profiling.


## GoatCounter evidence update — 16 November 2026

Evidence: James supplied a screenshot of the account settings and the account help URL. The account help URL could not be fetched, so the corresponding public [GoatCounter GDPR guidance](https://www.goatcounter.com/help/gdpr) was read alongside its [privacy policy](https://www.goatcounter.com/help/privacy) and [session documentation](https://www.goatcounter.com/help/sessions). The table below reflects the later screenshot showing a Saved confirmation: retention changed from 0 to 365 days and Region was disabled. Evidence is the user-supplied screenshot, not independent authenticated backend access.

| Setting | Displayed value |
| --- | --- |
| Dashboard access | Only logged-in users |
| Retention | 365 days |
| Individual pageviews | Off |
| Sessions | On |
| Referrer / campaign parameters | On |
| User-Agent-derived browser/system | On |
| Screen size | On |
| Country | On |
| Region | Off (the retained US, RU, CN field is inactive while Region is off) |
| Language | Off |

The provider describes separate aggregate statistics rather than linked visitor profiles, with optional individual pageviews. Session deduplication uses IP and User-Agent information in memory for up to eight hours. It states that hosted data is stored in Finland/Germany. These provider statements do not verify JSFun's historical payload contents or contractual arrangements.

The provider's GDPR guidance argues that consent is probably unnecessary, citing anonymous aggregates and legitimate interests. This is the provider's qualified interpretation, not a regulator's approval. Anonymous final statistics and any personal-data processing before aggregation should be distinguished. Storage/access rules and children-specific considerations still need separate assessment where applicable. The earlier proposal to disable all analytics was a conservative simplification, not a determination that GoatCounter requires consent or is unlawful.

James has now saved 365-day retention and disabled Region. Individual pageviews remain off and dashboard access remains private. Sessions, referrers, browser/system, screen size and country remain enabled; Language remains off. These retained settings are not automatically unlawful. The 365-day period is an operational choice, not a statutory limit. The screenshot confirms the configuration, not execution of deletion jobs or removal of historical regional data or exports. The account may cover other pages on jamesabela.github.io, so account-wide changes can affect more than JSFun. Further collection reductions are optional recommendations, not changes made by this review.

The prepared JSFun integration still uses opt-in and omits queries/titles/referrers/screens, while requesting no sessions. This is independent of the broader dashboard capabilities and has not been deployed by this work. No consent setting, provider account or historical data was changed by the assistant; James made the account changes recorded above. Actual acceptance of the no-session parameter and the contents of historical page paths remain unverified.


## Notice wording and new-page integration update

James requested removal of unfinished editorial language from the public notice. Its purposes section now describes actual uses without inventing an approved lawful basis. Provider retention/transfer details refer to the linked policies. This copy edit does not resolve the outstanding lawful-basis, children's-consent or contractual assessment; those remain internal actions above. The notice should not be treated as a completed Article 13 assessment solely because draft wording has been removed.

James explicitly chose no fixed deletion schedule for contact-form responses: they remain in Google Forms until manually deleted. The notice explains this and how to request deletion. This records current practice, not a finding that indefinite retention of every message is necessary or justified; periodically review whether messages are still needed.

The analytics interface now distinguishes default-off from a saved choice and explains that local previews send no counts and have a separate browser preference from the live origin. README.md documents the three per-page elements and a nested-folder example. Tests include untracked non-ignored HTML pages, validate fixed page identifiers, and cover preview and preference status messages. Existing analytics policy is unchanged.
