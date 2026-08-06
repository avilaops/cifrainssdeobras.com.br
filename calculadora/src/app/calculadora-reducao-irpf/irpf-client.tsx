"use client";

import * as React from "react";
import { RefreshCw, Calculator, ChevronDown, CheckCircle2, TriangleAlert, ArrowRight } from "lucide-react";
import { brl } from "@/lib/calc/calculos";
import {
  calcularIRPF,
  TipoCalculo,
  ModeloDeclaracao,
  IRPFInput,
  IRPFResult,
  TabelaIRPFItem,
  RegraReducaoIRPFItem,
  ParametrosImpostosData,
} from "@/lib/calc/irpf";

interface Props {
  ano: number;
  tabelasIrpf: TabelaIRPFItem[];
  tabelasInss: any[];
  regrasReducao: RegraReducaoIRPFItem[];
  parametros: ParametrosImpostosData;
}

export default function IRPFClient({ ano, tabelasIrpf, tabelasInss, regrasReducao, parametros }: Props) {
  const [tipoCalculo, setTipoCalculo] = React.useState<TipoCalculo>("mensal");
  const [salarioBruto, setSalarioBruto] = React.useState<number | "">("");
  const [outrosDescontos, setOutrosDescontos] = React.useState<number | "">("");
  const [rendimentoAnual, setRendimentoAnual] = React.useState<number | "">("");
  const [modelo, setModelo] = React.useState<ModeloDeclaracao>("legais");
  const [descontosLegais, setDescontosLegais] = React.useState<number | "">("");
  const [resultado, setResultado] = React.useState<IRPFResult | null>(null);

  const tabelasIrpfFiltradas = tabelasIrpf.filter(
    (t) => t.tipo === (tipoCalculo === "mensal" ? "MENSAL" : "ANUAL")
  );
  const regrasReducaoFiltradas = regrasReducao.filter(
    (r) => r.tipo === (tipoCalculo === "mensal" ? "MENSAL" : "ANUAL")
  );

  const handleCalcular = () => {
    const input: IRPFInput = {
      tipoCalculo,
      salarioBruto: Number(salarioBruto) || 0,
      outrosDescontos: Number(outrosDescontos) || 0,
      rendimentoAnual: Number(rendimentoAnual) || 0,
      modelo,
      descontosLegais: Number(descontosLegais) || 0,
    };
    setResultado(calcularIRPF(input, tabelasIrpf, regrasReducao, parametros));
  };

  const handleRefazer = () => setResultado(null);

  return (
    <div className="min-h-screen bg-[#f5f5ef]">
      {/* Page Header */}
      <div className="border-b border-[#d8dbd1] bg-[#f5f5ef]/80 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
            Calculadoras — Lei nº 15.270, de 26 de novembro de 2025
          </p>
          <h1 className="mt-0.5 text-lg font-bold text-[#1b3629]">Redução de IRPF</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-0 lg:grid-cols-[380px_1fr]">
        {/* ─── PANEL ESQUERDO: FORMULÁRIO ─── */}
        <aside className="flex flex-col gap-5 border-r border-[#d8dbd1] bg-white/70 p-6 backdrop-blur-sm lg:h-[calc(100vh-8.5rem)] lg:overflow-y-auto">
          <SecTitle>Tipo de Cálculo</SecTitle>

          {/* Tipo toggle */}
          <div className="flex gap-1.5 rounded-xl bg-[#eef0eb] p-1">
            {(["mensal", "anual"] as TipoCalculo[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTipoCalculo(t);
                  setResultado(null);
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  tipoCalculo === t
                    ? "bg-white text-[#1b3629] shadow-sm"
                    : "text-[#6b7a70] hover:text-[#1b3629]"
                }`}
              >
                {t === "mensal" ? "Mensal" : "Anual"}
              </button>
            ))}
          </div>

          {tipoCalculo === "mensal" && (
            <>
              <SecTitle>Dados Mensais</SecTitle>
              <Field label="Salário Bruto">
                <CurrencyInput
                  value={salarioBruto}
                  onChange={(v) => { setSalarioBruto(v); setResultado(null); }}
                />
              </Field>
              <Field label="Outros Descontos (opcional)">
                <CurrencyInput
                  value={outrosDescontos}
                  onChange={(v) => { setOutrosDescontos(v); setResultado(null); }}
                />
              </Field>
            </>
          )}

          {tipoCalculo === "anual" && (
            <>
              <SecTitle>Dados Anuais</SecTitle>
              <Field label="Rendimento Anual">
                <CurrencyInput
                  value={rendimentoAnual}
                  onChange={(v) => { setRendimentoAnual(v); setResultado(null); }}
                />
              </Field>
              <Field label="Modelo de Declaração">
                <SelectField
                  value={modelo}
                  onChange={(e) => { setModelo(e.target.value as ModeloDeclaracao); setResultado(null); }}
                >
                  <option value="legais">Descontos Legais</option>
                  <option value="simplificado">Simplificado</option>
                </SelectField>
              </Field>
              {modelo === "legais" && (
                <Field label="Total de Descontos Legais">
                  <CurrencyInput
                    value={descontosLegais}
                    onChange={(v) => { setDescontosLegais(v); setResultado(null); }}
                  />
                </Field>
              )}
            </>
          )}

          <div className="mt-2">
            {!resultado ? (
              <button
                onClick={handleCalcular}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b3629] px-5 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-[#1b3629]/20 transition-all hover:bg-[#2e5240] hover:shadow-[#1b3629]/30"
              >
                <Calculator className="size-4" />
                Calcular
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleRefazer}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#d8dbd1] bg-white px-5 py-3.5 text-sm font-bold text-[#1b3629] transition-all hover:bg-[#eef0eb]"
              >
                <RefreshCw className="size-4" />
                Novo Cálculo
              </button>
            )}
          </div>
        </aside>

        {/* ─── PAINEL DIREITO: RESULTADO ─── */}
        <main className="p-6">
          {!resultado ? (
            <EmptyState />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">

              {/* Result Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">Resultado</p>
                  <h2 className="text-lg font-bold text-[#1b3629]">
                    Cálculo {tipoCalculo === "mensal" ? "Mensal" : "Anual"} — IRPF {ano}
                  </h2>
                </div>
                <span className="rounded-full border border-[#c5cdb8] bg-[#eef0eb] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#4a6b5a]">
                  Lei 15.270/2025
                </span>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                  label="Base de Cálculo"
                  value={brl(resultado.baseDeCalculo)}
                  sub={tipoCalculo === "mensal" ? "após INSS e descontos" : "após deduções legais"}
                  accent="neutral"
                />
                <KpiCard
                  label="IRPF sem Redução"
                  value={brl(resultado.irpfInicial)}
                  sub="tabela progressiva bruta"
                  accent="red"
                />
                <KpiCard
                  label="Redução (Lei 15.270)"
                  value={brl(resultado.reducao ?? 0)}
                  sub="redutor aplicado"
                  accent="green"
                />
                <KpiCard
                  label="IRPF Final"
                  value={brl(resultado.irpfFinal)}
                  sub="a pagar / reter na fonte"
                  accent="primary"
                />
              </div>

              {/* Status badge */}
              {resultado.irpfFinal === 0 ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#c5d9c8] bg-[#eef5ef] p-4 text-sm text-[#2e5240]">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2e5240]" />
                  <span>
                    Este contribuinte está <strong>isento de IRPF</strong> com base na tabela progressiva e no redutor da Lei 15.270/2025.
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#d8dbd1] bg-[#f5f5ef] p-4 text-xs text-[#6b7a70]">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[#8a9890]" />
                  <span>
                    Valores estimados com base em dados de referência. O cálculo oficial deve ser feito via <strong>Declaração de Ajuste Anual</strong> na Receita Federal.
                  </span>
                </div>
              )}

              {/* IRPF Table */}
              <ResultCard title="Tabela Progressiva IRPF">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#d8dbd1]">
                      {["Faixa de Renda", "Alíquota", "Parcela a Deduzir"].map((h) => (
                        <th key={h} className="pb-2 pr-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#6b7a70]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tabelasIrpfFiltradas.map((t, idx) => (
                      <tr key={idx} className="border-b border-[#eef0eb] last:border-none">
                        <td className="py-2 pr-4 text-[#1b3629]">
                          {t.faixaFim
                            ? idx === 0 ? `Até ${brl(t.faixaFim)}` : `${brl(t.faixaInicio)} – ${brl(t.faixaFim)}`
                            : `Acima de ${brl(t.faixaInicio)}`}
                        </td>
                        <td className={`py-2 pr-4 font-bold ${t.aliquota === 0 ? "text-[#2e5240]" : "text-[#1b3629]"}`}>
                          {(t.aliquota * 100).toFixed(1)}%
                        </td>
                        <td className="py-2 text-[#4a6b5a]">{brl(t.deducao)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ResultCard>

              {/* INSS Table (monthly only) */}
              {tipoCalculo === "mensal" && tabelasInss.length > 0 && (
                <ResultCard title="Tabela Progressiva INSS Mensal">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#d8dbd1]">
                        {["Faixa Salarial", "Alíquota", "Parcela a Deduzir"].map((h) => (
                          <th key={h} className="pb-2 pr-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#6b7a70]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tabelasInss.map((t, idx) => (
                        <tr key={idx} className="border-b border-[#eef0eb] last:border-none">
                          <td className="py-2 pr-4 text-[#1b3629]">
                            {t.faixaFim
                              ? idx === 0 ? `Até ${brl(t.faixaFim)}` : `${brl(t.faixaInicio)} – ${brl(t.faixaFim)}`
                              : `Acima de ${brl(t.faixaInicio)}`}
                          </td>
                          <td className="py-2 pr-4 font-bold text-[#1b3629]">{(t.aliquota * 100).toFixed(1)}%</td>
                          <td className="py-2 text-[#4a6b5a]">{brl(t.deducao)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ResultCard>
              )}

              {/* Reduction Rules */}
              {regrasReducaoFiltradas.length > 0 && (
                <ResultCard title="Regras de Redução — Lei 15.270/2025">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#d8dbd1]">
                        {["Faixa de Renda", "Base de Subtração", "Multiplicador"].map((h) => (
                          <th key={h} className="pb-2 pr-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#6b7a70]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {regrasReducaoFiltradas.map((r, idx) => (
                        <tr key={idx} className="border-b border-[#eef0eb] last:border-none">
                          <td className="py-2 pr-4 text-[#1b3629]">{brl(r.faixaInicio)} – {brl(r.faixaFim)}</td>
                          <td className="py-2 pr-4 font-bold text-[#2e5240]">{brl(r.valorBaseSubtracao)}</td>
                          <td className="py-2 text-[#4a6b5a]">{(r.multiplicadorRenda * 100).toFixed(4)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ResultCard>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center text-[#6b7a70]">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-[#d8dbd1] bg-[#eef0eb]">
        <Calculator className="size-8 text-[#2e5240]" />
      </div>
      <div>
        <p className="text-base font-semibold text-[#1b3629]">Preencha os dados ao lado</p>
        <p className="mt-1 max-w-60 text-sm text-[#8a9890]">
          O resultado do cálculo de IRPF aparecerá aqui automaticamente.
        </p>
      </div>
    </div>
  );
}

function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#4a6b5a] uppercase">
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-[#d8dbd1] to-transparent" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold tracking-wide text-[#4a6b5a] uppercase">{label}</label>
      {children}
    </div>
  );
}

function CurrencyInput({
  value,
  onChange,
}: {
  value: number | "";
  onChange: (v: number | "") => void;
}) {
  return (
    <div className="flex items-center rounded-lg border border-[#d8dbd1] bg-white px-3 shadow-xs transition-all focus-within:border-[#1b3629] focus-within:ring-1 focus-within:ring-[#1b3629]/20">
      <span className="mr-2 text-xs font-semibold text-[#8a9890]">R$</span>
      <input
        type="number"
        min={0}
        step={0.01}
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        className="flex-1 bg-transparent py-2.5 text-sm text-[#1b3629] placeholder:text-[#b0bdb5] outline-none"
        placeholder="0,00"
      />
    </div>
  );
}

function SelectField({
  value,
  onChange,
  children,
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-lg border border-[#d8dbd1] bg-white px-3 py-2.5 pr-8 text-sm text-[#1b3629] shadow-xs outline-none transition-all focus:border-[#1b3629] focus:ring-1 focus:ring-[#1b3629]/20"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#4a6b5a]" />
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "neutral" | "red" | "green" | "primary";
}) {
  const topColor = {
    neutral: "from-[#d8dbd1] to-[#c8cbc0]",
    red: "from-red-400 to-red-500",
    green: "from-[#2e5240] to-[#1b3629]",
    primary: "from-[#4a6b5a] to-[#2e5240]",
  }[accent];

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#d8dbd1] bg-white/80 p-4 backdrop-blur-sm">
      <span className={`absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r ${topColor}`} />
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6b7a70]">{label}</p>
      <p className="text-xl font-black tracking-tight text-[#1b3629]">{value}</p>
      <p className="mt-0.5 text-[10px] text-[#8a9890]">{sub}</p>
    </div>
  );
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#d8dbd1] bg-white/80 p-5 backdrop-blur-sm">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">{title}</p>
      {children}
    </div>
  );
}
