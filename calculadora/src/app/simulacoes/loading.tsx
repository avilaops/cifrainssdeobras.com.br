import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-graphite-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-olive-500" />
        <p className="text-sm font-semibold text-graphite-500">Carregando...</p>
      </div>
    </div>
  );
}
