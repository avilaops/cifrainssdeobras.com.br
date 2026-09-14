"use client";

import * as React from "react";
import { ArrowRight, Info } from "lucide-react";
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
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/config/site";

/**
 * Seção de economia com calculadora apenas demonstrativa: nenhum valor é
 * exibido automaticamente , os dados são levados ao formulário principal
 * para análise individual.
 */
export function SavingsSection() {
  const [tipoObra, setTipoObra] = React.useState("");
  const [area, setArea] = React.useState("");
  const [situacaoObra, setSituacaoObra] = React.useState("");
  const [dataInicio, setDataInicio] = React.useState("");
  const [dataConclusao, setDataConclusao] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefill: LeadPrefill = {
      tipoObra: (tipoObra || undefined) as LeadPrefill["tipoObra"],
      situacaoObra: (situacaoObra || undefined) as LeadPrefill["situacaoObra"],
      area: area || undefined,
      dataInicio: dataInicio || undefined,
      dataConclusao: dataConclusao || undefined,
    };
    try {
      sessionStorage.setItem(LEAD_PREFILL_STORAGE_KEY, JSON.stringify(prefill));
    } catch {
      // sessionStorage indisponível , o usuário preenche direto no formulário.
    }
    trackEvent("form_start", { source: "calculadora", placement: "form" });
    document
      .getElementById("formulario")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="economia" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Análise individual"
            title="Cada obra possui características diferentes. Por isso, cada análise deve ser individual."
          />
          <p className="mt-6 text-lg leading-relaxed text-graphite-500">
            O valor do INSS pode variar conforme área construída, tipo da obra,
            padrão construtivo, período de execução, mão de obra utilizada e
            documentação disponível.
          </p>
          <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-sage-50 p-4 text-sm leading-relaxed text-graphite-700">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-pine-700" />
            A simulação ao lado não exibe valores automáticos: os dados são
            levados ao formulário e a estimativa é apresentada somente após a
            análise da equipe.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            aria-label="Simulação inicial da obra"
            className="rounded-2xl border border-graphite-100 bg-white p-6 shadow-panel sm:p-8"
          >
            <h3 className="text-lg font-bold text-graphite-900">
              Comece pela sua obra
            </h3>
            <p className="mt-1 text-sm text-graphite-500">
              Preencha o que souber , todos os campos são opcionais.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="calc-tipo-obra">Tipo da obra</Label>
                <Select
                  id="calc-tipo-obra"
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
                <Label htmlFor="calc-area">Metragem (m²)</Label>
                <Input
                  id="calc-area"
                  inputMode="decimal"
                  placeholder="Ex.: 250"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="calc-situacao">Situação da obra</Label>
                <Select
                  id="calc-situacao"
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
              <div>
                <Label htmlFor="calc-inicio">Início (mês/ano)</Label>
                <Input
                  id="calc-inicio"
                  placeholder="Ex.: 03/2023"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="calc-conclusao">Conclusão (mês/ano)</Label>
                <Input
                  id="calc-conclusao"
                  placeholder="Ex.: 12/2024"
                  value={dataConclusao}
                  onChange={(e) => setDataConclusao(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button type="submit" size="lg" className="w-full">
                Solicitar análise
                <ArrowRight aria-hidden="true" />
              </Button>
              {siteConfig.calculatorUrl ? (
                <Button asChild type="button" variant="secondary" size="lg" className="w-full">
                  <a href={siteConfig.calculatorUrl}>Abrir calculadora</a>
                </Button>
              ) : null}
            </div>
            <p className="mt-3 text-center text-xs text-graphite-500">
              Sem compromisso. Seus dados seguem para o formulário de análise.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
