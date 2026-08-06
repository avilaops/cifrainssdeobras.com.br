"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LogOut, SlidersHorizontal, History, Calculator, PieChart, LayoutGrid } from "lucide-react";
import { sair } from "@/app/login/actions";

export function CifraHeader() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e2e4dc] bg-[#f5f5ef]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand & Module Title */}
        <div className="flex items-center gap-3">
          <Link href="/simulador-obra-predial" className="flex items-center gap-2">
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#1b3629] px-3 py-1.5 text-center shadow-sm">
              <span className="text-xs font-black tracking-widest text-white">CIFRA</span>
            </div>
          </Link>

          <div className="hidden h-5 w-px bg-[#d5d8cc] sm:block" />

          <div className="hidden items-center gap-2 text-xs font-medium text-[#4a6b5a] sm:flex">
            <FileText className="size-4 text-[#1b3629]" />
            <span>Sistema de Planejamento Tributário</span>
          </div>
        </div>

        {/* Center Nav Pills */}
        <nav className="flex items-center gap-1 rounded-full bg-[#e6e8e0] p-1 shadow-inner">
          <Link
            href="/ferramentas"
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              pathname === "/ferramentas" || pathname.startsWith("/em-breve")
                ? "bg-[#fafbf7] text-[#1b3629] shadow-xs"
                : "text-[#555d57] hover:text-[#1b3629]"
            }`}
          >
            <LayoutGrid className="size-3.5" />
            <span>Ferramentas</span>
          </Link>

          <Link
            href="/simulador-obra-predial"
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              pathname.startsWith("/simulador-obra-predial")
                ? "bg-[#fafbf7] text-[#1b3629] shadow-xs"
                : "text-[#555d57] hover:text-[#1b3629]"
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Simulação</span>
          </Link>

          <Link
            href="/simulacoes"
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              pathname.startsWith("/simulacoes")
                ? "bg-[#fafbf7] text-[#1b3629] shadow-xs"
                : "text-[#555d57] hover:text-[#1b3629]"
            }`}
          >
            <History className="size-3.5" />
            <span>Histórico</span>
          </Link>

          <Link
            href="/dashboard"
            className={`hidden md:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              pathname === "/dashboard"
                ? "bg-[#fafbf7] text-[#1b3629] shadow-xs"
                : "text-[#555d57] hover:text-[#1b3629]"
            }`}
          >
            <PieChart className="size-3.5" />
            <span>Dashboard</span>
          </Link>
        </nav>

        {/* User Badges & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-[#e6e8e0] px-3 py-1 text-[11px] font-medium text-[#4a6b5a] lg:flex">
            <span className="size-2 rounded-full bg-[#2e5240] animate-pulse" />
            <span>Uso interno</span>
          </div>

          <form action={sair}>
            <button
              type="submit"
              title="Sair do sistema"
              className="flex size-9 items-center justify-center rounded-full border border-[#d5d8cc] bg-[#fafbf7] text-[#4a6b5a] transition-all hover:bg-[#e6e8e0] hover:text-[#1b3629]"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}
