"use client";

import * as React from "react";
import Link from "next/link";
import {
  Save, FileText, CheckCircle2, TriangleAlert, Loader2, TrendingDown,
  Banknote, BarChart3, Building2, ChevronUp, X,
} from "lucide-react";
import { useWizard, STEPS } from "./simulator-shell";
import { brl } from "@/lib/calc/calculos";
import { TIPOS_OBRA } from "@/lib/calc/dados";

/**
 * Resumo da simulação.
 * Desktop (lg+): coluna fixa à direita, como sempre foi.
 * Celular: barra fixa no rodapé com o número principal e o botão de salvar;
 * o detalhe abre numa folha que sobe da base. Sem isso o resultado ficava uma
 * tela inteira abaixo do formulário e ninguém via.
 */
export function SummaryPanel() {
  const { resultado } = useWizard();

  return (
    <>
      <aside className="hidden h-screen w-[340px] shrink-0 flex-col border-l border-[#e2e4dc] bg-white/80 backdrop-blur-sm lg:flex">
        <div className="border-b border-[#eef0eb] px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
            {resultado ? "Resultado" : "Resumo da simulação"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <PanelBody />
        </div>
      </aside>

      <MobileSummary />
    </>
  );
}

// ── Celular: barra + folha ────────────────────────────────────────────────

function MobileSummary() {
  const { resultado, stepIndex, salvando, salvoId, onSalvar, state } = useWizard();
  const [open, setOpen] = React.useState(false);

  // Quando o cálculo termina, a folha sobe sozinha: é o momento de ver o número.
  // (ajuste de estado durante a renderização, sem efeito, como manda o React)
  const [resultadoVisto, setResultadoVisto] = React.useState(resultado);
  if (resultado !== resultadoVisto) {
    setResultadoVisto(resultado);
    setOpen(Boolean(resultado));
  }

  // Trava a rolagem da página enquanto a folha está aberta
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const progresso = (stepIndex / STEPS.length) * 100;

  return (
    <div className="lg:hidden">
      {/* Barra fixa no rodapé */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d8dbd1] bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-label={resultado ? "Ver resultado completo" : "Ver resumo da simulação"}
          >
            <div className="min-w-0 flex-1">
              {resultado ? (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">Economia estimada</p>
                  <p className="truncate text-lg font-black tabular-nums text-[#1b3629]">{brl(resultado.economiaLiq)}</p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
                    {state.nomeCliente ? state.nomeCliente : "Resumo da simulação"}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eef0eb]">
                      <div className="h-full rounded-full bg-[#2e5240] transition-all duration-300" style={{ width: `${progresso}%` }} />
                    </div>
                    <span className="shrink-0 text-[11px] font-bold text-[#1b3629]">{stepIndex} de {STEPS.length}</span>
                  </div>
                </>
              )}
            </div>
            <ChevronUp className="size-5 shrink-0 text-[#8a9890]" />
          </button>

          {resultado && !salvoId && (
            <button
              onClick={onSalvar}
              disabled={salvando}
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[#1b3629] px-4 text-sm font-bold text-white shadow-md shadow-[#1b3629]/20 transition hover:bg-[#2e5240] disabled:opacity-60"
            >
              {salvando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Salvar
            </button>
          )}
          {resultado && salvoId && (
            <Link
              href={`/simulacoes/${salvoId}`}
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8dbd1] bg-white px-4 text-sm font-bold text-[#1b3629] transition hover:bg-[#eef0eb]"
            >
              <FileText className="size-4" />
              Relatório
            </Link>
          )}
        </div>
      </div>

      {/* Folha */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={resultado ? "Resultado da simulação" : "Resumo da simulação"}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#eef0eb] px-5 pt-3 pb-3">
              <div>
                <span className="mx-auto mb-2 block h-1 w-10 rounded-full bg-[#d8dbd1]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
                  {resultado ? "Resultado" : "Resumo da simulação"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="flex size-10 items-center justify-center rounded-lg text-[#8a9890] hover:bg-[#eef0eb]"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <PanelBody />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Conteúdo (compartilhado entre a coluna e a folha) ─────────────────────

function PanelBody() {
  const { state, resultado, stepIndex, salvando, salvoId, salvarErro, onSalvar } = useWizard();

  const completedSteps = stepIndex;

  return (
    <>
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
              label="COD (Custo da Obra por Destinação)"
              value={brl(resultado.codTotal)}
              icon={Building2}
              accent="neutral"
            />
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
                value={brl(resultado.inssComReducao)}
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

          {/* Parcelamento do INSS */}
          <div className="rounded-xl border border-[#e8eae3] bg-[#f9faf7] p-4 text-xs">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
              Parcelamento do INSS (e-CAC / RFB)
            </p>
            <div className="space-y-2">
              {resultado.podeAjuste && (
                <div className="rounded-lg border border-[#c5d9c8] bg-[#eef5ef] p-2.5">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#4a6b5a]">
                    Com Fator de Ajuste (Planejamento)
                  </span>
                  <span className="text-sm font-black text-[#1b3629]">
                    {resultado.qtdParcelasEcacAjustado}x de {brl(resultado.valorParcelaEcacAjustado)}/mês
                  </span>
                </div>
              )}
              <div className="rounded-lg border border-red-100 bg-red-50/70 p-2.5">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-red-600">
                  Sem Planejamento
                </span>
                <span className="text-sm font-black text-red-950">
                  {resultado.qtdParcelasEcacDevido}x de {brl(resultado.valorParcelaEcacDevido)}/mês
                </span>
              </div>
              <div className="space-y-1 border-t border-[#e8eae3] pt-2">
                <PreviewRow label="Retroativo" value={brl(resultado.retroativo)} />
                <PreviewRow
                  label="Futuro"
                  value={
                    resultado.mesesFuturos > 0
                      ? `${resultado.mesesFuturos}x de ${brl(resultado.parcelaMensal)}`
                      : brl(resultado.futuro)
                  }
                />
                {resultado.multaMaed > 0 && (
                  <PreviewRow label="Multa MAED (atraso DCTFWeb)" value={brl(resultado.multaMaed)} />
                )}
              </div>
            </div>
          </div>

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
    </>
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
    <div className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${bg}`}>
      <div className="flex min-w-0 items-center gap-2">
        <Icon className={`size-3.5 shrink-0 ${textColor}`} />
        <span className={`text-xs font-medium ${textColor}`}>{label}</span>
      </div>
      <span className={`shrink-0 text-xs font-bold tabular-nums ${textColor} ${large ? "text-sm" : ""}`}>{value}</span>
    </div>
  );
}
