"use strict";
const PHONE = "351930446198";
const GA4_ID = "G-BBSN5Z50XK";
window.dataLayer = window.dataLayer || [];
window.gtag =
  window.gtag ||
  function () {
    window.dataLayer.push(arguments);
  };
window.gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  wait_for_update: 500,
});
const params = new URLSearchParams(location.search);
if (
  location.pathname === "/" &&
  ["telhados", "terracos"].includes(params.get("servico"))
) {
  const legacy = params.get("servico");
  params.delete("servico");
  location.replace(
    `/${legacy}/${params.size ? "?" + params.toString() : ""}${location.hash}`,
  );
}
const service = document.body.dataset.service || "geral";
const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
};
const CONSENT_LIFETIME = 183 * 24 * 60 * 60 * 1000;
const consentTime = Number(storage.get("ip_consent_at"));
let consent = consentTime && Date.now() - consentTime < CONSENT_LIFETIME ? storage.get("ip_consent") : null;
let attribution = {};
const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
];
function readAttribution() {
  try {
    attribution = JSON.parse(sessionStorage.getItem("ip_attribution") || "{}");
  } catch {
    attribution = {};
  }
  if (
    !attribution ||
    typeof attribution !== "object" ||
    Array.isArray(attribution)
  )
    attribution = {};
  for (const key of attributionKeys) {
    if (params.has(key)) attribution[key] = params.get(key).slice(0, 250);
  }
  try {
    sessionStorage.setItem("ip_attribution", JSON.stringify(attribution));
  } catch {}
}
function track(event, extra = {}) {
  if (consent !== "accepted") return;
  const payload = {
    landing_page: location.pathname,
    servico: service,
    ...attribution,
    ...extra,
  };
  window.dataLayer.push({ event, ...payload });
  window.gtag("event", event, payload);
}
function loadGa4() {
  if (window.__ga4Loaded) return;
  window.__ga4Loaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(GA4_ID);
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    send_page_view: true,
    page_path: location.pathname + location.search,
  });
}
function applyConsent(value) {
  consent = value;
  const granted = value === "accepted" ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: granted,
    analytics_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
  });
  if (value === "accepted") {
    readAttribution();
    loadGa4();
    if (!window.__gtmLoaded) {
      window.__gtmLoaded = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-KTCT795B";
      document.head.appendChild(script);
    }
  } else {
    attribution = {};
    try {
      sessionStorage.removeItem("ip_attribution");
    } catch {}
  }
}
const cookie = document.getElementById("cookie");
if (consent === "accepted" || consent === "rejected") applyConsent(consent);
else cookie?.classList.add("show");
function setConsent(value) {
  const revokeLoadedTags = value === "rejected" && window.__gtmLoaded;
  storage.set("ip_consent", value);
  storage.set("ip_consent_at", String(Date.now()));
  applyConsent(value);
  cookie?.classList.remove("show");
  window.dispatchEvent(new Event("ip:consent-panel"));
  if (revokeLoadedTags) {
    // Unload previously consented third-party tags; the next page load keeps GTM blocked.
    document.cookie.split(";").forEach((item) => {
      const name = item.split("=")[0].trim();
      if (!/^(_ga|_gid|_gat|_gcl_)/.test(name)) return;
      const domains = ["", location.hostname, "." + location.hostname];
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? " domain=" + domain + ";" : ""} SameSite=Lax; Secure`;
    });
    location.reload();
  }
}
document
  .getElementById("accept")
  ?.addEventListener("click", () => setConsent("accepted"));
document
  .getElementById("essential")
  ?.addEventListener("click", () => setConsent("rejected"));
document.getElementById("manageCookies")?.addEventListener("click", () => {
  cookie?.classList.add("show");
  document.getElementById("essential")?.focus();
  window.dispatchEvent(new Event("ip:consent-panel"));
});
const messages = {
  geral: "Olá! Gostaria de pedir um orçamento de impermeabilização.",
  telhados:
    "Olá! Gostaria de pedir um orçamento para impermeabilizar um telhado ou cobertura.",
  terracos:
    "Olá! Gostaria de pedir um orçamento para impermeabilizar um terraço ou varanda.",
};
function whatsappUrl(message) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll(".wa-direct").forEach((link) => {
  link.href = whatsappUrl(messages[service] || messages.geral);
  link.addEventListener("click", () =>
    track("ip_whatsapp_click", {
      placement: link.dataset.placement || "direct",
      contact_action: "whatsapp",
    }),
  );
});
document.querySelectorAll('a[href^="tel:"]').forEach((link) =>
  link.addEventListener("click", () =>
    track("ip_phone_click", {
      placement: link.dataset.track || "footer",
      contact_action: "phone",
    }),
  ),
);
document
  .querySelectorAll('a[href^="mailto:"]')
  .forEach((link) =>
    link.addEventListener("click", () =>
      track("ip_email_click", { contact_action: "email" }),
    ),
  );
document.querySelectorAll(".mobile-menu a").forEach((link) =>
  link.addEventListener("click", () => {
    link.closest("details").open = false;
  }),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape")
    document.querySelectorAll(".mobile-menu[open]").forEach((menu) => {
      menu.open = false;
      menu.querySelector("summary").focus();
    });
});
const form = document.getElementById("quickForm");
if (form) {
  let started = false;
  const markStart = () => {
    if (!started) {
      track("form_start", { form_type: "whatsapp_request_builder" });
      started = true;
    }
  };
  form.addEventListener("input", markStart);
  form.addEventListener("change", markStart);
  const error = document.getElementById("formError");
  const status = document.getElementById("requestStatus");
  const requestLink = document.getElementById("requestLink");
  form.addEventListener("input", () => {
    status.hidden = true;
  });
  form.addEventListener("change", () => {
    status.hidden = true;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    markStart();
    const type = form.elements.tipo;
    const locality = form.elements.localidade;
    const area = form.elements.areaM2;
    [type, locality, area].forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-errormessage");
    });
    let invalid = null;
    let message = "";
    if (!type.value) {
      invalid = type;
      message =
        "Selecione a superfície. Se não souber, escolha “Não sei, preciso de avaliação”.";
    } else if (!locality.value.trim()) {
      invalid = locality;
      message = "Indique a localidade ou o código postal da obra.";
    } else if (!area.validity.valid) {
      invalid = area;
      message = "Indique uma área superior a zero ou deixe o campo em branco.";
    }
    if (invalid) {
      error.textContent = message;
      error.hidden = false;
      invalid.setAttribute("aria-invalid", "true");
      invalid.setAttribute("aria-errormessage", "formError");
      invalid.focus();
      return;
    }
    error.hidden = true;
    const lines = [
      messages[service] || messages.geral,
      `Superfície: ${type.value}`,
      `Localidade: ${locality.value.trim()}`,
      `Situação: ${form.elements.situacao.value}`,
      `Área aproximada: ${area.value ? area.value + " m²" : "Ainda não sei"}`,
    ];
    if (form.elements.cliente?.value) lines.push(`Tipo de cliente: ${form.elements.cliente.value}`);
    const description = form.elements.descricao.value.trim();
    if (description) lines.push(`Detalhes: ${description}`);
    const paidOrigin =
      attribution.gclid || attribution.gbraid || attribution.wbraid
        ? "Google Ads"
        : attribution.utm_source
          ? attribution.utm_source.slice(0, 80)
          : "";
    if (paidOrigin) lines.push(`Origem do pedido: ${paidOrigin}`);
    lines.push("Podem ajudar-me a perceber a solução e preparar um orçamento?");
    const url = whatsappUrl(lines.join("\n"));
    requestLink.href = url;
    status.hidden = false;
    // The click is a microconversion, never proof of a sent message or a received lead.
    track("ip_whatsapp_request_prepared", {
      form_type: "whatsapp_request_builder",
    });
    track("ip_whatsapp_click", {
      placement: "request_builder",
      contact_action: "whatsapp",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  });
  requestLink.addEventListener("click", () =>
    track("ip_whatsapp_click", {
      placement: "request_fallback",
      contact_action: "whatsapp",
    }),
  );
}

document.querySelectorAll(".faq-section details").forEach((item, index) => {
  item.addEventListener("toggle", () => {
    if (item.open) track("ip_faq_open", { faq_index: index + 1 });
  });
});

if ("IntersectionObserver" in window) {
  const seenSections = new Set();
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seenSections.has(entry.target.id)) return;
        seenSections.add(entry.target.id);
        track("ip_section_view", { section_id: entry.target.id });
      });
    },
    { threshold: 0.35 },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => sectionObserver.observe(section));
}

const reachedDepths = new Set();
let depthScheduled = false;
function measureScrollDepth() {
  depthScheduled = false;
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  if (scrollable <= 0) return;
  const depth = Math.round((scrollY / scrollable) * 100);
  [25, 50, 75, 90].forEach((mark) => {
    if (depth >= mark && !reachedDepths.has(mark)) {
      reachedDepths.add(mark);
      track("ip_scroll_depth", { percent_scrolled: mark });
    }
  });
}
addEventListener(
  "scroll",
  () => {
    if (depthScheduled) return;
    depthScheduled = true;
    requestAnimationFrame(measureScrollDepth);
  },
  { passive: true },
);

const mobileContact = document.getElementById("mobileContact");
const hero = document.querySelector(".hero");
if (mobileContact && hero && "IntersectionObserver" in window) {
  let heroPassed = false;
  const blockers = new Set();
  function render() {
    mobileContact.classList.toggle(
      "is-hidden",
      !heroPassed ||
        blockers.size > 0 ||
        cookie?.classList.contains("show") ||
        !!document.querySelector(".mobile-menu[open]"),
    );
  }
  new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      heroPassed =
        !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      render();
    },
    { threshold: 0 },
  ).observe(hero);
  for (const id of ["pedido", "cta-final"]) {
    const el = document.getElementById(id);
    if (!el) continue;
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) blockers.add(id);
        else blockers.delete(id);
        render();
      },
      { threshold: 0 },
    ).observe(el);
  }
  document.querySelector(".mobile-menu")?.addEventListener("toggle", render);
  window.addEventListener("ip:consent-panel", render);
  render();
}

// Client paths keep the same short request and preselect only a non-required field.
document.querySelectorAll("[data-client]").forEach(link => {
  link.addEventListener("click", () => {
    if (form?.elements.cliente) {
      form.elements.cliente.value = link.dataset.client;
      form.dispatchEvent(new Event("change"));
    }
  });
});

// Full-size real photographs, opened on demand without duplicating visible gallery images.
const photos = document.querySelectorAll(".project-card > img, .work-photo > img");
if (photos.length && typeof HTMLDialogElement !== "undefined") {
  const dialog = document.createElement("dialog");
  dialog.className = "photo-dialog";
  dialog.setAttribute("aria-label", "Fotografia da obra");
  const close = document.createElement("button");
  close.type = "button"; close.textContent = "Fechar fotografia";
  const photo = document.createElement("img");
  const caption = document.createElement("p");
  dialog.append(close, photo, caption); document.body.append(dialog);
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  photos.forEach(img => {
    const button = document.createElement("button");
    button.type = "button"; button.className = "photo-open";
    button.setAttribute("aria-label", "Ampliar: " + img.alt);
    img.before(button); button.append(img);
    button.addEventListener("click", () => {
      photo.src = img.src; photo.alt = img.alt; caption.textContent = img.alt;
      dialog.showModal();
      track("ip_work_photo_open", { photo_id: img.src.split("/").pop() });
    });
  });
}

// Close the compact navigation when the visitor returns to the page.
document.addEventListener("click", (event) => {
  const menu = document.querySelector(".mobile-menu[open]");
  if (menu && !menu.contains(event.target)) menu.open = false;
});
