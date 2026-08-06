"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWizard } from "./simulator-shell";
import { Field, FieldRow, SectionTitle, Select, StepFooter } from "./form-ui";
import { TIPOS_OBRA, type TipoObraKey } from "@/lib/calc/dados";

export function StepAreas() {
  const { state, set, next, back } = useWizard();

  const canContinue = state.areaTotal > 0;

  return (
    <div className="space-y-6">
      <SectionTitle>
        Destinação da obra
      </SectionTitle>

      <div className="space-y-4">
        <div className="rounded-xl border border-[#d8dbd1] bg-white p-5 shadow-xs">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4a6b5a]">
              Área para aferição
            </p>
          </div>

          <div className="space-y-4">
            <FieldRow>
              <Field label="Destinação" required>
                <Select
                  value={state.tipoObra}
                  onChange={(e) => set("tipoObra", e.target.value as TipoObraKey)}
                >
                  <option value="" disabled>Selecione...</option>
                  {Object.entries(TIPOS_OBRA).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Área total (m²)" required>
                <div className="flex items-center rounded-lg border border-[#d8dbd1] bg-white px-3 focus-within:border-[#1b3629] focus-within:ring-1 focus-within:ring-[#1b3629]/20">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={state.areaTotal || ""}
                    onChange={(e) => set("areaTotal", Number(e.target.value) || 0)}
                    placeholder="0"
                    className="flex-1 bg-transparent py-2.5 text-sm text-[#1b3629] outline-none placeholder:text-[#b0bdb5]"
                  />
                  <span className="text-xs font-semibold text-[#8a9890]">m²</span>
                </div>
              </Field>
            </FieldRow>

            <Field label="Opção de aferição">
              <div className="flex gap-2">
                {(["completa", "parcial"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      set("opcaoAfericao", v);
                      if (v === "completa") set("areaAferir", undefined);
                    }}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                      state.opcaoAfericao === v
                        ? "border-[#1b3629] bg-[#eef0eb] text-[#1b3629]"
                        : "border-[#d8dbd1] bg-white text-[#6b7a70] hover:border-[#1b3629]/30"
                    }`}
                  >
                    {v === "completa" ? "Aferir obra completa" : "Aferir área parcial"}
                  </button>
                ))}
              </div>
            </Field>

            {state.opcaoAfericao === "parcial" && (
              <Field label="Área a aferir (m²)">
                <div className="flex items-center rounded-lg border border-[#d8dbd1] bg-white px-3 focus-within:border-[#1b3629] focus-within:ring-1 focus-within:ring-[#1b3629]/20">
                  <input
                    type="number"
                    min={0}
                    max={state.areaTotal}
                    step={0.01}
                    value={state.areaAferir || ""}
                    onChange={(e) => set("areaAferir", Number(e.target.value) || 0)}
                    placeholder="0"
                    className="flex-1 bg-transparent py-2.5 text-sm text-[#1b3629] outline-none placeholder:text-[#b0bdb5]"
                  />
                  <span className="text-xs font-semibold text-[#8a9890]">m²</span>
                </div>
              </Field>
            )}
          </div>
        </div>
      </div>

      <StepFooter>
        <button onClick={back} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="size-4" /> Voltar
        </button>
        <button onClick={next} disabled={!canContinue} className="btn-primary flex items-center gap-2">
          Continuar <ArrowRight className="size-4" />
        </button>
      </StepFooter>
    </div>
  );
}
