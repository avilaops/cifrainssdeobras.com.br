import { Globe, MessageCircle, Monitor } from "lucide-react";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";

/** Barra superior discreta com mensagem institucional e atalho de contato. */
export function Topbar() {
  return (
    <div className="bg-pine-900 text-sage-200">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-xs sm:px-6">
        <p className="truncate font-medium">
        Consultoria especializada em INSS de obra e regularização tributária.
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden items-center gap-1.5 md:inline-flex">
            <Monitor aria-hidden="true" className="size-3.5" />
            Atendimento online
          </span>
          <span className="hidden items-center gap-1.5 md:inline-flex">
            <Globe aria-hidden="true" className="size-3.5" />
            Atuação em todo o Brasil
          </span>
          <WhatsAppLink placement="header" trackingLabel="WhatsApp" className="inline-flex items-center gap-1.5 font-semibold text-paper transition-colors hover:text-sage-200">
            <MessageCircle aria-hidden="true" className="size-3.5" />
            WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </div>
  );
}
