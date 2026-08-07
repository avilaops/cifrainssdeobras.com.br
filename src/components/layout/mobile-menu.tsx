"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Menu, MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";

/** Menu expansível para telas menores, com trava de rolagem e tecla Esc. */
export function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const [menuTop, setMenuTop] = React.useState(0);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const updateMenuPosition = React.useCallback(() => {
    const header = triggerRef.current?.closest("header");
    setMenuTop(header?.getBoundingClientRect().bottom ?? 0);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    updateMenuPosition();
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", updateMenuPosition);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", updateMenuPosition);
      document.body.style.overflow = "";
    };
  }, [open, updateMenuPosition]);

  const toggleMenu = () => {
    if (!open) updateMenuPosition();
    setOpen((current) => !current);
  };

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={toggleMenu}
        className="inline-flex size-11 items-center justify-center rounded-lg text-pine-800 transition-colors hover:bg-sage-50"
      >
        {open ? (
          <X aria-hidden="true" className="size-6" />
        ) : (
          <Menu aria-hidden="true" className="size-6" />
        )}
      </button>

      {open &&
        createPortal(
          <div
            id="menu-mobile"
            style={{ top: menuTop }}
            className="fixed inset-x-0 bottom-0 z-[45] overflow-y-auto border-t border-graphite-100 bg-paper"
          >
            <nav aria-label="Navegação principal" className="px-4 py-6 sm:px-6">
              <ul className="flex flex-col">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3.5 text-lg font-semibold text-graphite-900 transition-colors hover:bg-sage-50 hover:text-pine-800"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 border-t border-graphite-100 pt-6">
                <Button asChild size="lg">
                  <Link href="/#formulario" onClick={() => setOpen(false)}>
                    Solicitar análise
                  </Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <WhatsAppLink placement="header" trackingLabel="Falar no WhatsApp" onClick={() => setOpen(false)}>
                    <MessageCircle aria-hidden="true" />
                    Falar no WhatsApp
                  </WhatsAppLink>
                </Button>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
