"use client";

import * as React from "react";
import { ArrowRight, BadgeCheck, FileText } from "lucide-react";
import {
  LEAD_PREFILL_STORAGE_KEY,
  SITUACOES_OBRA,
  TIPOS_OBRA,
  type LeadPrefill,
} from "@/types/lead";
import { trackEvent } from "@/lib/tagflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

/**
 * Simulador funcional do hero: coleta os primeiros dados da obra e leva o
 * visitante direto ao formulário de análise, já pré-preenchido.
 * Nenhum valor é calculado aqui , a estimativa depende da análise individual.
 */
export function HeroSimulator() {
  const [tipoObra, setTipoObra] = React.useState("");
  const [area, setArea] = React.useState("");
  const [situacaoObra, setSituacaoObra] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefill: LeadPrefill = {
      tipoObra: (tipoObra || undefined) as LeadPrefill["tipoObra"],
      situacaoObra: (situacaoObra || undefined) as LeadPrefill["situacaoObra"],
      area: area || undefined,
    };
    try {
      sessionStorage.setItem(LEAD_PREFILL_STORAGE_KEY, JSON.stringify(prefill));
    } catch {
      // Sem sessionStorage, o visitante preenche direto no formulário.
    }
    trackEvent("form_start", { placement: "hero", source: "hero_simulador" });

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById("formulario")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Simulação inicial da obra"
      className="relative rounded-2xl border border-graphite-100 bg-white p-6 shadow-panel sm:p-7"
    >
      {/* Cabeçalho do painel */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sage-100 text-pine-700">
            <FileText aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-graphite-900">
              Análise tributária da obra
            </p>
            <p className="text-xs text-graphite-500">
              Comece agora , leva menos de 1 minuto
            </p>
          </div>
        </div>
        <span className="rounded-full bg-sage-50 px-3 py-1 text-[0.65rem] font-bold tracking-wide text-pine-700 uppercase">
          Gratuita
        </span>
      </div>

      {/* Dados iniciais da obra */}
      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="hero-tipo-obra">Tipo da obra</Label>
            <Select
              id="hero-tipo-obra"
              value={tipoObra}
              onChange={(e) => setTipoObra(e.target.value)}
            >
              <option value="">Selecione</option>
              {TIPOS_OBRA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="hero-area">Área do projeto (m²)</Label>
            <Input
              id="hero-area"
              inputMode="decimal"
              placeholder="Ex.: 250"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="hero-situacao">Situação da obra</Label>
          <Select
            id="hero-situacao"
            value={situacaoObra}
            onChange={(e) => setSituacaoObra(e.target.value)}
          >
            <option value="">Selecione</option>
            {SITUACOES_OBRA.map((situacao) => (
              <option key={situacao} value={situacao}>
                {situacao}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full">
        Enviar para análise
        <ArrowRight aria-hidden="true" />
      </Button>
      <p className="mt-3 text-center text-xs text-graphite-500">
        Sem compromisso. Você confirma os dados no formulário a seguir.
      </p>

      {/* Selo de confiança */}
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-graphite-100 bg-cream/60 p-4">
        <BadgeCheck aria-hidden="true" className="size-6 shrink-0 text-pine-700" />
        <p className="text-sm font-semibold text-graphite-700">
          Regularização acompanhada do início à certidão
        </p>
      </div>
    </form>
  );
}
