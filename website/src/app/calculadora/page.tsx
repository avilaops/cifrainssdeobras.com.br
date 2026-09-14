"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";

export default function CalculatorRedirectPage() {
  useEffect(() => {
    window.location.replace(siteConfig.calculatorUrl);
  }, []);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <title>Abrindo a calculadora | CIFRA</title>
      <meta name="robots" content="noindex, nofollow" />

      <p className="text-sm font-semibold tracking-wide text-pine-700 uppercase">
        Área do cliente
      </p>
      <h1 className="mt-3 text-3xl font-bold text-graphite-900">
        Abrindo a calculadora segura da CIFRA
      </h1>
      <p className="mt-4 max-w-xl text-graphite-500" aria-live="polite">
        Você será direcionado para o ambiente autenticado da calculadora.
      </p>
      <a
        href={siteConfig.calculatorUrl}
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-pine-800 px-6 font-semibold text-white transition-colors hover:bg-pine-700 focus:outline-none focus:ring-2 focus:ring-pine-600 focus:ring-offset-2"
      >
        Continuar para a calculadora
      </a>
    </section>
  );
}
