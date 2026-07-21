import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const routes = [
  "",
  "/sobre/",
  "/servicos/",
  "/servicos/inss-de-obra/",
  "/servicos/cno/",
  "/servicos/sero/",
  "/servicos/afericao-de-obra/",
  "/servicos/planejamento-tributario/",
  "/parceiros/",
  "/contato/",
  "/procuracao-eletronica/",
  "/politica-de-privacidade/",
  "/termos-de-uso/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
