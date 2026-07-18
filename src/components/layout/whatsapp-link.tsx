"use client";

import * as React from "react";
import { trackEvent } from "@/lib/tagflow";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp";

interface WhatsAppLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  message?: string;
  placement: WhatsAppPlacement;
  trackingLabel?: string;
}

export type WhatsAppPlacement =
  | "header"
  | "hero"
  | "floating"
  | "services"
  | "process"
  | "form"
  | "intermediate_cta"
  | "final_cta"
  | "footer"
  | "contact_page";

/**
 * Link wa.me com mensagem pré-preenchida e rastreamento de clique.
 * Combine com <Button asChild> para virar botão.
 */
export const WhatsAppLink = React.forwardRef<
  HTMLAnchorElement,
  WhatsAppLinkProps
>(
  (
    {
      message = DEFAULT_WHATSAPP_MESSAGE,
      placement,
      trackingLabel = "WhatsApp",
      onClick,
      children,
      ...props
    },
    ref,
  ) => (
    <a
      ref={ref}
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        const params = { placement, buttonLabel: trackingLabel };
        trackEvent("click_whatsapp", params);
        trackEvent("whatsapp_redirect", params, true);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  ),
);
WhatsAppLink.displayName = "WhatsAppLink";
