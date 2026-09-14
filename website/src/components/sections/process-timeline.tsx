import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    title: "Envio das informações",
    description:
      "O cliente informa os dados iniciais da obra por meio do formulário ou WhatsApp.",
  },
  {
    title: "Análise preliminar",
    description:
      "A equipe avalia as características da obra e identifica os documentos necessários.",
  },
  {
    title: "Diagnóstico tributário",
    description:
      "São verificadas oportunidades de economia, inconsistências e possíveis riscos.",
  },
  {
    title: "Regularização",
    description:
      "A CIFRA orienta e acompanha os procedimentos necessários para a aferição e regularização.",
  },
  {
    title: "Conclusão",
    description:
      "O cliente recebe o processo organizado e as orientações finais para prosseguir com segurança.",
  },
];

export function ProcessTimeline() {
  return (
    <section id="como-funciona" className="bg-sage-50 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Como funciona"
              title="Um processo claro, do primeiro contato à conclusão"
              description="Você acompanha cada etapa e sabe exatamente o que está sendo feito , sem juridiquês e sem surpresas."
            />
          </div>
        </Reveal>

        <ol className="relative space-y-2">
          {steps.map((step, index) => (
            <li key={step.title} className="relative pb-2 pl-16 last:pb-0">
              {/* Linha vertical conectando as etapas */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-12 left-[1.4rem] h-[calc(100%-2rem)] w-px bg-sage-200"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute top-1 left-0 inline-flex size-11 items-center justify-center rounded-full border border-pine-600/20 bg-white text-base font-extrabold text-pine-700 shadow-soft"
              >
                {index + 1}
              </span>
              <Reveal delay={index * 0.06}>
                <div className="rounded-xl border border-graphite-100 bg-white p-5 shadow-soft">
                  <h3 className="text-base font-bold text-graphite-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite-500">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
