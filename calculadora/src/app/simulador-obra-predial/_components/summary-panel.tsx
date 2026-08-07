"use client";

import Link from "next/link";
import { Save, FileText, CheckCircle2, TriangleAlert, Loader2, TrendingDown, Banknote, BarChart3, Building2 } from "lucide-react";
import { useWizard, STEPS } from "./simulator-shell";
import { brl } from "@/lib/calc/calculos";
import { TIPOS_OBRA } from "@/lib/calc/dados";

export function SummaryPanel() {
  const { state, resultado, stepIndex, salvando, salvoId, salvarErro, onSalvar } = useWizard();

  const completedSteps = stepIndex;

  return (
    <aside className="flex h-screen flex-col border-l border-[#e2e4dc] bg-white/80 backdrop-blur-sm lg:w-[340px]">
      {/* Panel header */}
      <div className="border-b border-[#eef0eb] px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
          {resultado ? "Resultado" : "Resumo da simulação"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">

        {/* ── Before calculation: live preview ── */}
        {!resultado && (
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#6b7a70]">Preenchimento</span>
                <span className="text-[10px] font-bold text-[#1b3629]">{completedSteps} de {STEPS.length} etapas</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef0eb]">
                <div
                  className="h-full rounded-full bg-[#2e5240] transition-all duration-300"
                  style={{ width: `${(completedSteps / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-[#e8eae3] bg-[#f9faf7] p-4 text-xs">
              <PreviewRow label="Cliente" value={state.nomeCliente || "—"} />
              <PreviewRow
                label="Responsável"
                value={state.responsavel === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
              />
              {state.responsavel === "pj" && state.regimeTributario && (
                <PreviewRow label="Regime" value={state.regimeTributario} />
              )}
              <PreviewRow label="UF" value={state.uf || "—"} />
              <PreviewRow
                label="Área informada"
                value={state.areaTotal > 0 ? `${state.areaTotal.toLocaleString("pt-BR")} m²` : "—"}
              />
              {state.areaTotal > 0 && (
                <PreviewRow label="Destinação" value={TIPOS_OBRA[state.tipoObra]?.label ?? state.tipoObra} />
              )}
              {state.vauEncontrado && (
                <PreviewRow label="VAU" value={brl(state.vauEncontrado) + "/m²"} />
              )}
            </div>

            <p className="text-center text-[11px] text-[#a0ada5]">
              Complete as 5 etapas e clique em<br />
              <strong>Calcular simulação</strong> na última etapa.
            </p>

            {salvarErro && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                {salvarErro}
              </p>
            )}
          </div>
        )}

        {/* ── After calculation: results ── */}
        {resultado && (
          <div className="space-y-4">
            {/* KPI cards */}
            <div className="space-y-2">
              <ResultKpi
                label="RMT (Mão de obra)"
                value={brl(resultado.rmtTotal)}
                icon={BarChart3}
                accent="neutral"
              />
              <ResultKpi
                label="INSS s/ Planejamento"
                value={brl(resultado.inssBruto)}
                icon={Banknote}
                accent="red"
              />
              {resultado.podeAjuste && (
                <ResultKpi
                  label="INSS c/ Fator de Ajuste"
                  value={brl(resultado.inssDevido)}
                  icon={TrendingDown}
                  accent="green"
                />
              )}
              <ResultKpi
                label="Economia estimada"
                value={brl(resultado.economiaLiq)}
                icon={TrendingDown}
                accent="primary"
                large
              />
              {resultado.honorarios > 0 && (
                <ResultKpi
                  label="Honorários"
                  value={brl(resultado.honorarios)}
                  icon={Banknote}
                  accent="neutral"
                />
              )}
            </div>

            {/* Fator de ajuste status */}
            {!resultado.podeAjuste && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                <span>Área abaixo do mínimo para aplicação do Fator de Ajuste.</span>
              </div>
            )}

            {/* Save actions */}
            <div className="space-y-2 pt-2">
              {salvoId ? (
                <div className="flex items-center gap-2 rounded-lg border border-[#c5d9c8] bg-[#eef5ef] p-3 text-xs font-semibold text-[#2e5240]">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Simulação salva com sucesso.
                </div>
              ) : (
                <button
                  onClick={onSalvar}
                  disabled={salvando}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b3629] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#1b3629]/20 transition hover:bg-[#2e5240] disabled:opacity-60"
                >
                  {salvando
                    ? <><Loader2 className="size-4 animate-spin" /> Salvando…</>
                    : <><Save className="size-4" /> Salvar simulação</>
                  }
                </button>
              )}

              {salvoId && (
                <Link
                  href={`/simulacoes/${salvoId}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#d8dbd1] bg-white px-4 py-2.5 text-xs font-semibold text-[#1b3629] transition hover:bg-[#eef0eb]"
                >
                  <FileText className="size-4" />
                  Gerar relatório
                </Link>
              )}

              {salvarErro && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {salvarErro}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[#8a9890]">{label}</span>
      <span className="truncate text-right font-semibold text-[#1b3629]">{value}</span>
    </div>
  );
}

function ResultKpi({
  label, value, icon: Icon, accent, large,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "neutral" | "red" | "green" | "primary";
  large?: boolean;
}) {
  const bg = {
    neutral: "bg-[#f5f7f4]",
    red: "bg-red-50",
    green: "bg-[#eef5ef]",
    primary: "bg-[#eef0eb]",
  }[accent];
  const textColor = {
    neutral: "text-[#1b3629]",
    red: "text-red-700",
    green: "text-[#2e5240]",
    primary: "text-[#1b3629]",
  }[accent];

  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${bg}`}>
      <div className="flex items-center gap-2">
        <Icon className={`size-3.5 shrink-0 ${textColor}`} />
        <span className={`text-xs font-medium ${textColor}`}>{label}</span>
      </div>
      <span className={`text-xs font-bold ${textColor} ${large ? "text-sm" : ""}`}>{value}</span>
    </div>
  );
}
