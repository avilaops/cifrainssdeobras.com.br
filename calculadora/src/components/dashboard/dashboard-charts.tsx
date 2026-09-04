"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { brl } from "@/lib/calc/calculos";

// Paleta da marca (mesma do restante do painel): pinho escuro para o valor
// principal, oliva para o secundário, cinza-verde para referência.
const COR_PRINCIPAL = "#1b3629";
const COR_SECUNDARIA = "#7c8a68";
const COR_REFERENCIA = "#a0ada5";
const COR_GRADE = "#e2e4dc";
const COR_TEXTO = "#6b7a70";

const PIE_COLORS = [COR_PRINCIPAL, COR_SECUNDARIA];

type DashboardChartsProps = {
  dataClientes: Array<{ name: string; totalINSS: number; economia: number }>;
  dataReducao: Array<{ name: string; value: number }>;
  dataTempo: Array<{ name: string; inssBruto: number; inssDevido: number }>;
};

type Tab = "reducao" | "cliente" | "tempo";

const TABS: { id: Tab; label: string }[] = [
  { id: "reducao", label: "Redução" },
  { id: "cliente", label: "Por cliente" },
  { id: "tempo", label: "Por período" },
];

/** Formato curto para eixos: R$ 12 mil, R$ 1,2 mi. */
function moedaCurta(value: number) {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} mil`;
  return brl(value);
}

/** Nome do cliente no eixo X: corta para não empilhar no celular. */
function nomeCurto(name: string) {
  return name.length > 12 ? `${name.slice(0, 11)}…` : name;
}

const RADIAN = Math.PI / 180;

/** Porcentagem desenhada dentro da fatia; fora dela o texto sai da tela no celular. */
function PercentLabel(props: {
  cx?: number; cy?: number; midAngle?: number;
  innerRadius?: number; outerRadius?: number; percent?: number;
}) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

// Tooltip preso à área do gráfico: no celular o toque é o único jeito de ler
// o valor, então ele não pode vazar para fora da tela.
const TOOLTIP_PROPS = {
  allowEscapeViewBox: { x: false, y: false },
  wrapperStyle: { maxWidth: "calc(100vw - 4rem)", zIndex: 10 },
  contentStyle: {
    borderRadius: 10,
    border: `1px solid ${COR_GRADE}`,
    boxShadow: "0 4px 16px rgb(35 38 31 / 0.08)",
    fontSize: 12,
    padding: "8px 10px",
  },
  labelStyle: { color: COR_PRINCIPAL, fontWeight: 700, marginBottom: 4 },
  itemStyle: { color: COR_TEXTO, padding: 0 },
} as const;

function Legenda({ itens }: { itens: Array<{ cor: string; nome: string; valor?: string }> }) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6">
      {itens.map((i) => (
        <li key={i.nome} className="flex min-w-0 items-start gap-2">
          <span className="mt-1 size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: i.cor }} />
          <span className="min-w-0">
            <span className="block truncate text-[#6b7a70]">{i.nome}</span>
            {i.valor && <span className="block font-bold text-[#1b3629]">{i.valor}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Vazio() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm text-[#8a9890]">Nenhuma simulação salva ainda.</p>
      <Link
        href="/simulador-obra-predial"
        className="inline-flex items-center gap-2 rounded-lg bg-[#1b3629] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2e5240]"
      >
        <SlidersHorizontal className="size-4" />
        Fazer a primeira simulação
      </Link>
    </div>
  );
}

export function DashboardCharts({ dataClientes, dataReducao, dataTempo }: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("reducao");

  const totalReducao = dataReducao.reduce((acc, d) => acc + d.value, 0);
  const reducaoVazia = dataReducao.length === 0 || totalReducao === 0;

  return (
    <div className="w-full space-y-4">
      {/* Abas: rótulos curtos cabem lado a lado em 390 px; se não couberem, rolam. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max gap-1 rounded-xl bg-[#eef0eb] p-1 sm:min-w-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:flex-1 sm:text-sm ${
                activeTab === t.id
                  ? "bg-white text-[#1b3629] shadow-sm"
                  : "text-[#6b7a70] hover:text-[#1b3629]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Área do gráfico */}
      <div className="rounded-2xl border border-[#e2e4dc] bg-white p-4 sm:p-6">

        {activeTab === "reducao" && (
          <div>
            <h3 className="mb-4 text-center text-sm font-bold text-[#1b3629]">INSS devido x economia gerada</h3>
            <div className="h-[240px] w-full sm:h-[280px]">
              {reducaoVazia ? (
                <Vazio />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataReducao}
                      cx="50%"
                      cy="50%"
                      innerRadius="45%"
                      outerRadius="80%"
                      paddingAngle={2}
                      labelLine={false}
                      dataKey="value"
                      label={PercentLabel}
                      stroke="#fff"
                    >
                      {dataReducao.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...TOOLTIP_PROPS} formatter={(value) => brl(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            {!reducaoVazia && (
              <Legenda
                itens={dataReducao.map((d, i) => ({
                  cor: PIE_COLORS[i % PIE_COLORS.length],
                  nome: d.name,
                  valor: brl(d.value),
                }))}
              />
            )}
            <p className="mt-4 text-center text-xs text-[#8a9890]">
              O que será pago de INSS nas obras e o que deixou de ser pago com o planejamento.
            </p>
          </div>
        )}

        {activeTab === "cliente" && (
          <div>
            <h3 className="mb-4 text-center text-sm font-bold text-[#1b3629]">Maiores clientes por INSS e economia</h3>
            <div className="h-[240px] w-full sm:h-[280px]">
              {dataClientes.length === 0 ? (
                <Vazio />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataClientes} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COR_GRADE} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: COR_TEXTO }}
                      tickFormatter={nomeCurto}
                      interval={0}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={moedaCurta}
                      tick={{ fontSize: 11, fill: COR_TEXTO }}
                      width={64}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip {...TOOLTIP_PROPS} formatter={(value) => brl(Number(value))} cursor={{ fill: "#f5f7f4" }} />
                    <Bar dataKey="totalINSS" name="INSS devido" fill={COR_PRINCIPAL} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="economia" name="Economia gerada" fill={COR_SECUNDARIA} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {dataClientes.length > 0 && (
              <Legenda
                itens={[
                  { cor: COR_PRINCIPAL, nome: "INSS devido" },
                  { cor: COR_SECUNDARIA, nome: "Economia gerada" },
                ]}
              />
            )}
          </div>
        )}

        {activeTab === "tempo" && (
          <div>
            <h3 className="mb-4 text-center text-sm font-bold text-[#1b3629]">INSS por mês de simulação</h3>
            <div className="h-[240px] w-full sm:h-[280px]">
              {dataTempo.length === 0 ? (
                <Vazio />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataTempo} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COR_GRADE} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: COR_TEXTO }} axisLine={false} tickLine={false} />
                    <YAxis
                      tickFormatter={moedaCurta}
                      tick={{ fontSize: 11, fill: COR_TEXTO }}
                      width={64}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip {...TOOLTIP_PROPS} formatter={(value) => brl(Number(value))} />
                    <Line type="monotone" dataKey="inssBruto" name="INSS bruto" stroke={COR_REFERENCIA} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="inssDevido" name="INSS devido" stroke={COR_PRINCIPAL} strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            {dataTempo.length > 0 && (
              <Legenda
                itens={[
                  { cor: COR_REFERENCIA, nome: "INSS bruto" },
                  { cor: COR_PRINCIPAL, nome: "INSS devido" },
                ]}
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
