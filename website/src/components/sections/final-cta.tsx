import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-pine-900 py-20 sm:py-28">
      {/* Linhas de grade discretas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(250_249_245/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(250_249_245/0.04)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-paper sm:text-4xl">
            Regularize sua obra com mais estratégia e segurança.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-sage-200">
            Converse com a CIFRA e solicite uma análise inicial do seu caso.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="whatsapp" size="lg">
              <WhatsAppLink placement="final_cta" trackingLabel="Solicitar análise pelo WhatsApp">
                <MessageCircle aria-hidden="true" />
                Solicitar análise pelo WhatsApp
              </WhatsAppLink>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link href="/#formulario">Preencher formulário</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
