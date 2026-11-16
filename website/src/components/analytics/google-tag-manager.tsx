import Script from "next/script";

/** Reuses the existing CMP • the runtime chooses the approved business destination. */
export function AnalyticsGtm() {
  return <Script id="avila-measurement-cifra" type="module" src="/consentimento-medicao.mjs" strategy="afterInteractive" />;
}
