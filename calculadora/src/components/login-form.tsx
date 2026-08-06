"use client";

import { useActionState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { entrar } from "@/app/login/actions";

const initialState: { error?: string } = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(entrar, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5ef] px-5">
      <div className="w-full max-w-sm">
        {/* Brand Mark */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#1b3629] px-5 py-3 shadow-lg shadow-[#1b3629]/20">
            <span className="text-xl font-black tracking-widest text-white">CIFRA</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#4a6b5a] uppercase">Consultoria Tributária</span>
          </div>
          <p className="mt-3 text-sm font-medium text-[#4a6b5a]">Sistema de Planejamento Tributário</p>
        </div>

        {/* Card */}
        <form
          action={action}
          className="rounded-2xl border border-[#d8dbd1] bg-white/80 p-7 shadow-xl shadow-[#1b3629]/5 backdrop-blur-sm"
        >
          <input type="hidden" name="next" value={nextPath} />

          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#eef0eb]">
              <LockKeyhole className="size-4 text-[#1b3629]" />
            </span>
            <h1 className="text-base font-bold text-[#1b3629]">Acesso ao Sistema</h1>
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a6b5a]">
              Usuário (e-mail)
              <input
                name="user"
                type="email"
                autoComplete="username"
                required
                placeholder="usuario@empresa.com.br"
                className="mt-1.5 block w-full rounded-lg border border-[#d8dbd1] bg-white px-3 py-2.5 text-sm text-[#1b3629] placeholder:text-[#b0bdb5] outline-none transition-all focus:border-[#1b3629] focus:ring-2 focus:ring-[#1b3629]/10"
              />
            </label>

            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a6b5a]">
              Senha
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="mt-1.5 block w-full rounded-lg border border-[#d8dbd1] bg-white px-3 py-2.5 text-sm text-[#1b3629] placeholder:text-[#b0bdb5] outline-none transition-all focus:border-[#1b3629] focus:ring-2 focus:ring-[#1b3629]/10"
              />
            </label>
          </div>

          {state.error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b3629] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#1b3629]/20 transition-all hover:bg-[#2e5240] hover:shadow-[#1b3629]/30 disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
            {!pending && <ArrowRight className="size-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-[#8a9890]">
          Acesso restrito a usuários autorizados · CIFRA © 2026
        </p>
      </div>
    </main>
  );
}
