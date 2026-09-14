import { IS_TAGFLOW_CONFIGURED, TAGFLOW_CONFIG } from "@/config/tagflow";

export const TAGFLOW_EVENTS = [
  "page_view",
  "view_form",
  "form_start",
  "form_submit",
  "request_quote",
  "click_whatsapp",
  "whatsapp_redirect",
  "click_phone",
  "click_email",
  "click_facebook",
  "cookie_consent_update",
  "lead",
] as const;

export type TagflowEventName = (typeof TAGFLOW_EVENTS)[number];
export type TagflowValue = string | number | boolean | undefined | null;
export type TagflowPayload = Record<string, TagflowValue>;

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
}

export type ConsentStatus = ConsentPreferences;
export const CONSENT_CHANGE_EVENT = "cifra:consent-change";

interface TrackOptions {
  eventId?: string;
  reliable?: boolean;
}

const CONSENT_STORAGE_KEY = "cifra-cookie-consent-v2";
const CAMPAIGN_STORAGE_KEY = "cifra-campaign";
const SESSION_ID_KEY = "cifra-session-id";
const ANONYMOUS_ID_KEY = "cifra-anonymous-id";
const FORBIDDEN_KEYS = new Set([
  "name",
  "nome",
  "phone",
  "telefone",
  "email",
  "e-mail",
  "city",
  "cidade",
  "observations",
  "observacoes",
  "notes",
  "value",
  "valor",
  "valorinss",
]);

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreateStorageId(key: string, storage: Storage) {
  const current = storage.getItem(key);
  if (current) return current;
  const value = createId();
  storage.setItem(key, value);
  return value;
}

function readConsent(): ConsentPreferences {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return { analytics: false, marketing: false };
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    return { analytics: false, marketing: false };
  }
}

export function getStoredConsent(): ConsentStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentStatus>;
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    return null;
  }
}

function captureCampaign() {
  const params = new URLSearchParams(window.location.search);
  const campaign = {
    source: params.get("utm_source") ?? "",
    medium: params.get("utm_medium") ?? "",
    campaign: params.get("utm_campaign") ?? "",
    content: params.get("utm_content") ?? "",
    term: params.get("utm_term") ?? "",
    fbclid: params.get("fbclid") ?? "",
    gclid: params.get("gclid") ?? "",
  };

  if (Object.values(campaign).some(Boolean)) {
    sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaign));
    return campaign;
  }

  try {
    return JSON.parse(
      sessionStorage.getItem(CAMPAIGN_STORAGE_KEY) ?? "{}",
    ) as typeof campaign;
  } catch {
    return campaign;
  }
}

function deviceType() {
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1023px)").matches) return "tablet";
  return "desktop";
}

function sanitize(payload: TagflowPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => {
      const normalized = key.toLowerCase().replace(/[_-]/g, "");
      return !FORBIDDEN_KEYS.has(normalized) && value !== "" && value != null;
    }),
  );
}

/**
 * Quais eventos daqui são a conversão do site, do ponto de vista do GA4.
 *
 * O site não fecha negócio na própria página: a solicitação termina no
 * WhatsApp. Estes quatro são os últimos sinais observáveis antes de a pessoa
 * sair, e viram um único `generate_lead` no GA4.
 *
 * `whatsapp_redirect` e `form_submit` ficam de fora de propósito: eles
 * acontecem no mesmo gesto que `click_whatsapp` e `lead`, e mapear os dois
 * contaria cada lead duas vezes no relatório.
 */
const GA4_LEAD_SOURCE: Partial<Record<TagflowEventName, string>> = {
  click_whatsapp: "whatsapp",
  click_phone: "telefone",
  click_email: "email",
  lead: "formulario",
};

/**
 * Espelha a conversão no dataLayer, para a tag do container GTM-56HK6D2Q
 * traduzir em GA4 e em conversão de Ads.
 *
 * Vai só `lead_source` e `lead_subject`: o payload interno carrega tipo de
 * cliente e situação da obra, que servem ao CRM e não têm por que atravessar
 * para o Google.
 */
function pushGa4Lead(event: TagflowEventName, payload: TagflowPayload) {
  const leadSource = GA4_LEAD_SOURCE[event];
  if (!leadSource) return;

  const subject = payload.placement ?? payload.source ?? payload.formId;

  const target = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push({
    event: "generate_lead",
    lead_source: leadSource,
    ...(subject ? { lead_subject: String(subject) } : {}),
    page_path: window.location.pathname,
  });
}

export function trackTagflowEvent(
  event: TagflowEventName,
  payload: TagflowPayload = {},
  options: TrackOptions = {},
) {
  if (typeof window === "undefined") return null;
  if (!TAGFLOW_EVENTS.includes(event)) return null;

  const consent = readConsent();
  if (!consent.analytics && !consent.marketing) return null;

  // Antes do early-return abaixo: o GTM é independente do endpoint interno, e
  // com o Tagflow próprio desligado o GA4 continuaria tendo que medir o lead.
  pushGa4Lead(event, payload);

  if (!IS_TAGFLOW_CONFIGURED) return null;

  try {
    const campaign = captureCampaign();
    const eventId = options.eventId ?? createId();
    const body = {
      event,
      eventId,
      siteId: TAGFLOW_CONFIG.siteId,
      siteDomain: TAGFLOW_CONFIG.siteDomain,
      brand: TAGFLOW_CONFIG.brand,
      businessType: TAGFLOW_CONFIG.businessType,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      referrer: document.referrer,
      source: campaign.source || "direct",
      medium: campaign.medium || undefined,
      campaign: campaign.campaign || undefined,
      content: campaign.content || undefined,
      term: campaign.term || undefined,
      fbclid: campaign.fbclid || undefined,
      gclid: campaign.gclid || undefined,
      deviceType: deviceType(),
      sessionId: getOrCreateStorageId(SESSION_ID_KEY, sessionStorage),
      anonymousId: getOrCreateStorageId(ANONYMOUS_ID_KEY, localStorage),
      consent,
      ...sanitize(payload),
    };
    const serialized = JSON.stringify(body);

    if (TAGFLOW_CONFIG.debug) {
      console.info("[Tagflow]", event, { eventId, payload: sanitize(payload) });
    }

    if (options.reliable && navigator.sendBeacon) {
      const sent = navigator.sendBeacon(
        TAGFLOW_CONFIG.endpoint,
        new Blob([serialized], { type: "application/json" }),
      );
      if (sent) return eventId;
    }

    void fetch(TAGFLOW_CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: serialized,
      keepalive: options.reliable === true,
      credentials: "omit",
    }).catch(() => undefined);

    return eventId;
  } catch (error) {
    if (TAGFLOW_CONFIG.debug) console.warn("[Tagflow] envio ignorado", error);
    return null;
  }
}

export function trackEvent(
  event: TagflowEventName,
  params: TagflowPayload = {},
  reliable = false,
) {
  return trackTagflowEvent(event, params, { reliable });
}

export function storeConsent(status: ConsentStatus) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(status));
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGE_EVENT, { detail: status }),
    );
    trackTagflowEvent("cookie_consent_update", {
      analytics: status.analytics,
      marketing: status.marketing,
    });
  } catch {
    // Sem persistência, nenhum rastreamento opcional é habilitado.
  }
}
