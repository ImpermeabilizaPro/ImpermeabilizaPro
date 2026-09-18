# Website decisions

## User decision — 17 September 2026

No Tally forms or external form integrations. Questions stay on the website. Answers build a WhatsApp message to +351 930 446 198. The visitor reviews and sends it in WhatsApp. Opening WhatsApp must never be represented as a submitted form or a confirmed lead.

Keep this decision when making future edits. It supersedes the older master briefing's recommendation for a Tally or independent lead form.

## Conversion work — 17 September 2026

- Home, roof and terrace pages use specific service headings, real existing photography, visible geographical coverage and direct phone contact.
- Sequence: service promise, trust signals, work photography, request, situations/services, technical explanation, process, named contact, FAQ, final action.
- Request requires only surface and locality; situation defaults to unknown, area and details are optional. Roof/terrace pages preselect the corresponding surface.
- WhatsApp is explicitly named in the principal hero action and final submit button. Keep a visible retry link after preparing a message in case a new tab is blocked. Never display “request received”.
- No new ratings, guarantees, years of experience, completed-job quantities or case histories were invented. Existing photography is only 640×360: do not upscale it into a claimed high-resolution portfolio.
- Analytics emits one canonical phone or WhatsApp click event per action. Request preparation is diagnostic; no form-submitted or lead-success event is emitted. User-written details and locality never enter the dataLayer.
- Tag Manager loads after analytics/advertising consent. Denied visitors can still use every contact function. Storage failures must not break contacts.

## Competitors consulted

- https://www.monocapa.pt/ — service-specific navigation, portfolio, company identity and direct contacts. Applied: explicit service headings and clear identity/contact details. Did not copy their credentials or history.
- https://pom-lda.pt/ — prominent request, staged explanation of the work and services. Applied: understandable next steps and mobile navigation. Did not adopt their guarantee or numerical claims.
- https://impermeabilizar.pt/ — service, geography, quote CTA and FAQ coverage. Applied: visible scope, cost factors and contact choice; avoid excessive claims and repeated pressure.

These are qualitative design comparisons, not measured conversion-rate rankings. The new website cannot honestly be labelled “100% converting” or proven superior without traffic and lead-quality evidence.

## Operational follow-up

- Check which GTM/Ads triggers currently use ip_whatsapp_click and ip_phone_click; the website update does not alter an Ads account or validate that account's conversion settings.
- Assess real sent messages, qualified requests and accepted quotes. A WhatsApp click alone is not a lead.
- Add higher-resolution original photographs and verified reviews when available. Do not fabricate missing evidence.
- No live test message was sent to the business during the code tests.

## Verification and recovered issue

Automated DOM tests passed on all three landing pages: required fields, preselected service, optional/decimal/invalid area, WhatsApp URL encoding, blocked-popup fallback, consent gating, storage failures, no personal answers in analytics and no false lead events. Structural checks passed for anchors, labels and referenced assets. GitHub Pages deployed successfully; desktop hero, live validation, roof and terrace pages were inspected. No message was sent. Full mobile-device and Safari verification remains outstanding because the available browser did not support the attempted mobile viewport preview.

The inherited assets/vinicius-nascimento.webp is invalid (both browser display and image decoder verification failed; historical versions were also invalid). The visible broken portrait was replaced by a named contact panel with initials and telephone/WhatsApp. Restore photography only from a valid original. The old binary is retained for possible recovery and is not referenced by the pages.

## User corrections — 18 September 2026

- Portfolio now uses compact four-column desktop cards, two-column tablet cards and bounded mobile cards. Card text contrast fixed. Full-size originals can be opened in an accessible native dialog. Existing 1200px images preserved without artificial upscaling.
- Valid 720×900 Vinícius portrait is now larger, centered and shown as a 4:5 portrait. The older invalid-image note above is superseded by the valid assets in the current repository.
- Roof gallery now uses obra-real-cobertura-02.webp; hero retains hero-telhados-real.webp. The old gallery file was another encoding/crop of the hero photograph.
- Home remains focused on household needs, with distinct Particular and Business/Condominium sections leading into the same short WhatsApp builder. Client type is optional.
- Footer has legible privacy, cookies, preference management, legal/contact and official complaints-portal links. Logo's exterior white square is visually clipped; original artwork is preserved.
- Privacy expanded with purposes, rights/CNPD, storage, third-party services and withdrawal. No NIF published. Legal completeness is NOT certified: legal operator identity/address, applicable arbitration entity and specific electronic complaints registration still need business confirmation. The portal link is general, not proof of registration.
- Consent expires after 183 days. Withdrawal clears first-party Google cookie names and reloads to unload already-loaded tags. No third-party tags before consent. Removed pre-consent Google preconnect.
- Canonical URLs and existing GTM ID preserved. Intrinsic image dimensions corrected. Service/breadcrumb JSON-LD and legal-page metadata added. No fabricated reviews or guarantees.
- Validation: local assets/links/anchors, unique IDs, one H1 per page, JSON-LD parsing and JavaScript syntax pass. VM checks pass for no-consent blocking, consent expiry/withdrawal, storage failure, WhatsApp client type, exclusion of personal form answers from analytics and absence of false form-submission events. No business message sent.
- Live GA4/Ads conversion configuration and Search Console coverage are not verified by these code tests. Real-device/mobile rendering remains a separate verification item.


## Corporate presentation — 18 September 2026

- Published a consistent navy hero, quieter borders, clearer typography, compact real-work cards and simpler navigation across home, roofs and terraces. Preserved the four original project photographs and service-specific images.
- Increased the valid portrait to 224×280 desktop / 200×250 mobile, centered without artificial image enhancement.
- Improved text contrast and secondary text sizes, responsive spacing, cookie-panel overflow, active service navigation and outside-click menu closure. Native photo dialogs now lock background scrolling.
- Preserved contact numbers, WhatsApp preparation, the existing GA4/GTM configuration, consent behavior, canonical .pt URLs and all legal-page content. No Google Ads campaigns changed.
- Validation: structural checks for all three landing pages (assets, anchors, IDs, one H1 and JSON-LD), JavaScript syntax, successful GitHub Pages deployment, live desktop visual review, gallery open/close, required-field validation and service preselection. No business messages sent.
- Cloud browser cannot access the local preview and does not expose viewport resizing. Responsive CSS was updated, but a real mobile-device visual check is still outstanding.
- The prior legal/operator-data and live Ads/analytics configuration follow-ups remain outstanding; this design revision does not certify those.

## Tracking audit and access-transfer attempt — 18 September 2026

- Confirmed repository CNAME, canonical URLs, sitemap and active ad destinations use impermeabilizapro.pt. Do not revert to the older .blog domain.
- Connected reporting sources: Ads 396-652-0841, GA4 property 554830576, Search Console https://impermeabilizapro.pt/. Reporting connectivity does not establish administrator access or corporate ownership.
- Corporate account requested: proimpermeabiliza@gmail.com. No access transfer was completed: Google Tag Manager and Google Ads administration returned 502 Connection refused in this session. Preserve existing personal access until corporate administrator/publish access is verified.
- Ads campaign 24188606637 uses manual CPC, location PRESENCE, no Display and no Search partners. Existing negatives already exclude many material/product/tutorial searches. No budgets, bids, campaigns or exclusions were changed during this audit.
- Reporting for 2026-09-11 through 2026-09-18: 150 impressions, 24 clicks, 27.45 account-currency spend, 1 conversion under the historical “Pedido de Avaliação Enviado” label. The conversion settings response marks that action secondary; historical conversions may predate that change. Do not treat this metric as a confirmed received quote request.
- GA4 reporting returns page views, form_start, ip_whatsapp_click, scroll and section events. End-to-end GTM Preview, Ads conversion firing and duplicate-GA4-tag checks remain unverified.
- Fixed script.js: direct gtag custom events explicitly target G-BBSN5Z50XK; GTM dataLayer events remain available. Form start, section and scroll milestones are marked counted only after consent permits tracking. A later eligible interaction can therefore be recorded. Email and WhatsApp retry actions now participate in the existing one-per-session contact-intent counter.
- Syntax/diff checks and Node VM behavior tests passed: consent gating, late consent, form/scroll/section counts, cross-channel contact-intent deduplication, blocked storage, explicit GA4 destination, WhatsApp URL construction and exclusion of personal form answers from analytics. No message was sent. These code tests do not prove live tag delivery.
- Remaining administration work: verify company administrators on GTM, Ads, GA4 and Search Console; inspect live GTM triggers and rename obsolete submitted-request conversion terminology; verify primary/secondary conversion goals and duplicate imports; validate in Preview before publishing GTM changes. Domain/DNS ownership was not inspected.
