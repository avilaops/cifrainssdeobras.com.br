import Link from "next/link";
import { ArrowRight, Check, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { HeroSimulator } from "@/components/sections/hero-simulator";

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

        {/* Simulador funcional: primeiros dados da obra */}
        <Reveal
          delay={0.15}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div aria-hidden="true" className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sage-100 via-transparent to-transparent" />
          <HeroSimulator />
        </Reveal>
      </div>
    </section>
  );
}
