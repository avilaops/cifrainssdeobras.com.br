"use client";

import { useState, useTransition } from "react";
import type { StatusSimulacao } from "@prisma/client";
import { alterarStatus } from "@/app/actions";

export const STATUS_LABELS: Record<StatusSimulacao, string> = {
  RASCUNHO: "Rascunho",
  SIMULADO: "Simulado",
  PROPOSTA_ENVIADA: "Proposta enviada",
  CONTRATADO: "Contratado",
  EM_REGULARIZACAO: "Em regularização",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  MONITORAMENTO_CNO: "Monitoramento CNO",
};

export function StatusSelect({ id, status }: { id: string; status: StatusSimulacao }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Status da simulação"
      value={value}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value as StatusSimulacao;
        setValue(next);
        startTransition(async () => {
          try {
            await alterarStatus(id, next);
          } catch {
            setValue(status);
          }
        });
      }}
      className="max-w-40 rounded-md border border-graphite-200 bg-white px-2 py-1.5 text-xs font-bold text-graphite-900 outline-none disabled:opacity-50"
    >
      {Object.entries(STATUS_LABELS).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  );
}
