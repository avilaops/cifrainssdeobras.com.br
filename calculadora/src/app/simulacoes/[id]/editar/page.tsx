import Link from "next/link";
import { notFound } from "next/navigation";
import type { TipoObra } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { TipoObraKey } from "@/lib/calc/dados";
import { SimulationEditForm } from "@/components/simulation-edit-form";

const tipoKey: Record<TipoObra, TipoObraKey> = { RESIDENCIAL:"residencial", MULTIFAMILIAR:"multifamiliar", COMERCIAL:"comercial", INDUSTRIAL:"industrial", REFORMA:"reforma", DEMOLICAO:"demolicao", PISCINA:"piscina", MISTA:"mista", PAVIMENTACAO:"pavimentacao", TERRAPLENAGEM:"terraplenagem", OBRA_ARTE:"obraArte", DRENAGEM:"drenagem", NAO_PREDIAL:"naoPredial" };
const iso = (date: Date) => date.toISOString().slice(0, 10);

export default async function EditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.simulacao.findUnique({ where: { id } });
  if (!s) notFound();
  return <main className="min-h-screen bg-paper px-5 py-8 text-graphite-900"><div className="mx-auto max-w-4xl">
    <Link href={`/simulacoes/${id}`} className="text-sm font-bold text-pine-600">← Cancelar e voltar</Link>
    <h1 className="mt-4 text-2xl font-black">Revisar simulação</h1>
    <p className="mb-5 mt-1 text-sm text-graphite-500">O registro atual será preservado. A alteração cria a versão {s.versao + 1}.</p>
    <SimulationEditForm id={id} initial={{ nomeCliente:s.nomeCliente, telefone:s.telefone ?? "", email:s.email ?? "", responsavel:s.responsavel === "PF" ? "pf" : "pj", uf:s.uf, tipo:tipoKey[s.tipoObra], areaConstrucao:s.areaConstrucao, areaReforma:s.areaReforma, areaDemolicao:s.areaDemolicao, areaPiscina:s.areaPiscina, concretoUsinado:s.concretoUsinado, dataInicio:iso(s.dataInicio), dataFim:iso(s.dataFim), vauManual:s.vauManual ?? 0, percHonorarios:s.percHonorarios, competenciaVau:s.competenciaVau ?? "", observacoes:s.observacoes ?? "" }}/>
  </div></main>;
}
