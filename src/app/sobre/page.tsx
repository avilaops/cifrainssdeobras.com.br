import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileSearch2,
  Handshake,
  Route,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Sobre a CIFRA",
  description:
    "A CIFRA é uma consultoria especializada na análise e regularização do INSS incidente sobre obras da construção civil, com atendimento em todo o Brasil.",
};

const pillars = [
  {
    icon: FileSearch2,
    title: "Análise técnica individual",
    description:
      "Cada obra é estudada isoladamente: características, documentos, cadastros e histórico. Nenhum parecer é padronizado.",
  },
  {
    icon: Scale,
    title: "Estratégia dentro da legislação",
    description:
      "Trabalhamos exclusivamente com as possibilidades previstas nas normas da Receita Federal — economia com segurança jurídica.",
  },
  {
    icon: Route,
    title: "Acompanhamento completo",
    description:
      "Do primeiro contato à certidão da obra, você sabe em que etapa o processo está e o que acontece em seguida.",
  },
  {
    icon: Handshake,
    title: "Parceria com profissionais",
    description:
      "Atuamos ao lado de arquitetos, engenheiros e contadores, cuidando da parte tributária sem invadir o escopo de ninguém.",
  },
];

export default function SobrePage() {
  return (
    <>
      <PageHeader
        title="Especialização tributária para quem está construindo"
        description="A CIFRA nasceu para resolver um problema específico e recorrente: obras que pagam mais INSS do que deveriam por falta de análise, planejamento e organização documental."
        currentLabel="Sobre"
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Quem somos"
                title="Consultoria focada em um único tema: o tributo da sua obra"
              />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-graphite-700 sm:text-lg">
                <p>
                  A CIFRA é uma consultoria especializada na análise e
                  regularização do INSS incidente sobre obras da construção
                  civil. Nosso trabalho é identificar oportunidades de economia
                  dentro da legislação, organizar as informações da obra e
                  acompanhar o cliente durante todas as etapas do processo.
                </p>
                <p>
                  Atendemos proprietários, construtores, incorporadoras e
                  empresas em todo o Brasil, com processo totalmente remoto:
                  análise, orientação e acompanhamento acontecem pelo WhatsApp,
                  e-mail e videochamada, com a mesma proximidade de um
                  atendimento presencial.
                </p>
                <p>
                  Falamos a língua de quem constrói — sem juridiquês. Você
                  entende o que está sendo feito, por que está sendo feito e
                  quais são os resultados possíveis no seu caso.
                </p>
              </div>
            </Reveal>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, description }, index) => (
                <Reveal
                  key={title}
                  delay={index * 0.06}
                  className="rounded-xl border border-graphite-100 bg-white p-5 shadow-soft"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="mt-3 text-sm font-bold text-graphite-900">
                    {title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite-500">
                    {description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl bg-pine-800 p-8 sm:p-10 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-paper sm:text-3xl">
                  Quer saber o que é possível na sua obra?
                </h2>
                <p className="mt-2 text-lg text-sage-200">
                  Envie as informações e receba uma análise inicial individual.
                </p>
              </div>
              <Button asChild variant="light" size="lg" className="shrink-0">
                <Link href="/#formulario">
                  Solicitar análise
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
