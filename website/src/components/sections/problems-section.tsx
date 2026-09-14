import {
  AlertTriangle,
  CalendarX,
  FileWarning,
  FileX2,
  ScanSearch,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

const problems = [
  { icon: TrendingUp, label: "Cálculo elevado de INSS" },
  { icon: FileX2, label: "Documentação incompleta" },
  { icon: ScanSearch, label: "Divergências cadastrais" },
  { icon: AlertTriangle, label: "Falta de planejamento antes da aferição" },
  { icon: ShieldAlert, label: "Risco de cobrança indevida" },
  { icon: FileWarning, label: "Dificuldade para emitir certidões" },
  { icon: CalendarX, label: "Atraso na regularização do imóvel" },
];

export function ProblemsSection() {
  return (
    <section className="bg-pine-900 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="O problema"
            title="Regularizar uma obra sem planejamento pode custar mais do que deveria."
            className="max-w-3xl"
          />
        </Reveal>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(({ icon: Icon, label }, index) => (
            <li key={label}>
              <Reveal
                delay={index * 0.04}
                className="flex h-full items-center gap-3.5 rounded-xl border border-paper/10 bg-paper/5 p-4"
              >
                <Icon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-sage-300"
                />
                <span className="text-sm font-semibold text-paper">
                  {label}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.15}>
          <p className="mt-12 max-w-3xl border-l-2 border-sage-300 pl-5 text-lg leading-relaxed font-medium text-sage-200">
            Antes de aceitar qualquer valor, é importante analisar os dados da
            obra e verificar as possibilidades previstas na legislação.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
