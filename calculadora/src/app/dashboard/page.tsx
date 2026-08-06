import { cookies } from "next/headers";
import { getSessionUser, AUTH_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import Link from "next/link";
import { SlidersHorizontal, FileText, TrendingDown, Users, Calculator } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const username = await getSessionUser(token) || "USUÁRIO";

  const totalSimulacoes = await prisma.simulacao.count();
  const todasSimulacoes = await prisma.simulacao.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      nomeCliente: true,
      inssBruto: true,
      inssDevido: true,
      economiaLiquida: true,
      createdAt: true
    }
  });

  const economiaTotal = todasSimulacoes.reduce((acc, s) => acc + s.economiaLiquida, 0);
  const inssDevidoTotal = todasSimulacoes.reduce((acc, s) => acc + s.inssDevido, 0);
  const clientesUnicos = new Set(todasSimulacoes.map(s => s.nomeCliente)).size;

  const dataReducao = [
    { name: "INSS Devido (Pago)", value: inssDevidoTotal },
    { name: "Economia Gerada", value: economiaTotal },
  ];

  const clientesMap = new Map<string, { totalINSS: number, economia: number }>();
  todasSimulacoes.forEach(s => {
    const prev = clientesMap.get(s.nomeCliente) || { totalINSS: 0, economia: 0 };
    clientesMap.set(s.nomeCliente, {
      totalINSS: prev.totalINSS + s.inssDevido,
      economia: prev.economia + s.economiaLiquida
    });
  });
  const dataClientes = Array.from(clientesMap.entries())
    .map(([name, vals]) => ({ name, ...vals }))
    .sort((a, b) => b.totalINSS - a.totalINSS)
    .slice(0, 5);

  const tempoMap = new Map<string, { inssBruto: number, inssDevido: number }>();
  todasSimulacoes.forEach(s => {
    const mesAno = `${String(s.createdAt.getMonth() + 1).padStart(2, '0')}/${s.createdAt.getFullYear()}`;
    const prev = tempoMap.get(mesAno) || { inssBruto: 0, inssDevido: 0 };
    tempoMap.set(mesAno, {
      inssBruto: prev.inssBruto + s.inssBruto,
      inssDevido: prev.inssDevido + s.inssDevido
    });
  });
  const dataTempo = Array.from(tempoMap.entries()).map(([name, vals]) => ({ name, ...vals }));

  const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const firstInitial = username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5f5ef]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* Welcome Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4a6b5a]">Painel de controle</p>
            <h1 className="mt-0.5 text-xl font-bold text-[#1b3629]">
              Olá, {username.split("@")[0].charAt(0).toUpperCase() + username.split("@")[0].slice(1)}
            </h1>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b3629] text-sm font-bold text-white shadow-md">
            {firstInitial}
          </div>
        </div>

        {/* KPI Strip */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#d8dbd1] bg-white/70 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">Simulações</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef0eb]">
                <FileText className="size-4 text-[#1b3629]" />
              </div>
            </div>
            <p className="text-3xl font-black tracking-tight text-[#1b3629]">{totalSimulacoes}</p>
            <p className="mt-1 text-xs text-[#6b7a70]">memórias de cálculo geradas</p>
          </div>

          <div className="rounded-2xl border border-[#d8dbd1] bg-white/70 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">Economia Total</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef0eb]">
                <TrendingDown className="size-4 text-[#1b3629]" />
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight text-[#1b3629]">{brl(economiaTotal)}</p>
            <p className="mt-1 text-xs text-[#6b7a70]">economia líquida gerada aos clientes</p>
          </div>

          <div className="rounded-2xl border border-[#d8dbd1] bg-white/70 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">Clientes</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef0eb]">
                <Users className="size-4 text-[#1b3629]" />
              </div>
            </div>
            <p className="text-3xl font-black tracking-tight text-[#1b3629]">{clientesUnicos}</p>
            <p className="mt-1 text-xs text-[#6b7a70]">clientes únicos no sistema</p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/simulador-obra-predial", icon: SlidersHorizontal, label: "Simulador INSS" },
            { href: "/calculadora-reducao-irpf", icon: Calculator, label: "Redução IRPF" },
            { href: "/simulacoes", icon: FileText, label: "Simulações salvas" },
            { href: "/simulador-reforma-tributaria", icon: TrendingDown, label: "Reforma Tributária" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#d8dbd1] bg-white/60 p-4 text-center text-xs font-semibold text-[#1b3629] transition-all hover:border-[#1b3629]/30 hover:bg-white hover:shadow-sm"
            >
              <Icon className="size-5 text-[#2e5240]" />
              {label}
            </Link>
          ))}
        </div>

        {/* Charts */}
        <div className="rounded-2xl border border-[#d8dbd1] bg-white/70 p-6 backdrop-blur-sm">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">Análise de Simulações</p>
          <DashboardCharts dataClientes={dataClientes} dataReducao={dataReducao} dataTempo={dataTempo} />
        </div>

        <p className="mt-6 text-center text-[11px] text-[#8a9890]">
          Métricas consolidadas com base nas {totalSimulacoes} simulações salvas no sistema.
        </p>
      </div>
    </div>
  );
}
