import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { ServicesCards } from "@/components/sections/services-cards";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Conheça os serviços da CIFRA: análise de INSS de obra, CNO, SERO, aferição, planejamento tributário, revisão de cálculos e regularização completa.",
};

export default function ServicosPage() {
  return (
    <>
      <PageHeader
        title="Serviços da CIFRA"
        description="Da inscrição no CNO à certidão final: consultoria tributária completa para obras em qualquer fase , planejamento, execução ou conclusão."
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ServicesCards />

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-pine-800 p-8 text-center sm:p-10">
              <h2 className="text-2xl font-extrabold tracking-tight text-balance text-paper sm:text-3xl">
                Não sabe por onde começar?
              </h2>
              <p className="max-w-xl text-lg text-sage-200">
                Envie os dados da sua obra e a equipe indica exatamente o que o
                seu caso precisa.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="light" size="lg">
                  <Link href="/#formulario">Solicitar análise</Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <WhatsAppLink placement="services" trackingLabel="Falar no WhatsApp">
                    <MessageCircle aria-hidden="true" />
                    Falar no WhatsApp
                  </WhatsAppLink>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
