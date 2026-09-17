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
