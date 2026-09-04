"use client";

import * as React from "react";
import Link from "next/link";
import { History, FilePlus, ChevronLeft } from "lucide-react";
import { SimulatorShell, useWizard } from "./_components/simulator-shell";
import { StepNav } from "./_components/step-nav";
import { SummaryPanel } from "./_components/summary-panel";
import { StepObra } from "./_components/step-obra";
import { StepAreas } from "./_components/step-areas";
import { StepAdicionais } from "./_components/step-adicionais";
import { StepFinanceiro } from "./_components/step-financeiro";
import { StepRevisao } from "./_components/step-revisao";

function WizardContent() {
  const { step, reset } = useWizard();

  return (
    // Só no desktop (lg) a tela vira duas colunas com altura fixa. No celular a
    // página rola normalmente e o resumo vira uma barra fixa no rodapé.
    <div className="flex min-h-dvh w-full flex-col lg:h-screen lg:flex-row">
      {/* ── Main Form Area ── */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#f5f5ef] lg:overflow-y-auto">

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#d8dbd1] bg-[#f5f5ef]/90 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link
              href="/ferramentas"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#d8dbd1] bg-white text-[#8a9890] transition hover:border-[#1b3629]/30 hover:text-[#1b3629] sm:size-8"
              title="Voltar para ferramentas"
              aria-label="Voltar para ferramentas"
            >
              <ChevronLeft className="size-4" />
            </Link>
            <h1 className="truncate text-base font-black tracking-tight text-[#1b3629] sm:text-lg">
              Simulador de Obra Predial
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/simulacoes"
              className="flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#6b7a70] transition hover:bg-[#eef0eb] hover:text-[#1b3629]"
              aria-label="Histórico de simulações"
            >
              <History className="size-4" />
              <span className="hidden sm:inline">Histórico</span>
            </Link>
            <button
              onClick={reset}
              className="flex min-h-9 items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#1b3629] shadow-xs transition hover:bg-[#f9faf7]"
              aria-label="Nova simulação"
            >
              <FilePlus className="size-4" />
              <span className="hidden sm:inline">Nova simulação</span>
            </button>
          </div>
        </header>

        {/* Step Nav */}
        <div className="border-b border-[#eef0eb] bg-white px-4 py-3 sm:px-6">
          <StepNav />
        </div>

        {/* Form Body — pb extra no celular para o conteúdo não ficar atrás da barra de resumo */}
        <main className="flex-1 p-4 pb-32 sm:p-6 sm:pb-32 lg:p-8">
          <div className="mx-auto max-w-2xl">
            {step === "obra" && <StepObra />}
            {step === "areas" && <StepAreas />}
            {step === "adicionais" && <StepAdicionais />}
            {step === "financeiro" && <StepFinanceiro />}
            {step === "revisao" && <StepRevisao />}
          </div>
        </main>
      </div>

      {/* ── Summary Panel (coluna no desktop, barra + folha no celular) ── */}
      <SummaryPanel />
    </div>
  );
}

export default function SimuladorPage() {
  return (
    <SimulatorShell>
      <WizardContent />
    </SimulatorShell>
  );
}
