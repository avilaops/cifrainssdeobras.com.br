"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { revisarSimulacao, type SalvarSimulacaoInput } from "@/app/actions";
import { TIPOS_OBRA, type TipoObraKey } from "@/lib/calc/dados";

type FormState = Omit<SalvarSimulacaoInput, "tipo"> & { tipo: TipoObraKey };

export function SimulationEditForm({ id, initial }: { id: string; initial: FormState }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((old) => ({ ...old, [key]: value }));
  const field = "rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-900 outline-none focus:border-olive-400";

  return <form onSubmit={(e) => {
    e.preventDefault(); setError("");
    startTransition(async () => {
      try { 
        const result = await revisarSimulacao(id, form); 
        if ("error" in result && result.error) {
          setError(result.error);
        } else if ("id" in result && result.id) {
          router.push(`/simulacoes/${result.id}`); 
        }
      } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível revisar a simulação."); }
    });
  }} className="grid gap-4 rounded-xl border border-graphite-200 bg-white/70 p-5 sm:grid-cols-2">
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Cliente<input required value={form.nomeCliente} onChange={e => set("nomeCliente", e.target.value)} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">E-mail<input type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Telefone<input value={form.telefone ?? ""} onChange={e => set("telefone", e.target.value)} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Responsável<select value={form.responsavel} onChange={e => set("responsavel", e.target.value as "pf"|"pj")} className={field}><option value="pf">Pessoa física</option><option value="pj">Pessoa jurídica</option></select></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">UF<input required minLength={2} maxLength={2} value={form.uf} onChange={e => set("uf", e.target.value.toUpperCase())} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Tipo<select value={form.tipo} onChange={e => set("tipo", e.target.value as TipoObraKey)} className={field}>{Object.entries(TIPOS_OBRA).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
    {(["areaConstrucao","areaReforma","areaDemolicao","areaPiscina"] as const).map(key => <label key={key} className="flex flex-col gap-1 text-xs font-bold uppercase">{{areaConstrucao:"Construção (m²)",areaReforma:"Reforma (m²)",areaDemolicao:"Demolição (m²)",areaPiscina:"Piscina (m²)"}[key]}<input type="number" min="0" step="0.01" value={form[key]} onChange={e => set(key, Number(e.target.value))} className={field}/></label>)}
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Início<input type="date" required value={form.dataInicio} onChange={e => set("dataInicio", e.target.value)} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Fim<input type="date" required value={form.dataFim} onChange={e => set("dataFim", e.target.value)} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">VAU manual<input type="number" min="0" step="0.01" value={form.vauManual ?? 0} onChange={e => set("vauManual", Number(e.target.value))} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Competência VAU<input type="month" value={form.competenciaVau ?? ""} onChange={e => set("competenciaVau", e.target.value)} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Material da Parede<select value={form.material || "ALVENARIA"} onChange={e => set("material", e.target.value)} className={field}><option value="ALVENARIA">Alvenaria</option><option value="MADEIRA">Madeira</option><option value="MISTA">Mista</option></select></label>
    <label className="flex items-center gap-2 text-xs font-bold uppercase"><input type="checkbox" checked={form.concretoUsinado} onChange={e => set("concretoUsinado", e.target.checked)}/> Concreto usinado</label>
    <label className="flex items-center gap-2 text-xs font-bold uppercase"><input type="checkbox" checked={form.preMoldado} onChange={e => set("preMoldado", e.target.checked)}/> Uso de Pré-moldado</label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase">Honorários (%)<input type="number" min="0" max="100" value={form.percHonorarios * 100} onChange={e => set("percHonorarios", Number(e.target.value) / 100)} className={field}/></label>
    <label className="flex flex-col gap-1 text-xs font-bold uppercase sm:col-span-2">Observações<textarea rows={4} maxLength={2000} value={form.observacoes ?? ""} onChange={e => set("observacoes", e.target.value)} className={field}/></label>
    {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
    <button disabled={pending} className="rounded-lg bg-olive-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2">{pending ? "Criando nova versão…" : "Salvar como nova versão"}</button>
  </form>;
}
