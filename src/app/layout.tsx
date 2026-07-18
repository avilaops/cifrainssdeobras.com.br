import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import { siteConfig } from "@/config/site";
import { Topbar } from "@/components/layout/topbar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { TagflowTracker } from "@/components/tagflow/tagflow-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/**
 * A marca usa a fonte Asgrike, mas não há arquivo licenciado no projeto.
 * Oswald (condensada, institucional) cobre o wordmark até a fonte oficial
 * ser adicionada via next/font/local.
 */
const display = Oswald({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.title,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  alternates: {
    // "./" resolve para a rota atual — canonical correto em todas as páginas.
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.seo.locale,
    url: siteConfig.url,
    siteName: siteConfig.legalName,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url: "/images/logo-cifra.jpg",
        width: 1246,
        height: 1246,
        alt: "CIFRA — Consultoria Tributária de Obra",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ["/images/logo-cifra.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1f2919",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.legalName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo-cifra.jpg`,
  description: siteConfig.shortDescription,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "pt-BR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${display.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />

        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-pine-800 focus:px-4 focus:py-2 focus:text-paper"
        >
          Pular para o conteúdo
        </a>

        <Topbar />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />

        <FloatingWhatsApp />
        <CookieConsent />
        <TagflowTracker />
      </body>
    </html>
  );
}
