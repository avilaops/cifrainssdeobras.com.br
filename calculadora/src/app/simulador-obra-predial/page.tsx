"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote, Building2, Calculator, CalendarRange, CheckCircle2, ChevronDown, FileText,
  Gauge, HardHat, History, ListChecks, Percent, PiggyBank, Save, Sparkles, SlidersHorizontal,
  TrendingDown, TriangleAlert, User, Waves,
} from "lucide-react";
import { calcularINSS, brl, num, type SimulacaoInput } from "@/lib/calc/calculos";
import { TIPOS_OBRA, isObraNaoPredial, type TipoObraKey } from "@/lib/calc/dados";
import { gerarPlanoMensal } from "@/lib/calc/planejador";
import { salvarSimulacao, consultarVau } from "@/app/actions";
import { AnimatedNumber } from "@/components/animated-number";
import { sair } from "@/app/login/actions";
import { trackAnonymous } from "@/lib/analytics";

const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS",
  "MT", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

function mesRelativo(meses: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + meses);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function Home() {
  const [aba, setAba] = React.useState<"sim" | "plan">("sim");
  const [nomeCliente, setNomeCliente] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [responsavel, setResponsavel] = React.useState<"pf" | "pj">("pf");
  const [uf, setUf] = React.useState("SP");
  const [tipo, setTipo] = React.useState<TipoObraKey>("residencial");
  const [material, setMaterial] = React.useState("ALVENARIA");
  const [preMoldado, setPreMoldado] = React.useState(false);
  const [areaConstrucao, setAreaConstrucao] = React.useState(0);
  const [temReforma, setTemReforma] = React.useState(false);
  const [areaRef, setAreaRef] = React.useState(0);
  const [areaDem, setAreaDem] = React.useState(0);
  const [temPiscina, setTemPiscina] = React.useState(false);
  const [areaPis, setAreaPis] = React.useState(0);
  const [concretoUsinado, setConcretoUsinado] = React.useState(false);
  const [dataInicio, setDataInicio] = React.useState(() => mesRelativo(-12));
  const [dataFim, setDataFim] = React.useState(() => mesRelativo(12));
  const [vauManualAtivo, setVauManualAtivo] = React.useState(false);
  const [vauManual, setVauManual] = React.useState(0);
  const [percHonorarios, setPercHonorarios] = React.useState(30);
  const [competenciaVau, setCompetenciaVau] = React.useState("");
  const [observacoes, setObservacoes] = React.useState("");

  const [salvando, setSalvando] = React.useState(false);
  const [salvo, setSalvo] = React.useState<string | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);
  const [mensagemVau, setMensagemVau] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!uf || !dataFim) return;
    consultarVau(uf, dataFim).then((res) => {
      setCompetenciaVau(res.competencia);
      if (res.valor) {
        setVauManual(res.valor);
        setVauManualAtivo(true);
        setMensagemVau(`✅ VAU recuperado do banco de dados para ${uf} - ${res.competencia} (R$ ${res.valor}).`);
      } else {
        setVauManualAtivo(true);
        setVauManual(0);
        setMensagemVau(`⚠️ VAU não cadastrado para ${uf} - ${res.competencia}. Por favor, insira o valor atualizado.`);
      }
    });
  }, [uf, dataFim]);


  const input: SimulacaoInput = {
    responsavel,
    uf,
    tipo,
    material,
    preMoldado,
    areaConstrucao,
    areaReforma: areaRef,
    areaDemolicao: areaDem,
    areaPiscina: areaPis,
    concretoUsinado,
    dataInicio: `${dataInicio}-01`,
    dataFim: `${dataFim}-01`,
    vauManual: vauManualAtivo ? vauManual : 0,
    percHonorarios: percHonorarios / 100,
  };

  const temArea = areaConstrucao > 0 || areaRef > 0 || areaDem > 0 || areaPis > 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resultado = React.useMemo(() => (temArea ? calcularINSS(input) : null), [
    responsavel, uf, tipo, material, preMoldado, areaConstrucao, areaRef, areaDem, areaPis,
    concretoUsinado, dataInicio, dataFim, vauManualAtivo, vauManual, percHonorarios,
  ]);
  const tipoNaoPredial = isObraNaoPredial(tipo);

  async function onSalvar() {
    if (!resultado) {
      setErro("Informe ao menos uma área maior que zero para gerar a simulação.");
      return;
    }
    if (!nomeCliente.trim()) {
      setErro("Informe o nome do cliente antes de salvar.");
      return;
    }
    setErro(null);
    setSalvando(true);
    setSalvo(null);
    try {
      const result = await salvarSimulacao({ ...input, nomeCliente, telefone, email, competenciaVau, observacoes });
      if ("error" in result && result.error) {
        setErro(result.error);
      } else if ("id" in result && result.id) {
        setSalvo(result.id);
        trackAnonymous("simulacao_salva", { tipo, responsavel, uf });
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-graphite-900">



      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:grid-cols-[400px_1fr]">
        <aside className="flex flex-col gap-5 border-r border-graphite-200 bg-white/80 p-6 backdrop-blur-md shadow-panel z-10 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto custom-scrollbar">
          <SecTitle icon={User}>Identificação</SecTitle>
          <Field label="Nome do Cliente">
            <Input value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} placeholder="Ex: Fausto Augusto Matta" />
          </Field>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Telefone (opcional)">
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 91234-5678" />
            </Field>
            <Field label="E-mail (opcional)">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" />
            </Field>
          </div>
          <Field label="Responsável pela Obra">
            <div className="flex gap-1.5">
              {(["pf", "pj"] as const).map((r) => (
                <label
                  key={r}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-semibold transition-all select-none ${
                    responsavel === r
                      ? "border-olive-400 bg-gradient-to-br from-olive-500/25 to-olive-500/10 text-graphite-900 shadow-inner"
                      : "border-graphite-200 bg-cream text-graphite-500 hover:border-graphite-300"
                  }`}
                >
                  <input type="radio" className="hidden" checked={responsavel === r} onChange={() => setResponsavel(r)} />
                  {r === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
                </label>
              ))}
            </div>
          </Field>

          <SecTitle icon={Building2}>Dados da Obra</SecTitle>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="UF da Obra">
              <Select value={uf} onChange={(e) => setUf(e.target.value)}>
                {UFS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </Select>
            </Field>
            <Field label="Tipo de Obra">
              <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoObraKey)}>
                {Object.entries(TIPOS_OBRA).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Material da Parede">
              <Select value={material} onChange={(e) => setMaterial(e.target.value)}>
                <option value="ALVENARIA">Alvenaria</option>
                <option value="MADEIRA">Madeira</option>
                <option value="MISTA">Mista</option>
              </Select>
            </Field>
            <Field label="Pré-moldado/fabricado">
              <div className="flex h-11 items-center rounded-lg border border-graphite-200 bg-white px-3">
                <Toggle icon={Sparkles} label="Usa pré-moldado?" checked={preMoldado} onChange={setPreMoldado} />
              </div>
            </Field>
          </div>
          <Field label="Área de Construção (m²)">
            <Input type="number" min={0} step={0.01} value={areaConstrucao} onChange={(e) => setAreaConstrucao(parseFloat(e.target.value) || 0)} />
          </Field>
          {tipoNaoPredial && (
            <div className="rounded-lg border border-gold/25 bg-gold/10 p-3 text-[11px] leading-relaxed text-gold/90">
              Tipo não predial: a RMT usa o percentual específico da tabela SERO para o serviço selecionado. Fator social e fator de ajuste não são aplicados neste modo.
            </div>
          )}

          <Toggle icon={HardHat} label="Tem Reforma ou Demolição?" checked={temReforma} onChange={setTemReforma} />
          <AnimatedReveal show={temReforma}>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Reforma (m²)">
                <Input type="number" min={0} step={0.01} value={areaRef} onChange={(e) => setAreaRef(parseFloat(e.target.value) || 0)} />
              </Field>
              <Field label="Demolição (m²)">
                <Input type="number" min={0} step={0.01} value={areaDem} onChange={(e) => setAreaDem(parseFloat(e.target.value) || 0)} />
              </Field>
            </div>
          </AnimatedReveal>

          <Toggle icon={Waves} label="Tem Piscina?" checked={temPiscina} onChange={setTemPiscina} />
          <AnimatedReveal show={temPiscina}>
            <Field label="Piscina (m²)">
              <Input type="number" min={0} step={0.01} value={areaPis} onChange={(e) => setAreaPis(parseFloat(e.target.value) || 0)} />
            </Field>
          </AnimatedReveal>

          <Toggle icon={Sparkles} label="Usa Concreto Usinado? (−5%)" checked={concretoUsinado} onChange={setConcretoUsinado} />

          <SecTitle icon={CalendarRange}>Período da Obra</SecTitle>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Início">
              <Input type="month" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </Field>
            <Field label="Encerramento">
              <Input type="month" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </Field>
          </div>

          <SecTitle icon={Gauge}>VAU Personalizado</SecTitle>
          <Toggle label="Inserir VAU manualmente?" checked={vauManualAtivo} onChange={setVauManualAtivo} />
          
          {mensagemVau && (
            <div className={`mt-2 p-3 text-[11px] rounded-lg border ${
              mensagemVau.includes('✅') 
                ? 'bg-olive-500/10 border-olive-400/30 text-olive-600' 
                : 'bg-gold/10 border-gold/30 text-gold'
            }`}>
              {mensagemVau}
            </div>
          )}

          <AnimatedReveal show={vauManualAtivo}>
            <div className="rounded-lg border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-3 mt-2">
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-gold uppercase">
                <Sparkles className="size-3" /> VAU Atual (R$/m²)
              </p>
              <Input type="number" min={0} step={1} value={vauManual} onChange={(e) => setVauManual(parseFloat(e.target.value) || 0)} />
              <p className="mt-1.5 text-[10px] text-gold/80 italic">Consulte em Receita Federal / SERO / e-CAC</p>
            </div>
          </AnimatedReveal>
          <Field label="Competência do VAU">
            <Input type="month" value={competenciaVau} onChange={(e) => setCompetenciaVau(e.target.value)} />
          </Field>

          <SecTitle icon={Percent}>Honorários do Profissional</SecTitle>
          <Field label={`% sobre a Economia Gerada`}>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={70}
                step={5}
                value={percHonorarios}
                onChange={(e) => setPercHonorarios(parseInt(e.target.value))}
                className="w-full accent-olive-400"
              />
              <span className="min-w-11 rounded-md bg-olive-500/20 px-2 py-1 text-center text-xs font-bold text-olive-400">
                {percHonorarios}%
              </span>
            </div>
          </Field>
          <Field label="Observações internas">
            <textarea maxLength={2000} rows={3} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="rounded-lg border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-900 shadow-sm outline-none transition-all focus:border-olive-400 focus:ring-1 focus:ring-olive-400" />
          </Field>

          <div className="mt-1 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSalvar}
              disabled={salvando}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-olive-400 to-olive-600 px-5 py-3.5 text-sm font-black tracking-wide text-white shadow-lg shadow-olive-500/30 transition-all hover:shadow-olive-500/50 hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
            >
              <Save className="size-4" />
              {salvando ? "Salvando…" : "Salvar Simulação"}
            </motion.button>
            <AnimatePresence>
              {salvo && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2"
                >
                  <p className="flex items-center gap-1.5 text-xs font-medium text-pine-600">
                    <CheckCircle2 className="size-3.5" /> Simulação salva (id: {salvo.slice(0, 8)}…).
                  </p>
                  <Link
                    href={`/simulacoes/${salvo}`}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-bold text-gold hover:bg-gold/20"
                  >
                    <FileText className="size-3.5" />
                    Ver relatório e baixar PDF
                  </Link>
                </motion.div>
              )}
              {erro && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium text-red-400">
                  {erro}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </aside>

        <main className="p-6">
          <div className="mb-6 flex items-center justify-center gap-2 border-b border-graphite-200 pb-4">
            <TabButton active={aba === "sim"} onClick={() => setAba("sim")} icon={SlidersHorizontal}>
              Simulação
            </TabButton>
            <TabButton active={aba === "plan"} onClick={() => setAba("plan")} icon={ListChecks}>
              Planejador DCTFWeb
            </TabButton>
          </div>
          <AnimatePresence mode="wait">
            {!resultado ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-center text-graphite-500"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-2xl border border-graphite-200 bg-graphite-100 p-5"
                >
                  <HardHat className="size-10 text-olive-400" />
                </motion.div>
                <h3 className="text-base font-semibold text-graphite-600">Preencha os dados ao lado</h3>
                <p className="max-w-70 text-sm text-graphite-500">A simulação do INSS de obra aparecerá aqui automaticamente.</p>
              </motion.div>
            ) : aba === "sim" ? (
              <motion.div key="resultado" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <Resultado resultado={resultado} percHonorarios={percHonorarios} />
              </motion.div>
            ) : (
              <motion.div key="planejador" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <Planejador input={input} resultado={resultado} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function AnimatedReveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Resultado({
  resultado,
  percHonorarios,
}: {
  resultado: ReturnType<typeof calcularINSS>;
  percHonorarios: number;
}) {
  const r = resultado;
  const pct = Math.round(r.reducaoPercent);
  const mx = r.inssDevido || 1;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Sparkles className="size-4 text-gold" /> Resultado da Simulação
        </h2>
        <span className="rounded-full border border-gold/25 bg-gradient-to-r from-gold/20 to-gold/5 px-3.5 py-1.5 text-[11px] font-semibold text-gold shadow-sm">
          VAU: R$ {num(r.vauUsado, 0)}/m²
        </span>
      </div>

      <div
        className={`mb-4 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed shadow-sm ${
          r.podeAjuste ? "border-olive-400/25 bg-olive-500/10 text-graphite-700" : "border-red-700/25 bg-red-500/10 text-red-200"
        }`}
      >
        {r.podeAjuste ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-olive-400" /> : <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" />}
        <span>
          {r.podeAjuste ? (
            <>
              Fator de Ajuste aplicável: exige créditos em DCTFWeb de pelo menos {r.areaTotal <= 350 ? "50%" : "70%"} da RMT.
              Economia estimada de <strong>{pct}%</strong> sobre o INSS devido.
            </>
          ) : (
            "Fator de Ajuste não aplicado neste cenário. INSS calculado pela aferição indireta padrão."
          )}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Kpi icon={TrendingDown} cor="red" label="INSS Devido (sem planejamento)" valor={r.inssDevido} sub={`RMT: ${brl(r.rmtTotal)}`} />
        <Kpi icon={CheckCircle2} cor="olive" label="INSS com Planejamento" valor={r.inssComReducao} sub={`${pct}% de redução`} />
        <Kpi icon={PiggyBank} cor="green" label="Economia Líquida" valor={r.economiaLiq} sub={`após ${brl(r.honorarios)} em honorários`} />
      </div>

      <Card title="Comparativo Visual">
        <BarRow label="INSS sem planejamento" valor={r.inssDevido} max={mx} cor="from-red-600 to-red-500" />
        <BarRow label="INSS com planejamento" valor={r.inssComReducao} max={mx} cor="from-olive-500 to-olive-400" />
        <BarRow label="Economia líquida" valor={r.economiaLiq} max={mx} cor="from-green-600 to-green-400" />
      </Card>

      <Card title="Detalhamento do Cálculo">
        <table className="w-full text-xs">
          <tbody>
            <Row label="VAU utilizado (R$/m²)" valor={`R$ ${num(r.vauUsado, 0)}`} />
            <Row label="Área total aferida" valor={`${num(r.areaTotal)} m²`} />
            <Row label="COD — Custo da Obra por Destinação" valor={brl(r.codTotal)} />
            <Row label="RMT — Remuneração da Mão de Obra Total" valor={brl(r.rmtTotal)} />
            <Row
              label="Fator Social (Pessoa Física)"
              valor={r.podeAjuste ? `${r.fatorSocial} (${Math.round(r.fatorSocial * 100)}%)` : "N/A (PJ)"}
            />
            <Row label="INSS Bruto (RMT × 36,8%)" valor={brl(r.inssBruto)} destaque />
            <Row label="INSS Devido (após Fator Social)" valor={brl(r.inssDevido)} />
            <Row label="RMT mínima a comprovar em DCTFWeb" valor={r.podeAjuste ? `${brl(r.rmtMinimaDctfweb)} (${Math.round(r.minPercentDctfweb * 100)}%)` : "N/A"} />
            <Row label="Crédito INSS estimado para ajuste" valor={r.podeAjuste ? brl(r.inssMinimoDctfweb) : "N/A"} />
            <Row label="Redução estimada com Fator de Ajuste" valor={r.podeAjuste ? `${pct}%` : "N/A"} />
            <Row label="INSS com Planejamento" valor={brl(r.inssComReducao)} destaque />
            {r.multaMaed > 0 && <Row label="Multa MAED (Atraso DCTFWeb)" valor={brl(r.multaMaed)} />}
            <Row label="Economia em Imposto" valor={brl(r.economiaImposto)} />
            <Row label="Honorários do Profissional" valor={`${brl(r.honorarios)} (${Math.round(percHonorarios)}% da economia)`} />
            <Row label="Economia Líquida" valor={brl(r.economiaLiq)} destaque />
          </tbody>
        </table>
      </Card>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-graphite-200 border-t-2 border-t-red-500 bg-gradient-to-br from-white to-cream/40 p-4 shadow-sm">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-red-400 uppercase">
            <Banknote className="size-3" /> Período Retroativo
          </p>
          <p className="text-3xl font-black font-display tracking-tight text-red-600">{brl(r.retroativo)}</p>
          <p className="mt-1 text-[10px] text-graphite-500 italic">Emitido integralmente na abertura do processo</p>
        </div>
        <div className="rounded-xl border border-graphite-200 border-t-2 border-t-olive-400 bg-gradient-to-br from-white to-cream/40 p-4 shadow-sm">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-olive-400 uppercase">
            <CalendarRange className="size-3" /> Período Futuro
          </p>
          <p className="text-3xl font-black font-display tracking-tight text-olive-600">{brl(r.futuro)}</p>
          <p className="mt-1 text-[10px] text-graphite-500 italic">
            {r.mesesFuturos > 0 ? `${r.mesesFuturos} parcelas de ${brl(r.parcelaMensal)}/mês` : "Obra já encerrada"}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-red-700/25 bg-red-500/10 p-3.5 text-xs leading-relaxed text-red-200">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" />
        <span>
          Valores estimados com base em dados de referência. O cálculo oficial deve ser feito via <strong>SERO/e-CAC</strong>. O
          Fator de Ajuste exige transmissão mensal da <strong>DCTFWeb</strong> durante toda a obra.
        </span>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? "text-pine-950" : "text-graphite-500 hover:text-graphite-900"
      }`}
    >
      {active && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 rounded-full bg-gradient-to-br from-paper to-sage-100 shadow"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <Icon className="relative z-10 size-3.5" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function Planejador({ input, resultado }: { input: SimulacaoInput; resultado: ReturnType<typeof calcularINSS> }) {
  const plano = React.useMemo(() => gerarPlanoMensal(input, resultado), [input, resultado]);
  const statusStyle: Record<string, string> = {
    retroativo: "bg-red-500/15 text-red-300 border-red-500/25",
    atual: "bg-green-500/15 text-green-300 border-green-500/25",
    futuro: "bg-olive-500/15 text-olive-300 border-olive-500/25",
  };
  const statusLabel: Record<string, string> = { retroativo: "Retroativo", atual: "Mês atual", futuro: "Futuro" };

  return (
    <div>
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold">
        <ListChecks className="size-4 text-gold" /> Planejador Mensal DCTFWeb
      </h2>
      <p className="mb-5 text-xs text-graphite-500">
        Acompanhe mês a mês o que deve ser declarado para garantir o Fator de Ajuste.
      </p>

      <div className="mb-4 rounded-xl border border-graphite-200 bg-gradient-to-br from-white to-cream/40 p-4 text-xs leading-relaxed text-graphite-700 shadow-sm">
        Para garantir o <strong>Fator de Ajuste (art. 33)</strong>, declare mensalmente no eSocial/DCTFWeb o mínimo de{" "}
        <strong>{Math.round(plano.minPercent * 100)}% da RMT mensal</strong> = <strong>{brl(plano.rmtMinMensal)}</strong> em
        remunerações → INSS mensal de ≈ <strong>{brl(plano.inssMensal)}</strong>.
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-graphite-200 bg-white/60 p-3.5 text-center">
          <p className="text-[10px] font-semibold tracking-wide text-graphite-500 uppercase">Total de Meses</p>
          <p className="text-lg font-extrabold">{plano.mesesTotal}</p>
        </div>
        <div className="rounded-xl border border-graphite-200 bg-white/60 p-3.5 text-center">
          <p className="text-[10px] font-semibold tracking-wide text-graphite-500 uppercase">Remun. Mín. Mensal</p>
          <p className="text-lg font-extrabold">{brl(plano.rmtMinMensal)}</p>
        </div>
        <div className="rounded-xl border border-graphite-200 bg-white/60 p-3.5 text-center">
          <p className="text-[10px] font-semibold tracking-wide text-graphite-500 uppercase">INSS Mensal Est.</p>
          <p className="text-lg font-extrabold">{brl(plano.inssMensal)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-graphite-200 bg-white/60 shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-graphite-200 bg-graphite-100">
              <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Competência</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Status</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Remun. Mín. Declarar</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-wide text-graphite-500 uppercase">INSS do Mês</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-wide text-graphite-500 uppercase">Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {plano.meses.map((m, i) => (
              <tr key={i} className={`border-b border-graphite-200 last:border-none ${m.status === "retroativo" ? "bg-red-500/10" : ""}`}>
                <td className="px-4 py-2 font-semibold uppercase">{m.competencia}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyle[m.status]}`}>
                    {statusLabel[m.status]}
                  </span>
                </td>
                <td className="px-4 py-2">{brl(m.remuneracaoMinima)}</td>
                <td className="px-4 py-2">{brl(m.inssMes)}</td>
                <td className="px-4 py-2 font-semibold">{brl(m.acumulado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecTitle({ icon: Icon, children }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="mt-1 flex items-center gap-2 text-[10px] font-bold tracking-widest text-graphite-500 uppercase">
      {Icon && <Icon className="size-3.5 text-olive-500" />}
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-graphite-200 to-transparent" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold tracking-wide text-graphite-500 uppercase">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="rounded-lg border border-graphite-300 bg-white px-3 py-2.5 text-sm text-graphite-900 placeholder:text-graphite-500 shadow-sm outline-none transition-all focus:border-olive-400 focus:ring-1 focus:ring-olive-400 focus:bg-white"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none rounded-lg border border-graphite-300 bg-white px-3 py-2.5 pr-8 text-sm text-graphite-900 shadow-sm outline-none transition-all focus:border-olive-400 focus:ring-1 focus:ring-olive-400 focus:bg-white"
      />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-graphite-500" />
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-graphite-200 py-1.5">
      <span className="flex items-center gap-1.5 text-xs text-graphite-600">
        {Icon && <Icon className="size-3.5 text-graphite-500" />}
        {label}
      </span>
      <label className="relative inline-block h-5.5 w-9.5">
        <input type="checkbox" className="peer hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="absolute inset-0 cursor-pointer rounded-full border border-graphite-200 bg-white transition peer-checked:border-olive-400 peer-checked:bg-gradient-to-r peer-checked:from-olive-500 peer-checked:to-olive-400" />
        <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-graphite-400 shadow transition peer-checked:translate-x-4 peer-checked:bg-white" />
      </label>
    </div>
  );
}

function Kpi({
  icon: Icon,
  cor,
  label,
  valor,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  cor: "red" | "olive" | "green";
  label: string;
  valor: number;
  sub: string;
}) {
  const styles = {
    red: { bar: "from-red-600 to-red-400", glow: "shadow-red-900/20", icon: "bg-red-500/15 text-red-400" },
    olive: { bar: "from-olive-500 to-olive-400", glow: "shadow-olive-900/20", icon: "bg-olive-500/15 text-olive-400" },
    green: { bar: "from-green-600 to-green-400", glow: "shadow-green-900/20", icon: "bg-green-500/15 text-green-400" },
  }[cor];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-xl border border-graphite-200 bg-gradient-to-b from-white to-cream/60 p-4 shadow-lg ${styles.glow}`}
    >
      <span className={`absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r ${styles.bar}`} />
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-wide text-graphite-500 uppercase">{label}</p>
        <span className={`flex size-6 items-center justify-center rounded-md ${styles.icon}`}>
          <Icon className="size-3.5" />
        </span>
      </div>
      <p className="text-3xl font-black tabular-nums font-display tracking-tight text-pine-900">
        <AnimatedNumber value={valor} format={brl} />
      </p>
      <p className="mt-1 text-[10px] text-graphite-500">{sub}</p>
    </motion.div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-xl border border-graphite-200 bg-gradient-to-b from-white/80 to-cream/40 p-4.5 shadow-sm backdrop-blur-sm">
      <p className="mb-3.5 text-[10px] font-bold tracking-wide text-graphite-500 uppercase">{title}</p>
      {children}
    </div>
  );
}

function BarRow({ label, valor, max, cor }: { label: string; valor: number; max: number; cor: string }) {
  const width = Math.min(100, (valor / max) * 100);
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-graphite-500">{label}</span>
        <span className="font-bold tabular-nums">
          <AnimatedNumber value={valor} format={brl} />
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-graphite-200">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${cor}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function Row({ label, valor, destaque }: { label: string; valor: string; destaque?: boolean }) {
  return (
    <tr className="border-b border-graphite-200 last:border-none">
      <td className={`py-1.5 pr-4 ${destaque ? "text-gold" : "text-graphite-500"}`}>{label}</td>
      <td className={`py-1.5 text-right font-bold ${destaque ? "text-gold" : ""}`}>{valor}</td>
    </tr>
  );
}
