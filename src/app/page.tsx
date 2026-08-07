import { siteConfig } from "@/config/site";
import { faqItems } from "@/config/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ProblemsSection } from "@/components/sections/problems-section";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { MidCta } from "@/components/sections/mid-cta";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.legalName,
  url: siteConfig.url,
  description: siteConfig.seo.description,
  areaServed: { "@type": "Country", name: "Brasil" },
  knowsAbout: [
    "INSS de obra",
    "Regularização de obra",
    "CNO — Cadastro Nacional de Obras",
    "SERO — Serviço Eletrônico para Aferição de Obras",
    "Planejamento tributário de obra",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/**
 * Home enxuta e focada em conversão: o simulador do hero alimenta o
 * formulário principal. Conteúdo institucional completo vive em /sobre,
 * /servicos e /parceiros.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={professionalServiceJsonLd} />
      <JsonLd data={faqJsonLd} />

      <Hero />
      <TrustBar />
      <ProblemsSection />
      <ServicesGrid />
      <ProcessTimeline />
      <LeadFormSection />
      <MidCta />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
