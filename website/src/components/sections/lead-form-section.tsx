import { SectionHeading } from "@/components/ui/section-heading";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";

/** Seção destacada do formulário principal de conversão. */
export function LeadFormSection() {
  return (
    <section
      id="formulario"
      className="border-y border-graphite-100 bg-cream py-20 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Análise inicial"
            title="Solicite uma análise inicial da sua obra"
            description="Preencha as informações abaixo. Ao finalizar, você será direcionado ao WhatsApp com os dados organizados para iniciar o atendimento."
            align="center"
          />
        </Reveal>
        <div className="mt-12">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
