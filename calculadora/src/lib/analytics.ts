export function trackAnonymous(event: string, data: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const target = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push({ event, app: "calculadora_cifra", ...data });
}
