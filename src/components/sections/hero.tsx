import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleCheckBig,
  FileText,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const trustIndicators = [
  "Atendimento especializado",
  "Análise individual",
  "Economia dentro da legislação",
  "Acompanhamento completo",
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-paper">
      {/* Grade financeira sutil ao fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(35_38_31/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(35_38_31/0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-28">
        {/* Texto */}
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-pine-600/20 bg-sage-50 px-3.5 py-1.5 text-xs font-bold tracking-wide text-pine-700 uppercase">
              <Percent aria-hidden="true" className="size-3.5" />
              INSS de obra · CNO · SERO
            </p>
            <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-graphite-900 sm:text-5xl lg:text-[3.4rem]">
              Reduza o INSS da sua obra com{" "}
              <span className="text-pine-700">planejamento, segurança</span> e
              conformidade.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite-500">
              A CIFRA analisa sua obra, identifica oportunidades legais de
              economia e acompanha todo o processo de aferição e regularização
              tributária.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/#formulario">
                  Solicitar análise da obra
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/#como-funciona">Entender como funciona</Link>
              </Button>
            </div>

            <ul className="mt-10 grid max-w-lg grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {trustIndicators.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm font-semibold text-graphite-700"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-pine-700">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Painel abstrato de análise tributária (ilustrativo) */}
        <Reveal delay={0.15} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden="true" className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sage-100 via-transparent to-transparent" />

            <div className="relative rounded-2xl border border-graphite-100 bg-white p-6 shadow-panel sm:p-7">
              {/* Cabeçalho do painel */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sage-100 text-pine-700">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-graphite-900">
                      Análise tributária da obra
                    </p>
                    <p className="text-xs text-graphite-400">
                      Painel ilustrativo
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-sage-50 px-3 py-1 text-[0.65rem] font-bold tracking-wide text-pine-700 uppercase">
                  Em análise
                </span>
              </div>

              {/* Dados informados */}
              <dl className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-cream p-4">
                  <dt className="text-xs font-semibold text-graphite-500">
                    Tipo da obra
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-graphite-900">
                    Residencial
                  </dd>
                </div>
                <div className="rounded-xl bg-cream p-4">
                  <dt className="text-xs font-semibold text-graphite-500">
                    Área informada
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-graphite-900">
                    250 m²
                  </dd>
                </div>
              </dl>

              {/* Valor estimado + indicador percentual */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-sage-200 bg-sage-50 p-4">
                <div>
                  <p className="text-xs font-semibold text-graphite-500">
                    Economia potencial estimada
                  </p>
                  <p className="mt-1 text-xl font-extrabold tracking-tight text-pine-800">
                    R$ •••••
                  </p>
                  <p className="text-[0.65rem] text-graphite-400">
                    definida após análise individual
                  </p>
                </div>
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-pine-800 text-paper">
                  <Percent className="size-5" />
                </span>
              </div>

              {/* Etapas concluídas */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-graphite-500">Etapas do processo</span>
                  <span className="text-pine-700">4 de 5 concluídas</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-graphite-100">
                  <div className="h-full w-4/5 rounded-full bg-pine-600" />
                </div>
              </div>

              {/* Selo de regularização */}
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-graphite-100 p-4">
                <BadgeCheck className="size-6 shrink-0 text-pine-700" />
                <p className="text-sm font-semibold text-graphite-700">
                  Regularização acompanhada do início à certidão
                </p>
              </div>
            </div>

            {/* Cartão flutuante */}
            <div className="absolute -top-5 -right-3 hidden items-center gap-2 rounded-xl border border-graphite-100 bg-white px-4 py-3 shadow-lift sm:flex">
              <CircleCheckBig className="size-5 text-pine-700" />
              <p className="text-xs font-bold text-graphite-900">
                Documentação organizada
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
