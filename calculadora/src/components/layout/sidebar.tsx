"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Target, SlidersHorizontal, Calculator, Scale, FileText,
  Users, BarChart3, Settings, LogOut, ChevronRight,
  PanelLeftClose, PanelLeftOpen, Menu, X, Lock,
} from "lucide-react";
import { sair } from "@/app/login/actions";

// ─── Navigation Definition ─────────────────────────────────────────────────

type NavItem = { label: string; href: string; available?: boolean };
type NavModule =
  | { id: string; label: string; icon: React.ComponentType<{ className?: string }>; href: string; items?: never }
  | { id: string; label: string; icon: React.ComponentType<{ className?: string }>; items: NavItem[]; href?: never };

const NAV_MODULES: NavModule[] = [
  { id: "inicio", label: "Início", icon: Home, href: "/ferramentas" },
  {
    id: "planejamento", label: "Planejamento", icon: Target,
    items: [
      { label: "Planejamento Tributário", href: "/em-breve/planejamento-tributario" },
      { label: "Fator de Ajuste",         href: "/em-breve/fator-ajuste" },
      { label: "Planejador DCTFWeb",      href: "/simulador-obra-predial", available: true },
    ],
  },
  {
    id: "simuladores", label: "Simuladores", icon: SlidersHorizontal,
    items: [
      { label: "Obra Predial",    href: "/simulador-obra-predial", available: true },
      { label: "Obra Não Predial", href: "/em-breve/obra-nao-predial" },
    ],
  },
  {
    id: "calculos", label: "Cálculos", icon: Calculator,
    items: [
      { label: "eSocial",       href: "/em-breve/esocial" },
      { label: "GPS Espontânea", href: "/em-breve/gps-espontanea" },
      { label: "GFIP",          href: "/em-breve/gfip" },
      { label: "Decadência",    href: "/em-breve/decadencia" },
      { label: "Obras PJ",      href: "/em-breve/obras-pj" },
    ],
  },
  {
    id: "reforma", label: "Reforma Tributária", icon: Scale,
    items: [
      { label: "Simulador IBS/CBS",      href: "/simulador-reforma-tributaria", available: true },
      { label: "Desconto IRPF",          href: "/calculadora-reducao-irpf", available: true },
      { label: "Base de Cálculo IRPFM",  href: "/em-breve/base-calculo-irpfm" },
      { label: "IRPFM",                  href: "/em-breve/irpfm" },
    ],
  },
  {
    id: "documentos", label: "Documentos", icon: FileText,
    items: [
      { label: "Propostas",           href: "/em-breve/proposta-servicos" },
      { label: "Contratos",           href: "/em-breve/contrato" },
      { label: "Recibos",             href: "/em-breve/recibos" },
      { label: "Formulários",         href: "/em-breve/formulario-captura" },
    ],
  },
  { id: "clientes",   label: "Clientes",   icon: Users,     href: "/em-breve/clientes" },
  { id: "relatorios", label: "Relatórios", icon: BarChart3, href: "/simulacoes" },
];

// ─── Sidebar ───────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-open the group that contains the current path
  useEffect(() => {
    for (const mod of NAV_MODULES) {
      if (mod.items) {
        const match = mod.items.some((item) =>
          item.href.length > 1 && pathname.startsWith(item.href)
        );
        if (match) { setOpenGroup(mod.id); return; }
      }
    }
  }, [pathname]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname === "/login") return null;

  const toggleGroup = (id: string) => {
    if (collapsed) setCollapsed(false);
    setOpenGroup((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* ── Mobile top bar ─── */}
      <div className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-[#d8dbd1] bg-[#f5f5ef] px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex size-8 items-center justify-center rounded-lg border border-[#d8dbd1] bg-white text-[#1b3629]"
        >
          <Menu className="size-4" />
        </button>
        <span className="text-sm font-black tracking-widest text-[#1b3629]">CIFRA</span>
        <div className="size-8" />
      </div>

      {/* ── Mobile overlay ─── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ── Sidebar panel ─── */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-[#e2e4dc] bg-white transition-[width,transform] duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          md:static md:z-auto md:translate-x-0 md:shadow-none
          ${collapsed ? "w-[72px]" : "w-[240px]"}`}
      >
        {/* ─ Brand header ─ */}
        <div className="flex h-14 shrink-0 items-center border-b border-[#eef0eb] px-3">
          {collapsed ? (
            <Link
              href="/ferramentas"
              className="mx-auto flex size-9 items-center justify-center rounded-xl bg-[#1b3629] text-white shadow-sm"
            >
              <span className="text-sm font-black">C</span>
            </Link>
          ) : (
            <Link href="/ferramentas" className="flex flex-1 flex-col">
              <span className="text-sm font-black tracking-widest text-[#1b3629]">CIFRA</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6b7a70]">
                Consultoria Tributária
              </span>
            </Link>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden size-7 shrink-0 items-center justify-center rounded-md text-[#8a9890] transition hover:bg-[#eef0eb] hover:text-[#1b3629] md:flex"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed
              ? <PanelLeftOpen  className="size-4" />
              : <PanelLeftClose className="size-4" />}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-[#8a9890] hover:bg-[#eef0eb] md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ─ Navigation ─ */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-0.5">
          {NAV_MODULES.map((mod) => {
            const Icon = mod.icon;

            // Is any child of this group the current page?
            const hasActiveChild = mod.items?.some(
              (i) => i.href.length > 1 && pathname.startsWith(i.href)
            ) ?? false;

            // Is this single-link module the current page?
            const isDirectlyActive = mod.href
              ? pathname === mod.href || (mod.href.length > 1 && pathname.startsWith(mod.href))
              : false;

            const isOpen = openGroup === mod.id;

            // ── Simple link (no sub-items) ──
            if (!mod.items) {
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  title={collapsed ? mod.label : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all ${
                    isDirectlyActive
                      ? "bg-[#eef0eb] font-semibold text-[#1b3629]"
                      : "font-medium text-[#6b7a70] hover:bg-[#f5f7f4] hover:text-[#1b3629]"
                  }`}
                >
                  <Icon className={`size-4 shrink-0 ${isDirectlyActive ? "text-[#1b3629]" : "text-[#a0ada5] group-hover:text-[#1b3629]"}`} />
                  {!collapsed && <span className="truncate">{mod.label}</span>}
                  {/* Active indicator bar */}
                  {isDirectlyActive && !collapsed && (
                    <span className="ml-auto h-4 w-0.5 rounded-full bg-[#2e5240]" />
                  )}
                </Link>
              );
            }

            // ── Accordion group ──
            return (
              <div key={mod.id}>
                <button
                  onClick={() => toggleGroup(mod.id)}
                  title={collapsed ? mod.label : undefined}
                  className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all ${
                    isOpen || hasActiveChild
                      ? "font-semibold text-[#1b3629]"
                      : "font-medium text-[#6b7a70] hover:bg-[#f5f7f4] hover:text-[#1b3629]"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 transition-colors ${
                      isOpen || hasActiveChild ? "text-[#1b3629]" : "text-[#a0ada5] group-hover:text-[#1b3629]"
                    }`}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{mod.label}</span>
                      <ChevronRight
                        className={`size-3.5 shrink-0 text-[#c5cdb8] transition-transform duration-200 ${isOpen ? "rotate-90 text-[#4a6b5a]" : ""}`}
                      />
                    </>
                  )}
                </button>

                {/* ── Sub-items ── */}
                {!collapsed && isOpen && (
                  <div className="relative ml-[22px] mt-0.5 mb-1">
                    {/* Vertical guide line */}
                    <span className="absolute top-0 bottom-0 left-0 w-px bg-[#e2e4dc]" />

                    <div className="ml-3 space-y-0.5">
                      {mod.items.map((item) => {
                        const isCurrentItem =
                          item.href.length > 1 && pathname.startsWith(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative flex items-center gap-2 rounded-md py-1.5 pl-2 pr-2.5 text-xs transition-all ${
                              isCurrentItem
                                ? "bg-[#eef0eb] font-semibold text-[#1b3629]"
                                : item.available === false || item.available === undefined && !isCurrentItem
                                  ? "text-[#a0ada5] hover:bg-[#f5f7f4] hover:text-[#6b7a70]"
                                  : "font-medium text-[#6b7a70] hover:bg-[#f5f7f4] hover:text-[#1b3629]"
                            }`}
                          >
                            {/* Active left border */}
                            {isCurrentItem && (
                              <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-[#2e5240]" />
                            )}

                            <span className="truncate flex-1">{item.label}</span>

                            {/* Lock for unavailable items */}
                            {!item.available && (
                              <Lock className="size-2.5 shrink-0 text-[#c5cdb8]" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ─ Footer ─ */}
        <div className="shrink-0 border-t border-[#eef0eb] px-2 py-2 space-y-0.5">
          <Link
            href="/em-breve/configuracoes"
            title={collapsed ? "Configurações" : undefined}
            className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium text-[#8a9890] transition hover:bg-[#f5f7f4] hover:text-[#1b3629]"
          >
            <Settings className="size-4 shrink-0" />
            {!collapsed && <span>Configurações</span>}
          </Link>
          <form action={sair} className="w-full">
            <button
              type="submit"
              title={collapsed ? "Sair" : undefined}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium text-[#8a9890] transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-4 shrink-0" />
              {!collapsed && <span>Sair</span>}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
