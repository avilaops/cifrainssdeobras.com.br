import { Check, Handshake } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

const audiences = [
  {
    title: "Proprietários de imóveis",
    description: "que precisam regularizar a construção para averbar, vender ou financiar.",
  },
  {
    title: "Construtores",
    description: "que querem prever o custo previdenciário e evitar surpresas no fim da obra.",
  },
  {
    title: "Incorporadoras",
    description: "que precisam de processos organizados e certidões sem atraso.",
  },
  {
    title: "Empresas",
    description: "que constroem, ampliam ou reformam suas instalações.",
  },
  {
    title: "Engenheiros",
    description: "que querem apoio tributário para entregar um projeto completo ao cliente.",
  },
  {
    title: "Arquitetos parceiros",
    description: "que desejam encaminhar a regularização sem sair do seu escopo.",
  },
  {
    title: "Contadores",
    description: "que buscam um especialista em obra para atender seus clientes.",
  },
  {
    title: "Profissionais de regularização",
    description: "que acompanham obras e precisam de suporte na etapa tributária.",
  },
];

export function AudienceSection() {
  return (
    <section id="para-quem" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Para quem é"
            title="Para quem constrói — e para quem cuida de quem constrói"
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(({ title, description }, index) => (
            <li key={title}>
              <Reveal
                delay={(index % 4) * 0.05}
                className="h-full rounded-xl border border-graphite-100 bg-white p-5 shadow-soft"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-sage-100 text-pine-700">
                  <Check aria-hidden="true" className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-graphite-900">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-graphite-500">
                  {description}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-pine-600/15 bg-sage-50 p-6 sm:flex-row sm:items-center">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-pine-700 shadow-soft">
              <Handshake aria-hidden="true" className="size-5" />
            </span>
            <p className="text-base leading-relaxed text-graphite-700">
              <strong className="text-graphite-900">
                Também atuamos em parceria com arquitetos, engenheiros e
                contadores
              </strong>
              , oferecendo suporte especializado na parte tributária da obra —
              sem disputar o serviço principal desses profissionais.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
