import Link from "next/link";
import { ArrowLeft, Sparkles, Bell } from "lucide-react";
import { ALL_TOOLS } from "@/lib/tools";

export default async function EmBrevePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = ALL_TOOLS.find((t) => t.href === `/em-breve/${slug}`);

  const label = tool?.label ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description = tool?.description ?? "Esta funcionalidade está sendo desenvolvida pela equipe CIFRA.";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f5f5ef] px-4">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-[#d8dbd1] bg-white/80 shadow-sm">
          <Sparkles className="size-7 text-[#2e5240]" />
        </div>

        {/* Content */}
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#d8dbd1] bg-[#eef0eb] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
          Em desenvolvimento
        </span>

        <h1 className="mt-3 text-2xl font-black tracking-tight text-[#1b3629]">{label}</h1>

        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#6b7a70]">
          {description}
        </p>
        <p className="mt-2 text-xs text-[#8a9890]">
          Nossa equipe está trabalhando nesta ferramenta. Ela será liberada em breve.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/ferramentas"
            className="flex items-center gap-2 rounded-xl border border-[#d8dbd1] bg-white px-5 py-2.5 text-sm font-semibold text-[#1b3629] transition hover:bg-[#eef0eb]"
          >
            <ArrowLeft className="size-4" />
            Ver todas as ferramentas
          </Link>
          <Link
            href="/simulador-obra-predial"
            className="flex items-center gap-2 rounded-xl bg-[#1b3629] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#1b3629]/20 transition hover:bg-[#2e5240]"
          >
            Ir para o Simulador
          </Link>
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-[11px] text-[#a0ada5]">
          Tem uma prioridade? Fale com a equipe de desenvolvimento.
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = ALL_TOOLS.find((t) => t.href === `/em-breve/${slug}`);
  const label = tool?.label ?? slug.replace(/-/g, " ");
  return {
    title: `${label} — Em breve · CIFRA`,
  };
}
