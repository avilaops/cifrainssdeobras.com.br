import type { Metadata } from "next";
import {
  Calculator,
  ClipboardCheck,
  Handshake,
  MessageCircle,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Parceria para Arquitetos, Engenheiros e Contadores",
  description:
    "Indique a parte tributária da obra para a CIFRA e entregue um serviço mais completo ao seu cliente, sem sair do seu escopo.",
};

const partners = [
  {
    icon: PenLine,
    title: "Arquitetos",
    description:
      "Seu cliente aprova o projeto e constrói — e na hora de averbar descobre o INSS da obra. Com a CIFRA ao lado, você entrega a solução completa sem assumir um tema fora do seu escopo.",
  },
  {
    icon: ClipboardCheck,
    title: "Engenheiros",
    description:
      "Você cuida da execução e das responsabilidades técnicas; a CIFRA cuida da regularização previdenciária, alinhada com as informações reais da obra.",
  },
  {
    icon: Calculator,
    title: "Contadores",
    description:
      "INSS de obra é um nicho específico dentro do universo fiscal. Some a especialização da CIFRA ao seu escritório e atenda seus clientes construtores com mais profundidade.",
  },
];

const steps = [
  {
    title: "Indicação",
    description:
      "Você apresenta a CIFRA ao seu cliente ou nos envia os dados da obra com autorização dele.",
  },
  {
    title: "Análise e condução",
    description:
      "Fazemos a análise, alinhamos com você o que for técnico e conduzimos a regularização diretamente com o cliente.",
  },
  {
    title: "Retorno e transparência",
    description:
      "Você acompanha o andamento e recebe o retorno do processo — o cliente continua sendo seu.",
  },
];

export default function ParceirosPage() {
  return (
    <>
      <PageHeader
        title="Parceria com quem cuida da obra"
        description="Também atuamos em parceria com arquitetos, engenheiros e contadores, oferecendo suporte especializado na parte tributária da obra — sem disputar o serviço principal desses profissionais."
        currentLabel="Parceiros"
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-4 md:grid-cols-3">
            {partners.map(({ icon: Icon, title, description }, index) => (
              <li key={title}>
                <Reveal
                  delay={index * 0.06}
                  className="h-full rounded-xl border border-graphite-100 bg-white p-6 shadow-soft"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-graphite-900">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-500">
                    {description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Como funciona"
                title="Uma parceria simples e transparente"
                description="Sem burocracia: o objetivo é que seu cliente resolva o INSS da obra com segurança e que você fique bem na indicação."
              />
              <ol className="mt-8 space-y-5">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-extrabold text-pine-700">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-graphite-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-graphite-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-center rounded-2xl bg-pine-800 p-8 sm:p-10">
                <Handshake aria-hidden="true" className="size-10 text-sage-300" />
                <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-paper sm:text-3xl">
                  Vamos conversar sobre parceria?
                </h2>
                <p className="mt-3 text-lg text-sage-200">
                  Chame no WhatsApp e conheça o modelo de atuação conjunta da
                  CIFRA.
                </p>
                <Button asChild variant="light" size="lg" className="mt-6 self-start">
                  <WhatsAppLink placement="services" trackingLabel="Falar sobre parceria" message="Olá, equipe CIFRA! Sou profissional da área e gostaria de conhecer o modelo de parceria.">
                    <MessageCircle aria-hidden="true" />
                    Falar sobre parceria
                  </WhatsAppLink>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
