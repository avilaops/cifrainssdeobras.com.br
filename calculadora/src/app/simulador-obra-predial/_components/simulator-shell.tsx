"use client";

import * as React from "react";
import type { TipoObraKey } from "@/lib/calc/dados";
import type { SimulacaoResultado } from "@/lib/calc/calculos";
import { consultarVau, salvarSimulacao, calcularSimulacaoAction } from "@/app/actions";
import { trackAnonymous } from "@/lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────────

export type WizardStep = "obra" | "areas" | "adicionais" | "financeiro" | "revisao";

export const STEPS: { id: WizardStep; label: string }[] = [
  { id: "obra",       label: "Obra" },
  { id: "areas",      label: "Áreas" },
  { id: "adicionais", label: "Adicionais" },
  { id: "financeiro", label: "VAU e Honorários" },
  { id: "revisao",    label: "Revisão" },
];

export type SimWizardState = {
  // Step 1
  nomeCliente: string;
  telefone: string;
  email: string;
  responsavel: "pf" | "pj";
  regimeTributario: string;
  material: string;
  concretoUsinado: boolean;
  situacaoObra: string;
  uf: string;
  preMoldado: "nao" | "menor_40" | "maior_40";
  // Step 2
  tipoObra: TipoObraKey;
  areaTotal: number;
  opcaoAfericao: "completa" | "parcial";
  areaAferir?: number;
  // Step 3
  temReformaDemolicao: boolean;
  areaReforma: number;
  areaDemolicao: number;
  tipoDemolicao: string;
  temAreasComplementares: boolean;
  piscinaCoberta: number;
  piscinaDescoberta: number;
  quadraCoberta: number;
  quadraDescoberta: number;
  garagemCoberta: number;
  garagemDescoberta: number;
  // Step 4
  dataInicio: string;
  dataFim: string;
  competenciaVau: string;
  vauManualAtivo: boolean;
  vauManual: number;
  vauEncontrado: number | null;
  mensagemVau: string | null;
  honorariosAtivo: boolean;
  honorariosTipo: "percentual" | "valor_fixo";
  honorariosValor: number;
  observacoes: string;
};

function mesRelativo(delta: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function makeInitialState(): SimWizardState {
  return {
    nomeCliente: "",
    telefone: "",
    email: "",
    responsavel: "pf",
    regimeTributario: "",
    material: "ALVENARIA",
    concretoUsinado: false,
    situacaoObra: "em_construcao",
    uf: "SP",
    preMoldado: "nao",
    tipoObra: "residencial",
    areaTotal: 0,
    opcaoAfericao: "completa",
    temReformaDemolicao: false,
    areaReforma: 0,
    areaDemolicao: 0,
    tipoDemolicao: "ALVENARIA",
    temAreasComplementares: false,
    piscinaCoberta: 0,
    piscinaDescoberta: 0,
    quadraCoberta: 0,
    quadraDescoberta: 0,
    garagemCoberta: 0,
    garagemDescoberta: 0,
    dataInicio: mesRelativo(-12),
    dataFim: mesRelativo(0),
    competenciaVau: "",
    vauManualAtivo: false,
    vauManual: 0,
    vauEncontrado: null,
    mensagemVau: null,
    honorariosAtivo: false,
    honorariosTipo: "percentual",
    honorariosValor: 30,
    observacoes: "",
  };
}

// ─── Context ──────────────────────────────────────────────────────────────

type WizardCtx = {
  state: SimWizardState;
  set: <K extends keyof SimWizardState>(key: K, value: SimWizardState[K]) => void;
  patch: (partial: Partial<SimWizardState>) => void;
  step: WizardStep;
  stepIndex: number;
  goTo: (s: WizardStep) => void;
  next: () => void;
  back: () => void;
  resultado: SimulacaoResultado | null;
  calculando: boolean;
  calcular: () => void;
  salvando: boolean;
  salvoId: string | null;
  salvarErro: string | null;
  onSalvar: () => Promise<void>;
  reset: () => void;
};

export const WizardContext = React.createContext<WizardCtx>(null as unknown as WizardCtx);
export const useWizard = () => React.useContext(WizardContext);

// ─── Shell ────────────────────────────────────────────────────────────────

export function SimulatorShell({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SimWizardState>(makeInitialState);
  const [step, setStep] = React.useState<WizardStep>("obra");
  const [resultado, setResultado] = React.useState<SimulacaoResultado | null>(null);
  const [calculando, setCalculando] = React.useState(false);
  const [salvando, setSalvando] = React.useState(false);
  const [salvoId, setSalvoId] = React.useState<string | null>(null);
  const [salvarErro, setSalvarErro] = React.useState<string | null>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const set = React.useCallback(<K extends keyof SimWizardState>(key: K, value: SimWizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const patch = React.useCallback((partial: Partial<SimWizardState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const goTo = (s: WizardStep) => setStep(s);
  const next = () => { const i = stepIndex; if (i < STEPS.length - 1) setStep(STEPS[i + 1].id); };
  const back = () => { const i = stepIndex; if (i > 0) setStep(STEPS[i - 1].id); };

  // Auto-fetch VAU whenever uf or dataFim changes
  React.useEffect(() => {
    if (!state.uf || !state.dataFim) return;
    consultarVau(state.uf, state.dataFim, state.tipoObra).then((res) => {
      if (res.valor) {
        patch({
          competenciaVau: res.competencia,
          vauEncontrado: res.valor,
          vauManual: res.valor,
          vauManualAtivo: false,
          mensagemVau: `VAU encontrado para ${state.uf} — ${res.competencia}`,
        });
      } else {
        patch({
          competenciaVau: res.competencia,
          vauEncontrado: null,
          vauManual: 0,
          vauManualAtivo: true,
          mensagemVau: `VAU não localizado para ${state.uf} em ${res.competencia}. Informe manualmente.`,
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.uf, state.dataFim, state.tipoObra]);

  const buildCalcInput = React.useCallback(() => {
    const areaPiscina = state.piscinaCoberta + state.piscinaDescoberta;
    return {
      responsavel: state.responsavel,
      uf: state.uf,
      tipo: state.tipoObra,
      material: state.material,
      preMoldado: state.preMoldado !== "nao",
      areaConstrucao: state.opcaoAfericao === "parcial" && state.areaAferir ? state.areaAferir : state.areaTotal,
      areaReforma: state.areaReforma,
      areaDemolicao: state.areaDemolicao,
      areaPiscina,
      concretoUsinado: state.concretoUsinado,
      dataInicio: `${state.dataInicio}-01`,
      dataFim: `${state.dataFim}-01`,
      vauManual: state.vauManualAtivo || state.vauEncontrado === null ? state.vauManual : 0,
      percHonorarios:
        state.honorariosAtivo && state.honorariosTipo === "percentual"
          ? state.honorariosValor / 100
          : 0,
    };
  }, [state]);

  const calcular = React.useCallback(async () => {
    setCalculando(true);
    setSalvoId(null);
    setSalvarErro(null);
    try {
      const input = buildCalcInput();
      const res = await calcularSimulacaoAction({
        ...input,
        nomeCliente: state.nomeCliente,
        telefone: state.telefone,
        email: state.email,
        competenciaVau: state.competenciaVau,
        observacoes: state.observacoes,
      });
      setResultado(res);
    } catch (err) {
      console.error(err);
      setSalvarErro("Erro ao calcular a simulação. Verifique os dados informados e tente novamente.");
    } finally {
      setCalculando(false);
    }
  }, [buildCalcInput, state]);

  const onSalvar = React.useCallback(async () => {
    if (!resultado) return;
    if (!state.nomeCliente.trim()) { setSalvarErro("Informe o nome do cliente."); return; }
    setSalvando(true);
    setSalvarErro(null);
    try {
      const input = buildCalcInput();
      const res = await salvarSimulacao({
        ...input,
        nomeCliente: state.nomeCliente,
        telefone: state.telefone,
        email: state.email,
        competenciaVau: state.competenciaVau,
        observacoes: state.responsavel === "pj" && state.regimeTributario
          ? `Regime Tributário (PJ): ${state.regimeTributario}\n\n${state.observacoes}`
          : state.observacoes,
      });
      if ("error" in res && res.error) { setSalvarErro(res.error); }
      else if ("id" in res && res.id) {
        setSalvoId(res.id);
        trackAnonymous("simulacao_salva", { tipo: input.tipo, responsavel: input.responsavel, uf: input.uf });
      }
    } catch (e) {
      setSalvarErro(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }, [resultado, state, buildCalcInput]);

  const reset = () => {
    setState(makeInitialState());
    setStep("obra");
    setResultado(null);
    setSalvoId(null);
    setSalvarErro(null);
  };

  return (
    <WizardContext.Provider
      value={{ state, set, patch, step, stepIndex, goTo, next, back, resultado, calculando, calcular, salvando, salvoId, salvarErro, onSalvar, reset }}
    >
      {children}
    </WizardContext.Provider>
  );
}
