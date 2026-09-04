"use client";

import * as React from "react";
import Link from "next/link";
import {
  CONSENT_CHANGE_EVENT,
  getStoredConsent,
  storeConsent,
} from "@/lib/tagflow";
import { Button } from "@/components/ui/button";

// O localStorage é a fonte externa: no servidor o banner não existe (snapshot
// false), no cliente ele aparece só enquanto não há escolha gravada.
function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
const semEscolha = () => getStoredConsent() === null;
const noServidor = () => false;

/**
 * Banner de consentimento (LGPD). A escolha define quais encaminhamentos o
 * Tagflow poderá realizar; nenhuma tag de terceiro é carregada diretamente.
 */
export function CookieConsent() {
  const visible = React.useSyncExternalStore(subscribe, semEscolha, noServidor);

  if (!visible) return null;

  // storeConsent dispara CONSENT_CHANGE_EVENT, que esconde o banner.
  const choose = (analytics: boolean, marketing: boolean) => {
    storeConsent({ analytics, marketing });
  };

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-xl rounded-xl border border-graphite-200 bg-white p-5 shadow-lift sm:bottom-6 sm:left-6 sm:mx-0"
    >
      <p className="text-sm leading-relaxed text-graphite-700">
        Usamos cookies opcionais para medir visitas e campanhas. Você pode
        permitir somente métricas ou também marketing. Saiba mais
        na nossa{" "}
        <Link
          href="/politica-de-privacidade/"
          className="font-semibold text-pine-700 underline underline-offset-2"
        >
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => choose(true, true)}>
          Aceitar todos
        </Button>
        <Button size="sm" variant="secondary" onClick={() => choose(true, false)}>
          Somente métricas
        </Button>
        <Button size="sm" variant="ghost" onClick={() => choose(false, false)}>
          Recusar opcionais
        </Button>
      </div>
    </div>
  );
}
