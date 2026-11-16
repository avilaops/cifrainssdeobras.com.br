"use client";

import * as React from "react";
import { ANALYTICS_CONFIG, IS_META_PIXEL_CONFIGURED } from "@/config/analytics";
import { CONSENT_CHANGE_EVENT, getStoredConsent } from "@/lib/tagflow";
import { createMetaConsent } from "@/lib/meta-consent";

type PixelQueue = ((...args: unknown[]) => void) & {
  queue: unknown[][];
  callMethod?: (...args: unknown[]) => void;
  push: PixelQueue;
  loaded: boolean;
  version: string;
};

function pixelQueue() {
  const target = window as Window & { fbq?: PixelQueue; _fbq?: PixelQueue };
  if (target.fbq) return target.fbq;
  const queue = function (...args: unknown[]) {
    if (queue.callMethod) queue.callMethod(...args);
    else queue.queue.push(args);
  } as PixelQueue;
  queue.queue = [];
  queue.push = queue;
  queue.loaded = true;
  queue.version = "2.0";
  target.fbq = queue;
  target._fbq ||= queue;
  return queue;
}

/**
 * Meta Pixel (Facebook/Instagram Ads). Inerte por padrão , só carrega se
 * NEXT_PUBLIC_META_PIXEL_ID estiver definido, e mesmo assim apenas depois do
 * consentimento de marketing/publicidade (LGPD).
 */
export function AnalyticsMetaPixel() {
  const controller = React.useRef<ReturnType<typeof createMetaConsent> | null>(null);
  const pixelId = ANALYTICS_CONFIG.metaPixelId;

  React.useEffect(() => {
    if (!IS_META_PIXEL_CONFIGURED) return;
    controller.current ||= createMetaConsent({
      enabled: true,
      pushConsent(allowed) {
        pixelQueue()("consent", allowed ? "grant" : "revoke");
        if (!allowed) for (const cookie of document.cookie.split(";")) {
          const name = cookie.trim().split("=")[0];
          if (!/^_fbp$|^_fbc$/.test(name)) continue;
          for (const domain of ["", location.hostname, ".cifrainssdeobras.com.br"]) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? "; Domain=" + domain : ""}`;
        }
      },
      load(ready, failed) {
        if (pixelQueue().callMethod) { ready(); return; }
        const existing = document.getElementById("cifra-meta-sdk") as HTMLScriptElement | null;
        if (existing?.dataset.loaded === "1") { ready(); return; }
        if (existing && existing.dataset.failed !== "1") {
          existing.addEventListener("load", ready, { once: true });
          existing.addEventListener("error", failed, { once: true });
          return;
        }
        existing?.remove();
        const script = document.createElement("script");
        script.id = "cifra-meta-sdk";
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        script.onload = () => { script.dataset.loaded = "1"; ready(); };
        script.onerror = () => { script.dataset.failed = "1"; failed(); };
        document.head.append(script);
      },
      initialize() {
        pixelQueue()("init", pixelId);
        pixelQueue()("track", "PageView");
      },
    });
    const sync = () => controller.current?.apply(getStoredConsent()?.marketing === true);
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
      controller.current?.apply(false);
    };
  }, [pixelId]);

  return null;
}
