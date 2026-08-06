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
    <div className="flex h-screen w-full flex-col lg:flex-row">
      {/* ── Main Form Area ── */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#f5f5ef]">
        
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d8dbd1] bg-[#f5f5ef]/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link
              href="/ferramentas"
              className="flex size-8 items-center justify-center rounded-lg border border-[#d8dbd1] bg-white text-[#8a9890] transition hover:border-[#1b3629]/30 hover:text-[#1b3629]"
              title="Voltar para ferramentas"
            >
              <ChevronLeft className="size-4" />
            </Link>
            <h1 className="text-lg font-black tracking-tight text-[#1b3629]">
              Simulador de Obra Predial
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/simulacoes"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#6b7a70] transition hover:bg-[#eef0eb] hover:text-[#1b3629]"
            >
              <History className="size-4" />
              <span className="hidden sm:inline">Histórico</span>
            </Link>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#1b3629] shadow-xs transition hover:bg-[#f9faf7]"
            >
              <FilePlus className="size-4" />
              <span className="hidden sm:inline">Nova simulação</span>
            </button>
          </div>
        </header>

        {/* Step Nav */}
        <div className="border-b border-[#eef0eb] bg-white px-6 py-3">
          <StepNav />
        </div>

        {/* Form Body */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            {step === "obra" && <StepObra />}
            {step === "areas" && <StepAreas />}
            {step === "adicionais" && <StepAdicionais />}
            {step === "financeiro" && <StepFinanceiro />}
            {step === "revisao" && <StepRevisao />}
          </div>
        </main>
      </div>

      {/* ── Summary Panel ── */}
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
