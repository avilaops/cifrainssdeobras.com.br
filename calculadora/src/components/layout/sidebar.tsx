"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronDown, Home } from "lucide-react";
import { sair } from "@/app/login/actions";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <aside className="flex flex-col w-72 h-full min-h-screen bg-[#002D62] text-white shrink-0 overflow-y-auto overflow-x-hidden border-r border-[#001f44]">
      {/* Header / Logo */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-amber-500">
          Calc<span className="text-white">ProObra</span>
        </h1>
        <p className="text-[10px] text-amber-500 tracking-[0.1em] uppercase mt-1 flex items-center gap-1 font-semibold">
          <span className="opacity-50">///</span> Márcio Medeiros Educação
        </p>
      </div>

      {/* User / Home */}
      <div className="flex flex-col items-center mt-4 px-6 space-y-5">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-black text-amber-500 flex items-center justify-center font-bold text-sm border-2 border-amber-500">
            Calc
          </div>
          <ChevronDown className="w-4 h-4 text-amber-500" />
        </div>

        <Link
          href="/dashboard"
          className="w-full bg-white text-[#002D62] flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-md"
        >
          <Home className="w-4 h-4" />
          HOME
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-6 mt-10 space-y-10 pb-8">
        <NavSection title="Planejamento">
          <NavLink href="#" label="Fator de ajuste" />
        </NavSection>

        <NavSection title="Simuladores">
          <NavLink href="/simulador-obra-predial" label="Obra Predial" active={pathname.startsWith("/simulador")} />
          <NavLink href="#" label="Obra Não Predial" />
        </NavSection>

        <NavSection title="Calculadoras">
          <NavLink href="#" label="eSocial" />
          <NavLink href="#" label="GPS Espontânea" />
          <NavLink href="#" label="GFIP" />
          <NavLink href="#" label="Decadência" />
          <NavLink href="#" label="Obras PJ" />
        </NavSection>

        <NavSection title="Reforma Tributária">
          <NavLink href="#" label="Reforma Tributária" />
          <NavLink href="#" label="Desconto IRPF" />
          <NavLink href="#" label="Base de Cálculo IRPFM" />
          <NavLink href="#" label="IRPFM" />
        </NavSection>

        <NavSection title="Automações">
          <NavLink href="#" label="Contrato" />
          <NavLink href="#" label="Formulário de Captura" />
          <NavLink href="#" label="Proposta de Serviços" />
          <NavLink href="#" label="Recibos" />
          <NavLink href="#" label="Personalizar seu PDF" />
        </NavSection>
      </nav>

      {/* Footer Actions */}
      <div className="p-6 mt-auto space-y-4 bg-[#001f44]/50">
        <button className="w-full bg-amber-500 text-black font-extrabold tracking-wide py-3 rounded-full text-sm hover:bg-amber-400 transition-colors shadow-md">
          Tutoriais
        </button>
        <form action={sair} className="w-full">
          <button className="w-full border border-white/30 text-white font-medium py-2.5 rounded-full text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-center font-serif text-lg font-medium text-white mb-4 tracking-wide">{title}</h2>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}

function NavLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`w-full py-2.5 px-4 rounded-full text-center text-sm font-medium transition-colors shadow-sm bg-white hover:bg-gray-50
        ${active ? "text-amber-500 font-bold" : "text-[#002D62]"}
      `}
    >
      {label}
    </Link>
  );
}
