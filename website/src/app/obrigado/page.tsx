import type { Metadata } from "next";
import { CircleCheckBig, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";

export const metadata: Metadata = {
  title: "Solicitação recebida",
  description: "Confirmação da solicitação de análise inicial da obra.",
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  return (
    <section className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <CircleCheckBig aria-hidden="true" className="mx-auto size-12 text-pine-700" />
        <h1 className="mt-6 font-display text-4xl font-medium text-graphite-950 sm:text-5xl">
          Solicitação preparada com sucesso
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-graphite-700">
          O WhatsApp foi aberto com os dados organizados. Caso a nova aba não
          tenha aparecido, use o botão abaixo para iniciar a conversa.
        </p>
        <Button asChild variant="whatsapp" size="lg" className="mt-8">
          <WhatsAppLink placement="form" trackingLabel="Continuar no WhatsApp">
            <MessageCircle aria-hidden="true" />
            Continuar no WhatsApp
          </WhatsAppLink>
        </Button>
      </div>
    </section>
  );
}
