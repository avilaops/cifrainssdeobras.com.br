"use client";

import * as React from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { ANALYTICS_CONFIG, IS_GTM_CONFIGURED } from "@/config/analytics";
import { CONSENT_CHANGE_EVENT, getStoredConsent } from "@/lib/tagflow";

/** Carrega o GTM somente após consentimento de analytics, e só se configurado. */
export function AnalyticsGtm() {
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const sync = () => setAllowed(getStoredConsent()?.analytics === true);
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
  }, []);

  if (!IS_GTM_CONFIGURED || !allowed) return null;
  return <GoogleTagManager gtmId={ANALYTICS_CONFIG.gtmId} />;
}
