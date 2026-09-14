import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Reveal } from "@/components/motion/reveal";

/** CTA intermediário para quem já recebeu um cálculo de INSS. */
export function MidCta() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-pine-800 p-8 sm:p-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-balance text-paper sm:text-3xl">
                Recebeu um cálculo de INSS e não sabe se o valor está correto?
              </h2>
              <p className="mt-3 text-lg text-sage-200">
                Antes de pagar ou concluir a aferição, solicite uma análise
                especializada.
              </p>
            </div>
            <Button asChild variant="light" size="lg" className="shrink-0">
              <WhatsAppLink placement="intermediate_cta" trackingLabel="Conversar com a CIFRA" message="Olá, equipe CIFRA! Recebi um cálculo de INSS da minha obra e gostaria de uma análise antes de pagar.">
                <MessageCircle aria-hidden="true" />
                Conversar com a CIFRA
              </WhatsAppLink>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
