import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ServicesCards } from "@/components/sections/services-cards";

export function ServicesGrid() {
  return (
    <section id="servicos" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Serviços"
            title="Tudo o que sua obra precisa para se regularizar pagando o justo"
            description="Da inscrição no CNO à certidão final, a CIFRA cuida da parte tributária da obra em todas as fases."
          />
        </Reveal>

        <div className="mt-12">
          <ServicesCards />
        </div>
      </div>
    </section>
  );
}
