import Link from "next/link";
import {
  ArrowRight,
  FolderOpen,
  Handshake,
  LineChart,
  SearchCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

const highlights = [
  { icon: SearchCheck, label: "Análise técnica" },
  { icon: Handshake, label: "Atendimento consultivo" },
  { icon: LineChart, label: "Planejamento tributário" },
  { icon: FolderOpen, label: "Organização documental" },
  { icon: ShieldCheck, label: "Redução de riscos" },
  { icon: UserRound, label: "Acompanhamento personalizado" },
];

export function AboutSection() {
  return (
    <section id="sobre" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Sobre a CIFRA"
            title="Especialização tributária para quem está construindo"
          />
          <p className="mt-6 text-lg leading-relaxed text-graphite-500">
            A CIFRA é uma consultoria especializada na análise e regularização
            do INSS incidente sobre obras da construção civil. Nosso trabalho é
            identificar oportunidades de economia dentro da legislação,
            organizar as informações da obra e acompanhar o cliente durante
            todas as etapas do processo.
          </p>
          <Link
            href="/sobre/"
            className="mt-6 inline-flex items-center gap-2 font-bold text-pine-700 transition-colors hover:text-pine-800"
          >
            Conheça a CIFRA
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-graphite-100 bg-white p-4 shadow-soft"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-sm font-bold text-graphite-900">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
