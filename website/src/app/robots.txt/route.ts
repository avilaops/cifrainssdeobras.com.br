import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  const texto = [
    "User-agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
    "Allow: /",
    "Disallow: /obrigado/",
    "",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(texto, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
