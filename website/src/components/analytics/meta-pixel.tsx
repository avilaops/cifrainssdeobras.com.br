"use client";

import * as React from "react";
import Script from "next/script";
import { ANALYTICS_CONFIG, IS_META_PIXEL_CONFIGURED } from "@/config/analytics";
import { CONSENT_CHANGE_EVENT, getStoredConsent } from "@/lib/tagflow";

/**
 * Meta Pixel (Facebook/Instagram Ads). Inerte por padrão , só carrega se
 * NEXT_PUBLIC_META_PIXEL_ID estiver definido, e mesmo assim apenas depois do
 * consentimento de marketing/publicidade (LGPD).
 */
export function AnalyticsMetaPixel() {
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const sync = () => setAllowed(getStoredConsent()?.marketing === true);
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
  }, []);

  if (!IS_META_PIXEL_CONFIGURED || !allowed) return null;

  const pixelId = ANALYTICS_CONFIG.metaPixelId;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
