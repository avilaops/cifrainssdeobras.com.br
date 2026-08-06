"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWizard } from "./simulator-shell";
import { Field, FieldRow, SectionTitle, Select, AreaInput, StepFooter, ToggleSection } from "./form-ui";

export function StepAdicionais() {
  const { state, set, next, back } = useWizard();

  return (
    <div className="space-y-6">

      {/* ── Reforma e Demolição ── */}
      <ToggleSection
        label="A obra possui reforma ou demolição"
        active={state.temReformaDemolicao}
        onToggle={(v) => set("temReformaDemolicao", v)}
      >
        <div className="space-y-4">
          <FieldRow>
            <Field label="Área de reforma (m²)">
              <AreaInput
                value={state.areaReforma}
                onChange={(v) => set("areaReforma", v)}
              />
            </Field>
            <Field label="Área de demolição (m²)">
              <AreaInput
                value={state.areaDemolicao}
                onChange={(v) => set("areaDemolicao", v)}
              />
            </Field>
          </FieldRow>
          {state.areaDemolicao > 0 && (
            <Field label="Tipo de Obra da Demolição" required>
              <Select
                value={state.tipoDemolicao}
                onChange={(e) => set("tipoDemolicao", e.target.value)}
              >
                <option value="ALVENARIA">Alvenaria</option>
                <option value="MADEIRA">Madeira</option>
                <option value="MISTA">Mista</option>
              </Select>
            </Field>
          )}
        </div>
      </ToggleSection>

      {/* ── Áreas Complementares ── */}
      <ToggleSection
        label="A obra possui áreas complementares"
        active={state.temAreasComplementares}
        onToggle={(v) => set("temAreasComplementares", v)}
      >
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6b7a70]">Piscinas</p>
            <FieldRow>
              <Field label="Piscina coberta (m²)">
                <AreaInput value={state.piscinaCoberta} onChange={(v) => set("piscinaCoberta", v)} />
              </Field>
              <Field label="Piscina descoberta (m²)">
                <AreaInput value={state.piscinaDescoberta} onChange={(v) => set("piscinaDescoberta", v)} />
              </Field>
            </FieldRow>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6b7a70]">Quadras</p>
            <FieldRow>
              <Field label="Quadra coberta (m²)">
                <AreaInput value={state.quadraCoberta} onChange={(v) => set("quadraCoberta", v)} />
              </Field>
              <Field label="Quadra descoberta (m²)">
                <AreaInput value={state.quadraDescoberta} onChange={(v) => set("quadraDescoberta", v)} />
              </Field>
            </FieldRow>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6b7a70]">Garagens e estacionamentos</p>
            <FieldRow>
              <Field label="Área coberta (m²)">
                <AreaInput value={state.garagemCoberta} onChange={(v) => set("garagemCoberta", v)} />
              </Field>
              <Field label="Área descoberta (m²)">
                <AreaInput value={state.garagemDescoberta} onChange={(v) => set("garagemDescoberta", v)} />
              </Field>
            </FieldRow>
          </div>
        </div>
      </ToggleSection>

      <StepFooter>
        <button onClick={back} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="size-4" /> Voltar
        </button>
        <button onClick={next} className="btn-primary flex items-center gap-2">
          Continuar <ArrowRight className="size-4" />
        </button>
      </StepFooter>
    </div>
  );
}
