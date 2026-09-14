import {
  Eye,
  FileSearch2,
  FolderOpen,
  Headset,
  MessageSquareText,
  Monitor,
  Route,
  Scale,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

const benefits = [
  { icon: FileSearch2, label: "Análise individual da obra" },
  { icon: Headset, label: "Atendimento direto, sem intermediários" },
  { icon: MessageSquareText, label: "Linguagem clara, sem juridiquês" },
  { icon: Route, label: "Acompanhamento do início ao fim" },
  { icon: Scale, label: "Estratégia dentro da legislação" },
  { icon: FolderOpen, label: "Organização documental completa" },
  { icon: Monitor, label: "Atendimento remoto em todo o Brasil" },
  { icon: Eye, label: "Transparência em todas as etapas" },
];

export function BenefitsSection() {
  return (
    <section id="diferenciais" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Diferenciais"
            title="O que você encontra na CIFRA"
            align="center"
          />
        </Reveal>

        <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, label }, index) => (
            <li key={label}>
              <Reveal
                delay={(index % 4) * 0.05}
                className="flex items-start gap-3.5"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <p className="pt-2 text-sm font-bold text-graphite-900">
                  {label}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
