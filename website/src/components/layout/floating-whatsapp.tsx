"use client";

import { MessageCircle } from "lucide-react";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";

/** Botão flutuante de WhatsApp, sempre acessível no mobile. */
export function FloatingWhatsApp() {
  return (
    <WhatsAppLink
      placement="floating"
      trackingLabel="WhatsApp flutuante"
      aria-label="Conversar com a CIFRA no WhatsApp"
      className="fixed right-4 bottom-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#128c4b] text-white shadow-lift transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:right-6 sm:bottom-6 print:hidden"
    >
      <MessageCircle aria-hidden="true" className="size-7" />
    </WhatsAppLink>
  );
}
