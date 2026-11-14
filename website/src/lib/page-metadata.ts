import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Metadados próprios da página, sem herdar a prévia da página inicial. */
export function pageMetadata({ path, title, description }: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = new URL(path, siteConfig.url).href;
  const previewTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: siteConfig.seo.locale,
      siteName: siteConfig.legalName,
      url,
      title: previewTitle,
      description,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: previewTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: previewTitle,
      description,
      images: ["/og-default.png"],
    },
  };
}
