import Link from "next/link";
import {
  Building2, Scale, Calculator, ArrowRight, Plus,
  Clock, MoreHorizontal, Lock, FileText, Users,
} from "lucide-react";
import { cookies } from "next/headers";
import { getSessionUser, AUTH_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── Quick actions ────────────────────────────────────────────────────────

const PRIMARY_ACTION = {
  label: "Nova simulação de obra",
  description: "Aferição de INSS com fator de ajuste e planejamento DCTFWeb",
  href: "/simulador-obra-predial",
  icon: Building2,
  available: true,
};

const SECONDARY_ACTIONS = [
  {
    label: "Desconto IRPF",
    description: "Redução pela Lei 15.270/2025",
    href: "/calculadora-reducao-irpf",
    icon: Calculator,
    available: true,
  },
  {
    label: "Reforma Tributária",
    description: "Simulador IBS/CBS",
    href: "/simulador-reforma-tributaria",
    icon: Scale,
    available: true,
  },
  {
    label: "Gerar proposta",
    description: "Disponível em breve",
    href: "/em-breve/proposta-servicos",
    icon: FileText,
    available: false,
  },
  {
    label: "Consultar cliente",
    description: "Disponível em breve",
    href: "/em-breve/clientes",
    icon: Users,
    available: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function InicioPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const username = await getSessionUser(token) || "Usuário";
  const firstName = username.split("@")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const agora = new Date();
  const hour = agora.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const ultimasSimulacoes = await prisma.simulacao.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      nomeCliente: true,
      economiaLiquida: true,
      inssBruto: true,
      createdAt: true,
      tipoObra: true,
      areaConstrucao: true,
    },
  });

  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const relativeDate = (date: Date) => {
    const diff = Math.floor((agora.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return "agora";
    if (diff < 60) return `${diff}min atrás`;
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}h atrás`;
    if (diff < 60 * 24 * 30) return `${Math.floor(diff / 60 / 24)}d atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef]">
      <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8 lg:py-10">

        {/* ── Greeting ───────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4a6b5a]">
            {greeting}, {displayName}
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#1b3629]">
            O que você deseja fazer hoje?
          </h1>
        </div>

        {/* ── Quick Actions ───────────────────── */}
        <section className="mb-10">

          {/* Primary action — visually dominant */}
          <Link
            href={PRIMARY_ACTION.href}
            className="group mb-3 flex items-center gap-4 rounded-xl border-2 border-[#2e5240]/20 bg-white p-5 shadow-sm transition-all hover:border-[#2e5240]/40 hover:shadow-md"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1b3629] shadow-sm">
              <Building2 className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-[#1b3629]">{PRIMARY_ACTION.label}</p>
              <p className="mt-0.5 text-xs text-[#6b7a70]">{PRIMARY_ACTION.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-lg bg-[#1b3629] px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[#2e5240] sm:block">
                Iniciar
              </span>
              <ArrowRight className="size-5 text-[#4a6b5a] transition group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Secondary actions — 2×2 grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SECONDARY_ACTIONS.map(({ label, description, href, icon: Icon, available }) => (
              <Link
                key={href}
                href={href}
                className={`group flex items-start gap-3.5 rounded-xl border p-4 transition-all ${
                  available
                    ? "border-[#d8dbd1] bg-white hover:border-[#1b3629]/20 hover:shadow-sm"
                    : "border-[#e8eae3] bg-[#f9faf7] opacity-55 hover:opacity-70"
                }`}
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                    available ? "bg-[#eef0eb]" : "bg-[#f0f1ec]"
                  }`}
                >
                  {available
                    ? <Icon className="size-4 text-[#1b3629]" />
                    : <Lock className="size-3.5 text-[#a0ada5]" />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${available ? "text-[#1b3629]" : "text-[#8a9890]"}`}>
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8a9890]">{description}</p>
                </div>
                {available && (
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-[#c5cdb8] transition group-hover:translate-x-0.5 group-hover:text-[#4a6b5a]" />
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Recent simulations ──────────────── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
              Últimas simulações
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-[#d8dbd1] to-transparent" />
            <Link
              href="/simulacoes"
              className="flex items-center gap-1 text-[10px] font-semibold text-[#4a6b5a] transition hover:text-[#1b3629]"
            >
              Ver todas <ArrowRight className="size-3" />
            </Link>
          </div>

          {ultimasSimulacoes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[#d8dbd1] bg-white py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl border border-[#d8dbd1] bg-[#eef0eb]">
                <Building2 className="size-5 text-[#4a6b5a]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1b3629]">Nenhuma simulação salva ainda</p>
                <p className="mt-0.5 text-xs text-[#8a9890]">
                  Suas simulações aparecerão aqui após salvar.
                </p>
              </div>
              <Link
                href="/simulador-obra-predial"
                className="mt-1 flex items-center gap-1.5 rounded-lg bg-[#1b3629] px-4 py-2 text-xs font-bold text-white hover:bg-[#2e5240]"
              >
                <Plus className="size-3.5" />
                Nova simulação
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#d8dbd1] bg-white">
              {ultimasSimulacoes.map((sim, idx) => (
                <div
                  key={sim.id}
                  className={`group flex items-center gap-4 px-5 py-4 transition hover:bg-[#f9faf7] ${
                    idx !== ultimasSimulacoes.length - 1 ? "border-b border-[#f0f1ec]" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eef0eb]">
                    <Building2 className="size-4 text-[#2e5240]" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1b3629]">
                      {sim.nomeCliente || "Cliente não informado"}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      {sim.tipoObra && (
                        <span className="text-[10px] font-medium text-[#6b7a70]">
                          {sim.tipoObra}{sim.areaConstrucao ? ` · ${sim.areaConstrucao} m²` : ""}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-[10px] text-[#a0ada5]">
                        <Clock className="size-2.5" />
                        {relativeDate(sim.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Economy */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-[#2e5240]">
                      {brl(sim.economiaLiquida)}
                    </p>
                    <p className="text-[9px] text-[#a0ada5]">economia líquida</p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                    <Link
                      href={`/simulacoes/${sim.id}`}
                      className="flex items-center gap-1 rounded-md bg-[#1b3629] px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-[#2e5240]"
                    >
                      Abrir
                    </Link>
                    <Link
                      href={`/simulacoes/${sim.id}`}
                      className="flex size-7 items-center justify-center rounded-md border border-[#d8dbd1] text-[#6b7a70] hover:bg-[#eef0eb]"
                      title="Mais opções"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
