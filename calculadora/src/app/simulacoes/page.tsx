import Link from "next/link";
import { FileText, Plus, Search } from "lucide-react";
import { StatusSimulacao, TipoObra, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { brl, num } from "@/lib/calc/calculos";
import { DeleteSimulationButton } from "@/components/delete-simulation-button";
import { STATUS_LABELS, StatusSelect } from "@/components/status-select";

const PAGE_SIZE = 20;

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

function dataCurta(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function SimulacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; uf?: string; responsavel?: string; status?: string; tipo?: string; de?: string; ate?: string; pagina?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const uf = params.uf?.trim().toUpperCase() ?? "";
  const responsavel = params.responsavel === "PF" || params.responsavel === "PJ" ? params.responsavel : "";
  const status = Object.values(StatusSimulacao).includes(params.status as StatusSimulacao) ? params.status as StatusSimulacao : undefined;
  const tipo = Object.values(TipoObra).includes(params.tipo as TipoObra) ? params.tipo as TipoObra : undefined;
  const pagina = Math.max(1, Number.parseInt(params.pagina ?? "1", 10) || 1);
  const de = params.de && !Number.isNaN(Date.parse(params.de)) ? new Date(`${params.de}T00:00:00`) : undefined;
  const ate = params.ate && !Number.isNaN(Date.parse(params.ate)) ? new Date(`${params.ate}T23:59:59.999`) : undefined;
  const where: Prisma.SimulacaoWhereInput = {
    ...(q
      ? {
          OR: [
            { nomeCliente: { contains: q, mode: "insensitive" } },
            { telefone: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(uf ? { uf } : {}),
    ...(responsavel ? { responsavel } : {}),
    ...(status ? { status } : {}),
    ...(tipo ? { tipoObra: tipo } : {}),
    ...(de || ate ? { createdAt: { ...(de ? { gte: de } : {}), ...(ate ? { lte: ate } : {}) } } : {}),
  };

  const umMesFrente = new Date();
  umMesFrente.setMonth(umMesFrente.getMonth() + 1);

  const [simulacoes, total, totais, monitoramentosPendentes] = await Promise.all([
    prisma.simulacao.findMany({ where, orderBy: { createdAt: "desc" }, skip: (pagina - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.simulacao.count({ where }),
    prisma.simulacao.aggregate({ where, _sum: { inssDevido: true, economiaLiquida: true, honorarios: true } }),
    prisma.simulacao.findMany({ 
      where: { status: StatusSimulacao.MONITORAMENTO_CNO, dataAlertaMonitoramento: { lte: umMesFrente } },
      orderBy: { dataAlertaMonitoramento: "asc" }
    })
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const query = new URLSearchParams(Object.entries(params).filter(([key, value]) => key !== "pagina" && value) as [string, string][]);
  const paginaHref = (p: number) => `/simulacoes?${new URLSearchParams([...query.entries(), ["pagina", String(p)]]).toString()}`;

  return (
    <main className="min-h-screen bg-paper px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] text-graphite-900 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold tracking-widest text-gold uppercase">CIFRA</p>
            <h1 className="text-2xl font-black">Simulações salvas</h1>
            <p className="mt-1 text-sm text-graphite-500">
              Consulta interna dos clientes e cálculos gravados no banco.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-graphite-200 bg-graphite-100 px-4 py-2 text-sm font-bold text-graphite-900 hover:bg-graphite-200"
          >
            <Plus className="size-4" />
            Nova simulação
          </Link>
        </header>

        {monitoramentosPendentes.length > 0 && (
          <section className="mb-6 rounded-xl border border-pine-200 bg-sage-50 p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black tracking-wide text-pine-900 uppercase">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-pine-500"></span>
              </span>
              Alertas de Monitoramento CNO
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {monitoramentosPendentes.map((m) => {
                const hoje = new Date();
                const alerta = m.dataAlertaMonitoramento!;
                const isAtrasado = alerta < hoje;
                return (
                  <Link href={`/simulacoes/${m.id}`} key={m.id} className="flex flex-col gap-1 rounded-lg border border-pine-200 bg-white p-3 hover:border-pine-400">
                    <p className="font-bold text-pine-900">{m.nomeCliente}</p>
                    <p className="text-xs text-graphite-500">{m.telefone || "Sem telefone"}</p>
                    <p className={`mt-2 text-xs font-bold ${isAtrasado ? "text-red-600" : "text-pine-600"}`}>
                      {isAtrasado ? "Atrasado desde" : "Agendado para"}: {dataCurta(alerta).split(" ")[0]}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <form className="mb-4 grid gap-3 rounded-xl border border-graphite-200 bg-white/70 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-bold tracking-wide text-graphite-500 uppercase">
            Buscar
            <input
              name="q"
              defaultValue={q}
              placeholder="Cliente, telefone ou e-mail"
              className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm font-medium text-graphite-900 outline-none focus:border-olive-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold tracking-wide text-graphite-500 uppercase">Status
            <select name="status" defaultValue={status ?? ""} className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm font-medium text-graphite-900">
              <option value="">Todos</option>{Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold tracking-wide text-graphite-500 uppercase">Tipo
            <select name="tipo" defaultValue={tipo ?? ""} className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm font-medium text-graphite-900">
              <option value="">Todos</option>{Object.entries(tipoLabel).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold tracking-wide text-graphite-500 uppercase">De
            <input type="date" name="de" defaultValue={params.de ?? ""} className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-900" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold tracking-wide text-graphite-500 uppercase">Até
            <input type="date" name="ate" defaultValue={params.ate ?? ""} className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-900" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold tracking-wide text-graphite-500 uppercase">
            UF
            <input
              name="uf"
              defaultValue={uf}
              maxLength={2}
              placeholder="SP"
              className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm font-medium text-graphite-900 uppercase outline-none focus:border-olive-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold tracking-wide text-graphite-500 uppercase">
            Responsável
            <select
              name="responsavel"
              defaultValue={responsavel}
              className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm font-medium text-graphite-900 outline-none focus:border-olive-400"
            >
              <option value="">Todos</option>
              <option value="PF">PF</option>
              <option value="PJ">PJ</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-olive-500 px-4 text-sm font-bold text-white hover:bg-olive-400">
              <Search className="size-4" />
              Filtrar
            </button>
            <Link
              href="/simulacoes"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-graphite-200 px-4 text-sm font-bold text-graphite-300 hover:bg-graphite-200"
            >
              Limpar
            </Link>
          </div>
        </form>

        <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-graphite-200 bg-white/70 p-4">
            <p className="text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Registros</p>
            <p className="mt-1 text-xl font-black">{total}</p>
          </div>
          <div className="rounded-xl border border-graphite-200 bg-white/70 p-4">
            <p className="text-[10px] font-bold tracking-wide text-graphite-500 uppercase">INSS devido</p>
            <p className="mt-1 text-xl font-black">{brl(totais._sum.inssDevido ?? 0)}</p>
          </div>
          <div className="rounded-xl border border-graphite-200 bg-white/70 p-4">
            <p className="text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Economia líquida</p>
            <p className="mt-1 text-xl font-black text-pine-600">{brl(totais._sum.economiaLiquida ?? 0)}</p>
          </div>
          <div className="rounded-xl border border-graphite-200 bg-white/70 p-4">
            <p className="text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Honorários</p>
            <p className="mt-1 text-xl font-black text-gold">{brl(totais._sum.honorarios ?? 0)}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-graphite-200 bg-white/70 shadow">
          {simulacoes.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center text-graphite-500">
              <Search className="size-10 text-olive-400" />
              <h2 className="text-base font-bold text-graphite-900">Nenhuma simulação salva</h2>
              <p className="max-w-md text-sm">
                Preencha a calculadora e clique em Salvar Simulação para criar o primeiro registro.
              </p>
            </div>
          ) : (
            <>
            {/* Celular: um cartão por simulação (a tabela de 8 colunas só se lia arrastando) */}
            <ul className="divide-y divide-graphite-200 md:hidden">
              {simulacoes.map((s) => (
                <li key={s.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold">{s.nomeCliente}</p>
                      <p className="text-xs text-graphite-500">
                        {s.responsavel} · {s.uf} · {num(s.areaTotal)} m²
                      </p>
                      <p className="text-xs text-graphite-500">{tipoLabel[s.tipoObra] ?? s.tipoObra}</p>
                    </div>
                    <p className="shrink-0 text-[11px] text-graphite-500">{dataCurta(s.createdAt).split(" ")[0]}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-graphite-100 px-3 py-2">
                      <p className="text-[10px] font-bold tracking-wide text-graphite-500 uppercase">INSS devido</p>
                      <p className="text-sm font-bold tabular-nums">{brl(s.inssDevido)}</p>
                    </div>
                    <div className="rounded-lg bg-sage-50 px-3 py-2">
                      <p className="text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Economia</p>
                      <p className="text-sm font-bold tabular-nums text-pine-600">{brl(s.economiaLiquida)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <StatusSelect id={s.id} status={s.status} />
                      <p className="mt-1 text-[10px] text-graphite-500">versão {s.versao} · {s.telefone || "sem telefone"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/simulacoes/${s.id}`}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-olive-500 px-3 text-xs font-bold text-white hover:bg-olive-400"
                      >
                        <FileText className="size-3.5" />
                        Abrir
                      </Link>
                      <DeleteSimulationButton id={s.id} cliente={s.nomeCliente} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-graphite-200 bg-graphite-100 text-left text-[11px] font-bold tracking-wide text-graphite-500 uppercase">
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Contato</th>
                    <th className="px-4 py-3">Obra</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">INSS devido</th>
                    <th className="px-4 py-3">Economia líquida</th>
                    <th className="px-4 py-3">Criado em</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {simulacoes.map((s) => (
                    <tr key={s.id} className="border-b border-graphite-200 last:border-none hover:bg-white/[0.03]">
                      <td className="px-4 py-3">
                        <p className="font-bold">{s.nomeCliente}</p>
                        <p className="text-xs text-graphite-500">{s.responsavel}</p>
                      </td>
                      <td className="px-4 py-3"><StatusSelect id={s.id} status={s.status} /><p className="mt-1 text-[10px] text-graphite-500">versão {s.versao}</p></td>
                      <td className="px-4 py-3 text-xs text-graphite-300">
                        <p>{s.telefone || "Sem telefone"}</p>
                        <p>{s.email || "Sem e-mail"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{tipoLabel[s.tipoObra] ?? s.tipoObra}</p>
                        <p className="text-xs text-graphite-500">{s.uf} · {num(s.areaTotal)} m²</p>
                      </td>
                      <td className="px-4 py-3 font-bold">{brl(s.inssDevido)}</td>
                      <td className="px-4 py-3 font-bold text-pine-600">{brl(s.economiaLiquida)}</td>
                      <td className="px-4 py-3 text-xs text-graphite-300">{dataCurta(s.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/simulacoes/${s.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-olive-500 px-3 py-2 text-xs font-bold text-white hover:bg-olive-400"
                          >
                            <FileText className="size-3.5" />
                            Abrir
                          </Link>
                          <DeleteSimulationButton id={s.id} cliente={s.nomeCliente} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </section>
        {totalPaginas > 1 && <nav className="mt-4 flex items-center justify-between text-sm">
          <Link aria-disabled={pagina <= 1} href={paginaHref(Math.max(1, pagina - 1))} className={`rounded-lg border border-graphite-200 px-4 py-2 font-bold ${pagina <= 1 ? "pointer-events-none opacity-40" : "hover:bg-graphite-200"}`}>Anterior</Link>
          <span className="text-graphite-300">Página {pagina} de {totalPaginas}</span>
          <Link aria-disabled={pagina >= totalPaginas} href={paginaHref(Math.min(totalPaginas, pagina + 1))} className={`rounded-lg border border-graphite-200 px-4 py-2 font-bold ${pagina >= totalPaginas ? "pointer-events-none opacity-40" : "hover:bg-graphite-200"}`}>Próxima</Link>
        </nav>}
      </div>
    </main>
  );
}
