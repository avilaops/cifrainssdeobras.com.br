import type { Metadata } from "next";
import { Globe, Mail, MessageCircle, Monitor } from "lucide-react";
import { CONTACT_EMAIL } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { EmailLink } from "@/components/layout/email-link";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a CIFRA pelo WhatsApp ou envie o formulário de análise inicial da sua obra. Atendimento online em todo o Brasil.",
};

export default function ContatoPage() {
  return (
    <>
      <PageHeader
        title="Fale com a CIFRA"
        description="O caminho mais rápido é o WhatsApp , ou preencha o formulário abaixo para iniciar o atendimento com os dados da obra já organizados."
        currentLabel="Contato"
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal className="flex h-full flex-col rounded-xl border border-graphite-100 bg-white p-6 shadow-soft">
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
                <MessageCircle aria-hidden="true" className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-bold text-graphite-900">
                WhatsApp comercial
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-500">
                Atendimento direto com a equipe, de forma prática e organizada.
              </p>
              <Button asChild variant="whatsapp" className="mt-5">
                <WhatsAppLink placement="contact_page" trackingLabel="Iniciar conversa">
                  <MessageCircle aria-hidden="true" />
                  Iniciar conversa
                </WhatsAppLink>
              </Button>
            </Reveal>

            {CONTACT_EMAIL && (
              <Reveal
                delay={0.05}
                className="flex h-full flex-col rounded-xl border border-graphite-100 bg-white p-6 shadow-soft"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
                  <Mail aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-bold text-graphite-900">
                  E-mail
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-500">
                  Para envio de documentos e assuntos formais.
                </p>
                <Button asChild variant="secondary" className="mt-5">
                  <EmailLink email={CONTACT_EMAIL}>{CONTACT_EMAIL}</EmailLink>
                </Button>
              </Reveal>
            )}

            <Reveal
              delay={0.1}
              className="flex h-full flex-col rounded-xl border border-graphite-100 bg-white p-6 shadow-soft"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
                <Monitor aria-hidden="true" className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-bold text-graphite-900">
                Atendimento online
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-500">
                Processo 100% remoto e documentado, em todo o Brasil.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pine-700">
                <Globe aria-hidden="true" className="size-4" />
                {siteConfig.domain}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <LeadFormSection />
    </>
  );
}
