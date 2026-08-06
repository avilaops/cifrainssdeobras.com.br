"use client";

import { ArrowLeft, Calculator, Loader2 } from "lucide-react";
import { TIPOS_OBRA } from "@/lib/calc/dados";
import { useWizard } from "./simulator-shell";
import { SectionTitle, StepFooter } from "./form-ui";

export function StepRevisao() {
  const { state, back, goTo, calcular, calculando } = useWizard();

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#6b7a70]">
        Confirme os dados abaixo antes de calcular a simulação.
      </p>

      {/* ── Identificação ── */}
      <ReviewSection title="Identificação" onEdit={() => goTo("obra")}>
        <ReviewRow label="Cliente" value={state.nomeCliente || "—"} />
        <ReviewRow label="Responsável" value={state.responsavel === "pf" ? "Pessoa Física" : "Pessoa Jurídica"} />
        {state.responsavel === "pj" && state.regimeTributario && (
          <ReviewRow label="Regime tributário" value={state.regimeTributario} />
        )}
        {state.telefone && <ReviewRow label="Telefone" value={state.telefone} />}
        {state.email && <ReviewRow label="E-mail" value={state.email} />}
      </ReviewSection>

      {/* ── Obra ── */}
      <ReviewSection title="Obra" onEdit={() => goTo("obra")}>
        <ReviewRow label="Tipo de obra" value={state.material === "ALVENARIA" ? "Alvenaria" : state.material === "MADEIRA" ? "Madeira" : "Mista"} />
        <ReviewRow label="Concreto usinado" value={state.concretoUsinado ? "Sim" : "Não"} />
        <ReviewRow label="UF" value={state.uf} />
        <ReviewRow
          label="Pré-moldados"
          value={{ nao: "Não utiliza", menor_40: "< 40%", maior_40: "> 40%" }[state.preMoldado]}
        />
      </ReviewSection>

      {/* ── Áreas ── */}
      <ReviewSection title="Áreas" onEdit={() => goTo("areas")}>
        <ReviewRow
          label="Destinação"
          value={`${TIPOS_OBRA[state.tipoObra]?.label ?? state.tipoObra} — ${state.areaTotal.toLocaleString("pt-BR")} m²${
            state.opcaoAfericao === "parcial" && state.areaAferir
              ? ` (aferir ${state.areaAferir} m²)`
              : ""
          }`}
        />
        <ReviewRow label="Área total" value={`${state.areaTotal.toLocaleString("pt-BR")} m²`} />
      </ReviewSection>

      {/* ── Adicionais ── */}
      {(state.temReformaDemolicao || state.temAreasComplementares) && (
        <ReviewSection title="Adicionais" onEdit={() => goTo("adicionais")}>
          {state.temReformaDemolicao && state.areaReforma > 0 && (
            <ReviewRow label="Área de reforma" value={`${state.areaReforma} m²`} />
          )}
          {state.temReformaDemolicao && state.areaDemolicao > 0 && (
            <ReviewRow label="Área de demolição" value={`${state.areaDemolicao} m² (Tipo: ${state.tipoDemolicao})`} />
          )}
          {state.temAreasComplementares && state.piscinaDescoberta > 0 && (
            <ReviewRow label="Piscina descoberta" value={`${state.piscinaDescoberta} m²`} />
          )}
          {state.temAreasComplementares && state.piscinaCoberta > 0 && (
            <ReviewRow label="Piscina coberta" value={`${state.piscinaCoberta} m²`} />
          )}
        </ReviewSection>
      )}

      {/* ── VAU e Honorários ── */}
      <ReviewSection title="VAU e Honorários" onEdit={() => goTo("financeiro")}>
        <ReviewRow label="Período" value={`${state.dataInicio} a ${state.dataFim}`} />
        <ReviewRow
          label="VAU"
          value={
            state.vauManualAtivo || !state.vauEncontrado
              ? `R$ ${state.vauManual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/m² (manual)`
              : `R$ ${state.vauEncontrado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/m² (banco de dados)`
          }
        />
        <ReviewRow
          label="Honorários"
          value={
            !state.honorariosAtivo
              ? "Não calcular"
              : `${state.honorariosValor}% sobre a economia`
          }
        />
      </ReviewSection>

      <ObservacoesField />

      <StepFooter>
        <button onClick={back} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="size-4" /> Voltar e corrigir
        </button>
        <button
          onClick={calcular}
          disabled={calculando}
          className="btn-primary flex items-center gap-2 px-6"
        >
          {calculando
            ? <><Loader2 className="size-4 animate-spin" /> Calculando…</>
            : <><Calculator className="size-4" /> Calcular simulação</>
          }
        </button>
      </StepFooter>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function ObservacoesField() {
  const { state, set } = useWizard();
  return (
    <div>
      <label className="field-label">Observações (opcional)</label>
      <textarea
        value={state.observacoes}
        onChange={(e) => set("observacoes", e.target.value)}
        placeholder="Notas internas sobre esta simulação…"
        rows={3}
        className="input-base mt-1.5 w-full resize-none"
      />
    </div>
  );
}

function ReviewSection({
  title, onEdit, children,
}: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#d8dbd1] bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#eef0eb] px-4 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#4a6b5a]">{title}</p>
        <button
          onClick={onEdit}
          className="text-[10px] font-semibold text-[#4a6b5a] underline underline-offset-2 hover:text-[#1b3629]"
        >
          Editar
        </button>
      </div>
      <div className="divide-y divide-[#f0f1ec] px-4">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-xs">
      <span className="text-[#8a9890]">{label}</span>
      <span className="text-right font-semibold text-[#1b3629]">{value}</span>
    </div>
  );
}
