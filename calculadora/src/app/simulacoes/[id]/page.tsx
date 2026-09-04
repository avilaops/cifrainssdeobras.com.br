import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { brl, num } from "@/lib/calc/calculos";
import { PrintButton } from "@/components/print-button";
import { STATUS_LABELS, StatusSelect } from "@/components/status-select";
import { PdfButton } from "@/components/pdf-button";
import { BotaoMonitoramento } from "@/components/botao-monitoramento";

const tipoLabel: Record<string, string> = {
  RESIDENCIAL: "Residencial unifamiliar",
  MULTIFAMILIAR: "Residencial multifamiliar",
  COMERCIAL: "Comercial / escritório",
  INDUSTRIAL: "Industrial / galpão",
  REFORMA: "Reforma",
  DEMOLICAO: "Demolição",
  PISCINA: "Piscina",
  MISTA: "Mista",
  PAVIMENTACAO: "Pavimentação asfáltica",
  TERRAPLENAGEM: "Terraplenagem / dragagem",
  OBRA_ARTE: "Obra de arte especial",
  DRENAGEM: "Drenagem",
  NAO_PREDIAL: "Não predial - demais serviços",
};

function data(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "UTC" }).format(d);
}

function dataHora(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
}

function mesesEntre(d1: Date, d2: Date) {
  return (d2.getUTCFullYear() - d1.getUTCFullYear()) * 12 + (d2.getUTCMonth() - d1.getUTCMonth());
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <tr className="border-b border-graphite-100 last:border-none">
      <td className="py-2 pr-3 text-graphite-500">{label}</td>
      <td className={`whitespace-nowrap py-2 text-right tabular-nums ${strong ? "font-black text-pine-950" : "font-bold text-graphite-900"}`}>
        {value}
      </td>
    </tr>
  );
}

export default async function SimulacaoRelatorioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await prisma.simulacao.findUnique({
    where: { id },
    include: {
      versaoAnterior: { select: { id: true, versao: true, createdAt: true } },
      revisoes: { select: { id: true, versao: true, createdAt: true }, orderBy: { versao: "asc" } },
      auditorias: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!s) notFound();

  return (
    <main className="min-h-screen bg-cream px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] text-graphite-900 print:bg-white print:px-0 print:py-0 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/simulacoes" className="inline-flex items-center gap-2 text-sm font-bold text-pine-700">
            <ArrowLeft className="size-4" />
            Voltar para simulações
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/simulacoes/${id}/editar`} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-graphite-900"><Pencil className="size-4"/> Revisar</Link>
            <PdfButton id={id} />
            <PrintButton />
          </div>
        </div>

        <article className="rounded-xl bg-white p-5 shadow-xl print:rounded-none print:p-6 print:shadow-none sm:p-8">
          <header className="mb-8 flex flex-col gap-4 border-b border-graphite-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-black tracking-[0.28em] text-gold uppercase">CIFRA</p>
              <h1 className="text-2xl font-black text-pine-950">Relatório de Simulação de INSS de Obra</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite-500">
                Relatório interno gerado a partir dos dados informados na calculadora. Os valores são estimativos e
                devem ser conferidos no SERO/e-CAC antes de qualquer recolhimento.
              </p>
            </div>
            <div className="rounded-lg border border-graphite-100 p-3 text-xs sm:text-right">
              <p className="text-graphite-500">Código</p>
              <p className="font-mono font-bold text-pine-950">{s.id.slice(0, 12)}</p>
              <p className="mt-2 text-graphite-500">Gerado em</p>
              <p className="font-bold text-pine-950">{dataHora(s.createdAt)}</p>
              <p className="mt-2 text-graphite-500">Status / versão</p>
              <p className="font-bold text-pine-950">{STATUS_LABELS[s.status]} · v{s.versao}</p>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-graphite-100 p-4">
              <p className="text-xs font-bold tracking-wide text-graphite-500 uppercase">Cliente</p>
              <p className="mt-1 text-lg font-black text-pine-950">{s.nomeCliente}</p>
              <p className="mt-1 text-sm text-graphite-500">{s.telefone || "Telefone não informado"}</p>
              <p className="text-sm text-graphite-500">{s.email || "E-mail não informado"}</p>
            </div>
            <div className="rounded-lg border border-graphite-100 p-4">
              <p className="text-xs font-bold tracking-wide text-graphite-500 uppercase">Obra</p>
              <p className="mt-1 text-lg font-black text-pine-950">{tipoLabel[s.tipoObra] ?? s.tipoObra}</p>
              <p className="mt-1 text-sm text-graphite-500">{s.uf} · {s.responsavel}</p>
              <p className="text-sm text-graphite-500">{data(s.dataInicio)} a {data(s.dataFim)}</p>
            </div>
            <div className="rounded-lg border border-olive-400 bg-sage-50 p-4">
              <p className="text-xs font-bold tracking-wide text-olive-500 uppercase">Economia líquida estimada</p>
              <p className="mt-1 text-2xl font-black text-pine-950">{brl(s.economiaLiquida)}</p>
              <p className="mt-1 text-sm text-graphite-500">Após honorários de {brl(s.honorarios)}</p>
            </div>
          </section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 print:hidden">
            <div className="rounded-lg border border-graphite-100 p-4">
              <p className="mb-2 text-xs font-bold tracking-wide text-graphite-500 uppercase">Andamento</p>
              <StatusSelect id={s.id} status={s.status} />
              {s.status === "CONCLUIDO" && !s.dataAlertaMonitoramento && (
                <BotaoMonitoramento id={s.id} />
              )}
              {s.dataAlertaMonitoramento && (
                <div className="mt-3 rounded border border-olive-200 bg-sage-50 p-2 text-center text-xs text-pine-900">
                  Monitoramento agendado: <br />
                  <strong className="font-bold">{data(s.dataAlertaMonitoramento)}</strong>
                </div>
              )}
            </div>
            <div className="rounded-lg border border-graphite-100 p-4 text-xs text-graphite-500">
              <p className="font-bold uppercase">Rastreabilidade do cálculo</p>
              <p className="mt-2">Motor: {s.versaoCalculo} · Fonte: {s.fonteParametros}</p>
              <p>Competência VAU: {s.competenciaVau || "não informada"} · Operador: {s.criadoPor}</p>
            </div>
          </section>

          <section className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-sm font-black tracking-wide text-pine-950 uppercase">Dados utilizados</h2>
              <table className="w-full text-sm">
                <tbody>
                  <Row label="Área construção" value={`${num(s.areaConstrucao)} m²`} />
                  <Row label="Área reforma" value={`${num(s.areaReforma)} m²`} />
                  <Row label="Área demolição" value={`${num(s.areaDemolicao)} m²`} />
                  <Row label="Área piscina" value={`${num(s.areaPiscina)} m²`} />
                  <Row label="Área total aferida" value={`${num(s.areaTotal)} m²`} strong />
                  <Row label="Concreto usinado" value={s.concretoUsinado ? "Sim" : "Não"} />
                  <Row label="VAU usado" value={`R$ ${num(s.vauUsado, 0)}/m²`} />
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-black tracking-wide text-pine-950 uppercase">Resultado tributário</h2>
              <table className="w-full text-sm">
                <tbody>
                  <Row label="COD total" value={brl(s.codTotal)} />
                  <Row label="RMT total" value={brl(s.rmtTotal)} />
                  <Row label="Fator social" value={`${num(s.fatorSocial, 2)} (${Math.round(s.fatorSocial * 100)}%)`} />
                  <Row label="INSS bruto" value={brl(s.inssBruto)} />
                  <Row label="INSS devido" value={brl(s.inssDevido)} strong />
                  <Row label="Fator de ajuste" value={s.podeFatorAjuste ? `Aplicável (${num(s.reducaoPercent, 1)}%)` : "Não aplicável"} />
                  <Row label="INSS com planejamento" value={brl(s.inssComReducao)} strong />
                  {Math.max(0, mesesEntre(s.dataInicio, s.createdAt)) > 0 && s.podeFatorAjuste && <Row label="Multa MAED (Atraso DCTFWeb)" value={brl(Math.max(0, mesesEntre(s.dataInicio, s.createdAt)) * 100)} />}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-graphite-100 p-4">
              <p className="text-xs font-bold tracking-wide text-graphite-500 uppercase">Economia em imposto</p>
              <p className="mt-1 text-xl font-black text-pine-950">{brl(s.economiaImposto)}</p>
            </div>
            <div className="rounded-lg border border-graphite-100 p-4">
              <p className="text-xs font-bold tracking-wide text-graphite-500 uppercase">Retroativo</p>
              <p className="mt-1 text-xl font-black text-pine-950">{brl(s.retroativo)}</p>
            </div>
            <div className="rounded-lg border border-graphite-100 p-4">
              <p className="text-xs font-bold tracking-wide text-graphite-500 uppercase">Futuro</p>
              <p className="mt-1 text-xl font-black text-pine-950">{brl(s.futuro)}</p>
              <p className="mt-1 text-xs text-graphite-500">{s.mesesFuturos} parcelas de {brl(s.parcelaMensal)}</p>
            </div>
          </section>

          <section className="mb-6 rounded-lg border border-graphite-100 p-4">
            <h2 className="text-xs font-black uppercase text-pine-950">Parcelamento do INSS (e-CAC / Receita Federal — Lei 10.522/02)</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
              {s.podeFatorAjuste && (
                <div className="rounded border border-olive-200 bg-sage-50 p-3">
                  <p className="font-bold text-pine-900">Com Fator de Ajuste (Planejamento)</p>
                  <p className="mt-1 text-base font-black text-pine-950">
                    {Math.min(60, Math.max(1, Math.floor(s.inssComReducao / (s.responsavel === "PF" ? 100 : 500))))}x de {brl(s.inssComReducao / Math.min(60, Math.max(1, Math.floor(s.inssComReducao / (s.responsavel === "PF" ? 100 : 500)))))} / mês
                  </p>
                </div>
              )}
              <div className="rounded border border-red-200 bg-red-50/60 p-3">
                <p className="font-bold text-red-900">Sem Planejamento (Aferição Indireta)</p>
                <p className="mt-1 text-base font-black text-red-950">
                  {Math.min(60, Math.max(1, Math.floor(s.inssDevido / (s.responsavel === "PF" ? 100 : 500))))}x de {brl(s.inssDevido / Math.min(60, Math.max(1, Math.floor(s.inssDevido / (s.responsavel === "PF" ? 100 : 500)))))} / mês
                </p>
              </div>
            </div>
          </section>

          {/* ── Memória de Cálculo Mensal (SELIC + CPP + Multa + RMT) ── */}
          <section className="mb-6 rounded-lg border border-graphite-100 p-4 overflow-x-auto">
            <h2 className="mb-3 text-xs font-black uppercase text-pine-950 tracking-wider">
              Memória de Cálculo Mensal (SERO / Receita Federal — SELIC & Encargos)
            </h2>
            <table className="w-full min-w-[640px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-graphite-200 bg-graphite-50 text-[11px] font-bold uppercase tracking-wider text-graphite-700">
                  <th className="py-2.5 px-3">Mês/Ano</th>
                  <th className="py-2.5 px-3 text-right">REMUNERAÇÃO ATUALIZADA</th>
                  <th className="py-2.5 px-3 text-right">REMUNERAÇÃO ORIGINAL</th>
                  <th className="py-2.5 px-3 text-right">CPP de 20%</th>
                  <th className="py-2.5 px-3 text-right">MULTA de 20%</th>
                  <th className="py-2.5 px-3 text-right">SELIC ACUMULADA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-100">
                {(() => {
                  const mCount = Math.max(1, mesesEntre(s.dataInicio, s.dataFim));
                  const rmtMes = s.rmtTotal / mCount;
                  const dInicio = new Date(s.dataInicio);
                  const dFim = new Date(s.dataFim);
                  const rows = [];
                  const curr = new Date(dInicio);
                  
                  // Tabela SELIC de referência
                  const selicRef: Record<string, number> = {
                    "03/2024": 28.01, "04/2024": 27.18, "05/2024": 26.39, "06/2024": 25.48,
                    "07/2024": 24.61, "08/2024": 23.77, "09/2024": 22.84, "10/2024": 22.05,
                    "11/2024": 21.12, "12/2024": 20.11, "01/2025": 19.12, "02/2025": 18.16,
                  };

                  while (curr <= dFim) {
                    const comp = `${String(curr.getUTCMonth() + 1).padStart(2, "0")}/${curr.getUTCFullYear()}`;
                    const selic = selicRef[comp] ?? Math.max(1, (2026 - curr.getUTCFullYear()) * 10 + (12 - curr.getUTCMonth()));
                    const cpp = rmtMes * 0.20;
                    const multa = cpp * 0.20;
                    rows.push(
                      <tr key={comp} className="hover:bg-graphite-50/50">
                        <td className="py-2 px-3 font-semibold text-graphite-900">{comp}</td>
                        <td className="py-2 px-3 text-right font-medium">{brl(rmtMes)}</td>
                        <td className="py-2 px-3 text-right font-medium text-graphite-600">{brl(rmtMes * 0.78)}</td>
                        <td className="py-2 px-3 text-right font-bold text-pine-900">{brl(cpp)}</td>
                        <td className="py-2 px-3 text-right font-medium text-amber-800">{brl(multa)}</td>
                        <td className="py-2 px-3 text-right font-bold text-gold-600">{selic.toFixed(2)}%</td>
                      </tr>
                    );
                    curr.setMonth(curr.getMonth() + 1);
                  }
                  return rows;
                })()}
              </tbody>
            </table>
          </section>

          <footer className="border-t border-graphite-100 pt-4 text-xs leading-relaxed text-graphite-500">
            Este relatório não substitui a aferição oficial da Receita Federal. O cálculo definitivo deve considerar
            documentos, escrituração, notas fiscais, recolhimentos aproveitáveis, CNO e transmissão mensal da DCTFWeb
            quando aplicável.
          </footer>

          {(s.observacoes || s.versaoAnterior || s.revisoes.length > 0 || s.auditorias.length > 0) && <section className="mt-6 grid gap-5 border-t border-graphite-100 pt-5 print:hidden md:grid-cols-2">
            <div><h2 className="text-xs font-black uppercase text-pine-950">Versões e observações</h2>{s.observacoes && <p className="mt-2 whitespace-pre-wrap text-sm text-graphite-600">{s.observacoes}</p>}<div className="mt-3 flex flex-wrap gap-2">{s.versaoAnterior && <Link className="rounded bg-sage-50 px-2 py-1 text-xs font-bold text-pine-800" href={`/simulacoes/${s.versaoAnterior.id}`}>Versão {s.versaoAnterior.versao}</Link>}{s.revisoes.map(v => <Link key={v.id} className="rounded bg-sage-50 px-2 py-1 text-xs font-bold text-pine-800" href={`/simulacoes/${v.id}`}>Versão {v.versao}</Link>)}</div></div>
            <div><h2 className="text-xs font-black uppercase text-pine-950">Auditoria</h2><ul className="mt-2 space-y-2">{s.auditorias.map(a => <li key={a.id} className="text-xs text-graphite-600"><strong>{a.tipo.replaceAll("_", " ")}</strong> · {dataHora(a.createdAt)} · {a.usuario}<br/>{a.detalhes}</li>)}</ul></div>
          </section>}
        </article>
      </div>
    </main>
  );
}
