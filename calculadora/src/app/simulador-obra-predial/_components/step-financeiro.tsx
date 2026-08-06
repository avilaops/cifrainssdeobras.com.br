"use client";

import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useWizard } from "./simulator-shell";
import { Field, FieldRow, SectionTitle, StepFooter } from "./form-ui";

export function StepFinanceiro() {
  const { state, set, patch, next, back } = useWizard();

  return (
    <div className="space-y-8">

      {/* ── Período da obra ── */}
      <section>
        <SectionTitle>Período da obra</SectionTitle>
        <FieldRow>
          <Field label="Mês/ano de início">
            <input
              type="month"
              value={state.dataInicio}
              onChange={(e) => set("dataInicio", e.target.value)}
              className="input-base"
            />
          </Field>
          <Field label="Mês/ano de encerramento">
            <input
              type="month"
              value={state.dataFim}
              onChange={(e) => set("dataFim", e.target.value)}
              className="input-base"
            />
          </Field>
        </FieldRow>
      </section>

      {/* ── VAU ── */}
      <section>
        <SectionTitle>VAU da competência</SectionTitle>

        <Field label="Competência de referência">
          <input
            type="month"
            value={state.dataFim}
            onChange={(e) => set("dataFim", e.target.value)}
            className="input-base"
          />
        </Field>

        {/* VAU status */}
        <div className="mt-3">
          {state.vauEncontrado && !state.vauManualAtivo ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#c5d9c8] bg-[#eef5ef] p-4">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2e5240]" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-[#1b3629]">VAU encontrado</p>
                <p className="text-xs text-[#4a6b5a]">
                  {state.uf} — {state.competenciaVau}
                </p>
                <p className="mt-1 text-base font-black text-[#1b3629]">
                  R$ {state.vauEncontrado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/m²
                </p>
              </div>
              <button
                type="button"
                onClick={() => set("vauManualAtivo", true)}
                className="text-[10px] font-semibold text-[#4a6b5a] underline underline-offset-2 hover:text-[#1b3629]"
              >
                Informar outro valor
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-amber-800">
                  {state.vauEncontrado ? "Informando VAU manualmente" : "VAU não localizado"}
                </p>
                <p className="text-xs text-amber-700">
                  {state.mensagemVau ?? `VAU não cadastrado para ${state.uf} — ${state.dataFim}.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Manual VAU input */}
        {(state.vauManualAtivo || !state.vauEncontrado) && (
          <div className="mt-3">
            <Field label="Valor do VAU (R$/m²)">
              <div className="flex items-center rounded-lg border border-[#d8dbd1] bg-white px-3 focus-within:border-[#1b3629] focus-within:ring-1 focus-within:ring-[#1b3629]/20">
                <span className="mr-2 text-xs font-semibold text-[#8a9890]">R$</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.vauManual || ""}
                  onChange={(e) => set("vauManual", Number(e.target.value) || 0)}
                  placeholder="0,00"
                  className="flex-1 bg-transparent py-2.5 text-sm text-[#1b3629] outline-none placeholder:text-[#b0bdb5]"
                />
                <span className="text-xs font-semibold text-[#8a9890]">/m²</span>
              </div>
            </Field>
            {state.vauManualAtivo && state.vauEncontrado && (
              <button
                type="button"
                onClick={() => set("vauManualAtivo", false)}
                className="mt-1.5 text-[10px] font-semibold text-[#4a6b5a] underline underline-offset-2 hover:text-[#1b3629]"
              >
                Usar valor do banco de dados
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Honorários ── */}
      <section>
        <SectionTitle>Honorários</SectionTitle>

        <div className="space-y-4">
          <Field label="Deseja calcular os honorários?">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set("honorariosAtivo", false)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${
                  !state.honorariosAtivo
                    ? "border-[#1b3629] bg-[#eef0eb] text-[#1b3629]"
                    : "border-[#d8dbd1] bg-white text-[#6b7a70] hover:border-[#1b3629]/30"
                }`}
              >
                Não calcular
              </button>
              <button
                type="button"
                onClick={() => set("honorariosAtivo", true)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${
                  state.honorariosAtivo
                    ? "border-[#1b3629] bg-[#eef0eb] text-[#1b3629]"
                    : "border-[#d8dbd1] bg-white text-[#6b7a70] hover:border-[#1b3629]/30"
                }`}
              >
                Calcular honorários
              </button>
            </div>
          </Field>

          {state.honorariosAtivo && (
            <>
              <Field label="Percentual (%)">
                <div className="flex items-center rounded-lg border border-[#d8dbd1] bg-white px-3 focus-within:border-[#1b3629] focus-within:ring-1 focus-within:ring-[#1b3629]/20">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={state.honorariosValor || ""}
                    onChange={(e) => set("honorariosValor", Number(e.target.value) || 0)}
                    className="flex-1 bg-transparent py-2.5 text-sm text-[#1b3629] outline-none"
                  />
                  <span className="text-xs font-semibold text-[#8a9890]">%</span>
                </div>
              </Field>
            </>
          )}
        </div>
      </section>

      <StepFooter>
        <button onClick={back} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="size-4" /> Voltar
        </button>
        <button onClick={next} className="btn-primary flex items-center gap-2">
          Revisar <ArrowRight className="size-4" />
        </button>
      </StepFooter>
    </div>
  );
}
