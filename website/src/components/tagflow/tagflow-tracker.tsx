"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { createConsentPageViewGate } from "@/lib/consent-pageviews";
import {
  CONSENT_CHANGE_EVENT,
  getStoredConsent,
  trackEvent,
} from "@/lib/tagflow";

/** Registra page views no Tagflow sem carregar tags de terceiros no site. */
export function TagflowTracker() {
  const pathname = usePathname();
  const [consentVersion, setConsentVersion] = React.useState(0);
  const visit = React.useRef(createConsentPageViewGate());

  React.useEffect(() => {
    const sync = () => setConsentVersion((value) => value + 1);
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
  }, []);

  React.useEffect(() => {
    const consent = getStoredConsent();
    if (!visit.current(pathname, consent?.analytics === true)) return;
    trackEvent("page_view");
  }, [pathname, consentVersion]);

  return null;
}
