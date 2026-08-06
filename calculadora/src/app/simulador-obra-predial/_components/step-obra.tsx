"use client";

import { useWizard } from "./simulator-shell";
import { TIPOS_OBRA, type TipoObraKey } from "@/lib/calc/dados";
import { ArrowRight } from "lucide-react";
import { Field, FieldRow, SectionTitle, Select, Toggle, StepFooter } from "./form-ui";

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS",
  "MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

const SITUACOES = [
  { value: "concluida_habitese", label: "Concluída com Habite-se" },
  { value: "em_construcao",      label: "Em construção" },
  { value: "iniciar_em_breve",   label: "Iniciar em breve" },
  { value: "mais_5_anos",        label: "Construída há mais de 5 anos" },
  { value: "outro",              label: "Outro" },
];

const REGIMES = [
  "Simples Nacional — Não desonerado",
  "Simples Nacional — Desonerado",
  "Lucro Presumido — Não desonerado",
  "Lucro Presumido — Desonerado",
  "Lucro Real — Não desonerado",
  "Lucro Real — Desonerado",
];

export function StepObra() {
  const { state, set, next } = useWizard();

  const canContinue = state.nomeCliente.trim().length > 0 && state.uf.length > 0;

  return (
    <div className="space-y-8">

      {/* ── Identificação ── */}
      <section>
        <SectionTitle>Identificação</SectionTitle>
        <div className="space-y-4">
          <FieldRow>
            <Field label="Nome do cliente" required>
              <input
                value={state.nomeCliente}
                onChange={(e) => set("nomeCliente", e.target.value)}
                placeholder="Ex: Fausto Augusto Matta"
                className="input-base"
              />
            </Field>
            <Field label="Responsável pela obra">
              <div className="flex gap-2">
                {(["pf", "pj"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set("responsavel", v)}
                    className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${
                      state.responsavel === v
                        ? "border-[#1b3629] bg-[#eef0eb] text-[#1b3629]"
                        : "border-[#d8dbd1] bg-white text-[#6b7a70] hover:border-[#1b3629]/30"
                    }`}
                  >
                    {v === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </button>
                ))}
              </div>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="Telefone">
              <input
                value={state.telefone}
                onChange={(e) => set("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                className="input-base"
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                value={state.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@empresa.com.br"
                className="input-base"
              />
            </Field>
          </FieldRow>

          {/* Regime tributário — só para PJ */}
          {state.responsavel === "pj" && (
            <Field label="Regime tributário">
              <Select
                value={state.regimeTributario}
                onChange={(e) => set("regimeTributario", e.target.value)}
              >
                <option value="">Selecione o regime</option>
                {REGIMES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
            </Field>
          )}
        </div>
      </section>

      {/* ── Informações da Obra ── */}
      <section>
        <SectionTitle>Informações da obra</SectionTitle>
        <div className="space-y-4">
          <FieldRow>
            <Field label="Tipo de Obra" required>
              <Select
                value={state.material}
                onChange={(e) => set("material", e.target.value)}
              >
                <option value="ALVENARIA">Alvenaria</option>
                <option value="MADEIRA">Madeira</option>
                <option value="MISTA">Mista</option>
              </Select>
            </Field>
            <Field label="Uso concreto usinado?">
              <Toggle
                value={state.concretoUsinado}
                onChange={(v) => set("concretoUsinado", v)}
                labelOn="Sim"
                labelOff="Não"
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="Situação da obra">
              <Select
                value={state.situacaoObra}
                onChange={(e) => set("situacaoObra", e.target.value)}
              >
                {SITUACOES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="UF" required>
              <Select value={state.uf} onChange={(e) => set("uf", e.target.value)}>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="Utilizou materiais pré-moldados, pré-fabricados ou estruturas metálicas nas estruturas ou paredes externas?">
              <Select
                value={state.preMoldado}
                onChange={(e) => set("preMoldado", e.target.value as "nao" | "menor_40" | "maior_40")}
              >
                <option value="nao">Não utiliza</option>
                <option value="menor_40">Sim — menor que 40%</option>
                <option value="maior_40">Sim — maior que 40%</option>
              </Select>
            </Field>
          </FieldRow>
        </div>
      </section>

      <StepFooter>
        <div />
        <button
          onClick={next}
          disabled={!canContinue}
          className="btn-primary flex items-center gap-2"
        >
          Continuar <ArrowRight className="size-4" />
        </button>
      </StepFooter>
    </div>
  );
}
