"use client";

import React, { useState } from "react";
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
  Legend
} from "recharts";
import { brl } from "@/lib/calc/calculos";

const COLORS = ["#f59e0b", "#d97706", "#b45309", "#78350f", "#451a03"];

type DashboardChartsProps = {
  dataClientes: Array<{ name: string; totalINSS: number; economia: number }>;
  dataReducao: Array<{ name: string; value: number }>;
  dataTempo: Array<{ name: string; inssBruto: number; inssDevido: number }>;
};

export function DashboardCharts({ dataClientes, dataReducao, dataTempo }: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState<"reducao" | "cliente" | "tempo">("reducao");

  const formatMoney = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return brl(value);
  };

  return (
    <div className="w-full max-w-4xl space-y-6 mt-8">
      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("reducao")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "reducao" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Redução X INSS
        </button>
        <button
          onClick={() => setActiveTab("cliente")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "cliente" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Cliente X INSS
        </button>
        <button
          onClick={() => setActiveTab("tempo")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "tempo" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Data X INSS
        </button>
      </div>

      {/* Chart Area */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {activeTab === "reducao" && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-serif text-[#002D62] mb-6">Comparativo de INSS Total (Redução)</h3>
            <div className="w-full h-[300px]">
              {dataReducao.length === 0 || dataReducao.every(d => d.value === 0) ? (
                <div className="flex items-center justify-center h-full text-gray-400">Nenhum dado disponível</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataReducao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {dataReducao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => brl(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Total de INSS Bruto vs O que será pago efetivamente vs Economia Gerada nas obras.
            </p>
          </div>
        )}

        {activeTab === "cliente" && (
          <div>
            <h3 className="text-lg font-serif text-[#002D62] mb-6 text-center">Top Clientes por INSS e Economia</h3>
            <div className="w-full h-[300px]">
              {dataClientes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">Nenhum dado disponível</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataClientes} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={formatMoney} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any) => brl(Number(value))} cursor={{ fill: 'transparent' }} />
                    <Legend />
                    <Bar dataKey="totalINSS" name="INSS Devido" fill="#002D62" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="economia" name="Economia Gerada" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {activeTab === "tempo" && (
          <div>
            <h3 className="text-lg font-serif text-[#002D62] mb-6 text-center">Volume de Simulações (Data x INSS)</h3>
            <div className="w-full h-[300px]">
              {dataTempo.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">Nenhum dado disponível</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataTempo} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={formatMoney} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any) => brl(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="inssBruto" name="INSS Bruto" stroke="#9ca3af" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="inssDevido" name="INSS Devido" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
