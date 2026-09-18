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
