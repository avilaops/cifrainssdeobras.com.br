import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { ServicePageContent } from "@/config/service-pages";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/motion/reveal";

interface ServicePageViewProps {
  content: ServicePageContent;
}

/** Template das páginas de detalhe de serviço. */
export function ServicePageView({ content }: ServicePageViewProps) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: `${siteConfig.url}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Serviços",
        item: `${siteConfig.url}/servicos/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content.name,
        item: `${siteConfig.url}/servicos/${content.slug}/`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHeader
        title={content.heroTitle}
        description={content.heroDescription}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Serviços", href: "/servicos/" },
        ]}
        currentLabel={content.name}
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="space-y-12">
            {content.sections.map((section) => (
              <Reveal key={section.heading}>
                <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900 sm:text-3xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-4 text-base leading-relaxed text-graphite-700 sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>

          <aside className="lg:pt-2">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-graphite-100 bg-white p-6 shadow-panel sm:p-7 lg:sticky lg:top-28">
                <h2 className="text-lg font-bold text-graphite-900">
                  {content.checklist.heading}
                </h2>
                <ul className="mt-5 space-y-3.5">
                  {content.checklist.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-pine-700">
                        <Check aria-hidden="true" className="size-3.5" />
                      </span>
                      <span className="text-sm leading-relaxed text-graphite-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-2.5">
                  <Button asChild>
                    <Link href="/#formulario">
                      Solicitar análise
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild variant="whatsapp">
                    <WhatsAppLink placement="services" trackingLabel="Falar no WhatsApp">
                      <MessageCircle aria-hidden="true" />
                      Falar no WhatsApp
                    </WhatsAppLink>
                  </Button>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="border-t border-graphite-100 bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-balance text-graphite-900 sm:text-3xl">
              {content.ctaTitle}
            </h2>
            <p className="mt-3 text-lg text-graphite-500">
              A análise inicial é o primeiro passo — rápida, individual e sem
              compromisso.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/#formulario">Preencher formulário</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/servicos/">Ver todos os serviços</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
