"use client";

import { useTransition } from "react";
import { Clock } from "lucide-react";
import { agendarMonitoramento } from "@/app/actions";

export function BotaoMonitoramento({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => agendarMonitoramento(id))}
      disabled={pending}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-pine-700 bg-sage-50 px-3 py-2 text-xs font-bold text-pine-900 transition-colors hover:bg-pine-700 hover:text-white disabled:opacity-50"
    >
      <Clock className="size-4" />
      {pending ? "Agendando..." : "Agendar Monitoramento Anual CNO"}
    </button>
  );
}
