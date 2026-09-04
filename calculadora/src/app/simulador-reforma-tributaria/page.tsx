"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Banknote, Calculator, FileText, ChevronDown, SlidersHorizontal
} from "lucide-react";
import { brl } from "@/lib/calc/calculos";
import { calcularReformaTributaria, type DadosReforma, type ResultadoReforma } from "@/lib/calc/reforma-tributaria";

const TIPOS_OPERACAO = [
  "Aluguel de longo prazo",
  "Aluguel de curto prazo",
  "Incorporação 1%",
  "Incorporação 4%",
  "Alienação de bens imóveis",
  "Empreitada de construção",
  "Intermediação de negócios",
];

const ANOS = ["2027", "2028", "2029", "2030", "2031", "2032", "2033"];

export default function ReformaTributariaPage() {
  const [tipoOperacao, setTipoOperacao] = React.useState(TIPOS_OPERACAO[0]);
  const [usoResidencial, setUsoResidencial] = React.useState(true);
  const [ano, setAno] = React.useState(ANOS[0]);
  const [valorOperacao, setValorOperacao] = React.useState(0);
  
  // Redutor social agora é automático (max 600), vamos apenas exibir o valor na tela
  const [redutorAjuste, setRedutorAjuste] = React.useState(0);
  const [outrasDeducoes, setOutrasDeducoes] = React.useState(0);
  
  const [creditosCbs, setCreditosCbs] = React.useState(0);
  const [creditosIbs, setCreditosIbs] = React.useState(0);
  
  const [informarAliquotaEfetiva, setInformarAliquotaEfetiva] = React.useState(false);

  const [resultado, setResultado] = React.useState<ResultadoReforma | null>(null);

  const isAluguel = tipoOperacao.includes('Aluguel') || tipoOperacao.includes('locação');

  const handleCalculate = () => {
    const dados: DadosReforma = {
      tipoOperacao,
      usoResidencial,
      valorOperacao: Number(valorOperacao) || 0,
      anoCbsIbs: ano,
      redutorSocial: 0, // calculado no backend
      redutorAjuste: isAluguel ? 0 : (Number(redutorAjuste) || 0),
      outrasDeducoes: Number(outrasDeducoes) || 0,
      creditosCbs: Number(creditosCbs) || 0,
      creditosIbs: Number(creditosIbs) || 0,
      informarAliquotaEfetiva
    };
    const res = calcularReformaTributaria(dados);
    setResultado(res);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Esquerda: Formulário */}
      <div className="flex-1 lg:max-w-xl bg-white border-r border-gray-200 shadow-sm flex flex-col h-full z-10 overflow-y-auto">
        <div className="p-6 md:p-8 bg-gradient-to-br from-[#1f2919] to-[#293622] text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calculator className="w-5 h-5 text-[#cdd5c0]" />
            </div>
            <h1 className="text-2xl font-display font-medium tracking-wide">Reforma Tributária</h1>
          </div>
          <p className="text-[#aab598] text-sm">
            LEI COMPLEMENTAR Nº 214, DE 16 DE JANEIRO DE 2025
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#1f2919] flex items-center gap-2 pb-2 border-b border-gray-100">
              <SlidersHorizontal className="w-4 h-4 text-[#758860]" />
              Configurações
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de operação: *</label>
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-[#758860] focus:border-[#758860] appearance-none"
                    value={tipoOperacao}
                    onChange={e => setTipoOperacao(e.target.value)}
                  >
                    {TIPOS_OPERACAO.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano da CBS/IBS: *</label>
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-[#758860] focus:border-[#758860] appearance-none"
                    value={ano}
                    onChange={e => setAno(e.target.value)}
                  >
                    {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor da operação *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#758860] focus:border-[#758860] transition-shadow"
                  placeholder="0,00"
                  value={valorOperacao || ''}
                  onChange={e => setValorOperacao(Number(e.target.value))}
                />
              </div>
            </div>
            
            {isAluguel && (
              <div className="mt-4">
                <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-[#f2f4ee] transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-[#566b47] rounded focus:ring-[#758860]"
                    checked={usoResidencial}
                    onChange={e => setUsoResidencial(e.target.checked)}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">O imóvel é residencial?</span>
                    <span className="text-xs text-gray-500">Aplica redutor social de até R$ 600,00 na base de cálculo.</span>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#1f2919] flex items-center gap-2 pb-2 border-b border-gray-100">
              <Banknote className="w-4 h-4 text-[#758860]" />
              Redutores e Deduções
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isAluguel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Redutor ajuste</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
                    <input
                      type="number"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#758860] focus:border-[#758860] transition-shadow"
                      placeholder="0,00"
                      value={redutorAjuste || ''}
                      onChange={e => setRedutorAjuste(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outras exclusões legais</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#758860] focus:border-[#758860] transition-shadow"
                    placeholder="0,00"
                    value={outrasDeducoes || ''}
                    onChange={e => setOutrasDeducoes(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Créditos aproveitáveis de CBS</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#758860] focus:border-[#758860] transition-shadow"
                    placeholder="0,00"
                    value={creditosCbs || ''}
                    onChange={e => setCreditosCbs(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Créditos aproveitáveis de IBS</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#758860] focus:border-[#758860] transition-shadow"
                    placeholder="0,00"
                    value={creditosIbs || ''}
                    onChange={e => setCreditosIbs(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 mt-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-[#f2f4ee] transition-colors">
              <input
                type="checkbox"
                className="w-5 h-5 text-[#566b47] rounded focus:ring-[#758860]"
                checked={informarAliquotaEfetiva}
                onChange={e => setInformarAliquotaEfetiva(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-900">Informar alíquotas efetivas?</span>
            </label>
          </div>

        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-[#1f2919] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#293622] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calcular
          </button>
        </div>
      </div>

      {/* Direita: Relatório */}
      <div className="flex-1 bg-[#f8f9fa] flex flex-col h-full overflow-y-auto relative">
        {!resultado ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-xl font-display font-medium text-gray-500 mb-2">Nenhuma simulação ativa</p>
            <p className="text-sm max-w-sm">Preencha os dados ao lado e clique em Calcular para visualizar o relatório completo.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto w-full space-y-8"
          >
            <div className="text-center pb-8 border-b border-gray-200">
              <h2 className="text-4xl font-display font-bold text-[#1f2919] mb-2">Relatório</h2>
              <p className="text-amber-600 font-medium tracking-wide text-sm uppercase">Cálculo da Reforma Tributária</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-amber-600">Dados Iniciais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-800 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p><span className="text-gray-500">Ano selecionado:</span> <strong className="text-gray-900">{ano}</strong></p>
                <p><span className="text-gray-500">Valor da operação:</span> <strong className="text-gray-900">{brl(valorOperacao)}</strong></p>
                <p><span className="text-gray-500">Exclusões legais:</span> <strong className="text-gray-900">{brl(outrasDeducoes)}</strong></p>
                <p className="col-span-1 sm:col-span-2 pt-2 border-t border-gray-100"><span className="text-gray-500">Base tributável (IBS/CBS):</span> <strong className="text-gray-900">{brl(resultado.baseCalculo)}</strong></p>
              </div>
            </div>

            <div className="rounded-2xl overflow-x-auto border border-[#1f2919]/10 shadow-sm">
              <table className="w-full min-w-[600px] text-sm text-left">
                <thead className="bg-[#161c12] text-white">
                  <tr>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Regime Geral</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-center">Alíquota</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-center">Redução</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-center">Alíquota Reduzida</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-right">Débito Bruto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {resultado.tabela1.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-900">{item.nome}</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-center text-gray-500">{(item.aliquota * 100).toFixed(2)}%</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-center text-gray-500">{(item.reducao * 100).toFixed(2)}%</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-center text-gray-500">{(item.aliquotaReduzida * 100).toFixed(2)}%</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-right font-medium text-gray-900">{brl(item.debitoBruto)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#f2f4ee] font-medium text-gray-900">
                  <tr>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">Total</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-center">{(resultado.tabela1Total.aliquota * 100).toFixed(2)}%</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-center">{(resultado.tabela1Total.reducao * 100).toFixed(2)}%</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-center">{(resultado.tabela1Total.aliquotaReduzida * 100).toFixed(2)}%</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-right font-bold text-[#435738]">{brl(resultado.tabela1Total.debitoBruto)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="rounded-2xl overflow-x-auto border border-[#1f2919]/10 shadow-sm mt-6">
              <table className="w-full min-w-[520px] text-sm text-center">
                <thead className="bg-[#161c12] text-white">
                  <tr>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-left">Tributo</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Débito Bruto</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Créditos</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Tributo Líquido a Pagar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-gray-900 text-left">CBS</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-700">{brl(resultado.tabela2.subtotalCbs)}</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-700">{brl(resultado.tabela2.creditosCbs)}</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 font-bold text-gray-900">{brl(resultado.tabela2.cbsAPagar)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-gray-900 text-left">IBS (Estadual + Mun.)</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-700">{brl(resultado.tabela2.subtotalIbs)}</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-700">{brl(resultado.tabela2.creditosIbs)}</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 font-bold text-gray-900">{brl(resultado.tabela2.ibsAPagar)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#f2f4ee] font-medium text-gray-900 border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="px-3 py-3 sm:px-6 sm:py-4 text-right">Carga Tributária Efetiva: <strong>{(resultado.tabela2.aliquotaEfetiva * 100).toFixed(2)}%</strong></td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 font-bold text-[#1f2919]">{brl(resultado.tabela2.totalAPagar)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="pt-8 space-y-6">
              <h3 className="text-2xl font-display font-bold text-amber-600 text-center">Resumo das alíquotas</h3>
              <div className="rounded-2xl overflow-x-auto border border-[#1f2919]/10 shadow-sm">
                <table className="w-full min-w-[520px] text-sm text-center">
                  <thead className="bg-[#161c12] text-white">
                    <tr>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Regime de Transição</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Alíquotas</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Comparativo 27%</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Comparativo 28%</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-medium">Comparativo 29%</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {resultado.tabela3.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-900">{item.nome}</td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-500">{(item.aliquotas * 100).toFixed(2)}%</td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-500">{(item.comparativo27 * 100).toFixed(2)}%</td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-500">{(item.comparativo28 * 100).toFixed(2)}%</td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-500">{(item.comparativo29 * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#f2f4ee] font-medium text-gray-900">
                    <tr>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">Total</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">{(resultado.tabela3Total.aliquotas * 100).toFixed(2)}%</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">{(resultado.tabela3Total.comparativo27 * 100).toFixed(2)}%</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">{(resultado.tabela3Total.comparativo28 * 100).toFixed(2)}%</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">{(resultado.tabela3Total.comparativo29 * 100).toFixed(2)}%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
              <button className="px-6 py-3 bg-[#1f2919] text-white rounded-full font-medium hover:bg-[#293622] transition-colors shadow-sm text-sm">
                Refazer ↺
              </button>
              <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors shadow-sm text-sm">
                Novo +
              </button>
              <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors shadow-sm text-sm">
                Salvar ⤓
              </button>
              <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors shadow-sm text-sm">
                PDF 🖨
              </button>
            </div>
            <div className="h-20"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
