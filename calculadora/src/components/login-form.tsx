"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";
import { entrar } from "@/app/login/actions";

const initialState: { error?: string } = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(entrar, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 text-graphite-900">
      <form action={action} className="w-full max-w-sm rounded-2xl border border-graphite-200 bg-white/80 p-6 shadow-2xl">
        <input type="hidden" name="next" value={nextPath} />
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-olive-500/20 text-olive-400">
            <LockKeyhole className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-widest text-gold uppercase">CIFRA</p>
            <h1 className="text-xl font-black">Acesso à calculadora</h1>
          </div>
        </div>

        <label className="mb-3 block text-xs font-bold tracking-wide text-graphite-500 uppercase">
          Usuário
          <input
            name="user"
            autoComplete="username"
            required
            className="mt-1 w-full rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-900 outline-none focus:border-olive-400"
          />
        </label>

        <label className="mb-4 block text-xs font-bold tracking-wide text-graphite-500 uppercase">
          Senha
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-900 outline-none focus:border-olive-400"
          />
        </label>

        {state.error ? <p className="mb-3 text-sm font-semibold text-red-500">{state.error}</p> : null}

        <button
          disabled={pending}
          className="w-full rounded-lg bg-olive-500 px-4 py-2.5 text-sm font-black text-white hover:bg-olive-400 disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
