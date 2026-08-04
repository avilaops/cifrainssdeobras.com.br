"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { excluirSimulacao } from "@/app/actions";

export function DeleteSimulationButton({
  id,
  cliente,
}: {
  id: string;
  cliente: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const ok = window.confirm(`Excluir a simulação de ${cliente}? Esta ação não pode ser desfeita.`);
        if (!ok) return;
        startTransition(async () => {
          await excluirSimulacao(id);
        });
      }}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
    >
      <Trash2 className="size-3.5" />
      {pending ? "Excluindo" : "Excluir"}
    </button>
  );
}
