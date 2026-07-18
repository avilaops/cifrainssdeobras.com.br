"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleCheckBig, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  LEAD_PREFILL_STORAGE_KEY,
  OPCOES_SIM_NAO_NAOSEI,
  ORIGENS,
  SITUACOES_OBRA,
  TIPOS_CLIENTE,
  TIPOS_OBRA,
  UFS,
  type LeadPrefill,
} from "@/types/lead";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations";
import { buildLeadMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/tagflow";
import { formatPhoneBR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/** Intervalo mínimo entre envios (anti-spam). */
const RATE_LIMIT_MS = 60_000;
/** Tempo mínimo de preenchimento — envios mais rápidos são tratados como bot. */
const MIN_FILL_TIME_MS = 3_000;
const RATE_LIMIT_STORAGE_KEY = "cifra-lead-last-submit";

const defaultValues: LeadFormValues = {
  nome: "",
  telefone: "",
  email: "",
  cidade: "",
  estado: "" as LeadFormValues["estado"],
  tipoCliente: "" as LeadFormValues["tipoCliente"],
  situacaoObra: "" as LeadFormValues["situacaoObra"],
  tipoObra: "" as LeadFormValues["tipoObra"],
  area: "",
  possuiCno: "" as LeadFormValues["possuiCno"],
  afericaoSero: "" as LeadFormValues["afericaoSero"],
  origem: "" as LeadFormValues["origem"],
  dataInicio: "",
  dataConclusao: "",
  valorInss: "",
  observacoes: "",
  aceitePrivacidade: false,
  website: "",
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

export function LeadForm() {
  const router = useRouter();
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const mountedAtRef = React.useRef<number>(Date.now());
  const startedRef = React.useRef(false);
  const [status, setStatus] = React.useState<"idle" | "redirecting">("idle");
  const [blockMessage, setBlockMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
  });

  // Evento view_form: dispara uma única vez quando a seção entra na tela.
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackEvent("view_form");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pré-preenchimento vindo da calculadora demonstrativa.
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LEAD_PREFILL_STORAGE_KEY);
      if (!raw) return;
      sessionStorage.removeItem(LEAD_PREFILL_STORAGE_KEY);
      const prefill = JSON.parse(raw) as LeadPrefill;
      if (prefill.tipoObra && (TIPOS_OBRA as readonly string[]).includes(prefill.tipoObra)) {
        setValue("tipoObra", prefill.tipoObra);
      }
      if (
        prefill.situacaoObra &&
        (SITUACOES_OBRA as readonly string[]).includes(prefill.situacaoObra)
      ) {
        setValue("situacaoObra", prefill.situacaoObra);
      }
      if (prefill.area) setValue("area", prefill.area);
      if (prefill.dataInicio) setValue("dataInicio", prefill.dataInicio);
      if (prefill.dataConclusao) setValue("dataConclusao", prefill.dataConclusao);
    } catch {
      // Prefill é conveniência: falha silenciosa não impede o preenchimento.
    }
  }, [setValue]);

  const handleFirstInteraction = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("form_start", { formId: "lead-analysis", placement: "form" });
  };

  const onSubmit = (data: LeadFormValues) => {
    setBlockMessage(null);

    // Honeypot preenchido ⇒ bot. Não envia nada.
    if (data.website && data.website.length > 0) return;

    // Preenchimento rápido demais ⇒ provável bot.
    if (Date.now() - mountedAtRef.current < MIN_FILL_TIME_MS) return;

    // Limite de reenvio.
    try {
      const last = Number(localStorage.getItem(RATE_LIMIT_STORAGE_KEY) ?? 0);
      if (Date.now() - last < RATE_LIMIT_MS) {
        setBlockMessage(
          "Você acabou de enviar uma solicitação. Aguarde um minuto antes de enviar novamente.",
        );
        return;
      }
      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, String(Date.now()));
    } catch {
      // localStorage indisponível — segue sem limite local.
    }

    // Integração futura (Cloudflare Turnstile): validar o token aqui antes
    // do redirecionamento, usando NEXT_PUBLIC_TURNSTILE_SITE_KEY + um worker.

    const analyticsPayload = {
      formId: "lead-analysis",
      clientType: data.tipoCliente,
      workStatus: data.situacaoObra,
      workType: data.tipoObra,
      hasCno: data.possuiCno,
      hasSero: data.afericaoSero,
      source: "lead_form",
      placement: "form",
    };
    trackEvent("form_submit", analyticsPayload);
    trackEvent("request_quote", analyticsPayload);
    trackEvent("lead", analyticsPayload);

    const message = buildLeadMessage(data);
    const url = buildWhatsAppUrl(message);
    trackEvent(
      "whatsapp_redirect",
      { source: "lead_form", placement: "form" },
      true,
    );

    setStatus("redirecting");
    window.open(url, "_blank", "noopener,noreferrer");
    router.push("/obrigado/");
  };

  const invalid = (field: keyof LeadFormValues) =>
    errors[field] ? true : undefined;
  const describedBy = (field: keyof LeadFormValues) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <div ref={sectionRef}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onFocusCapture={handleFirstInteraction}
        noValidate
        aria-label="Formulário de análise inicial da obra"
        className="rounded-2xl border border-graphite-100 bg-white p-6 shadow-panel sm:p-10"
      >
        {/* Honeypot invisível (anti-spam) */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Não preencha este campo</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {/* Nome */}
          <div className="sm:col-span-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input
              id="nome"
              autoComplete="name"
              placeholder="Seu nome"
              aria-invalid={invalid("nome")}
              aria-describedby={describedBy("nome")}
              {...register("nome")}
            />
            <FieldError id="nome-error" message={errors.nome?.message} />
          </div>

          {/* Telefone */}
          <div>
            <Label htmlFor="telefone">Telefone com WhatsApp *</Label>
            <Input
              id="telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(11) 91234-5678"
              aria-invalid={invalid("telefone")}
              aria-describedby={describedBy("telefone")}
              {...register("telefone")}
              onChange={(e) =>
                setValue("telefone", formatPhoneBR(e.target.value))
              }
            />
            <FieldError id="telefone-error" message={errors.telefone?.message} />
          </div>

          {/* E-mail */}
          <div>
            <Label htmlFor="email">E-mail (opcional)</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              aria-invalid={invalid("email")}
              aria-describedby={describedBy("email")}
              {...register("email")}
            />
            <FieldError id="email-error" message={errors.email?.message} />
          </div>

          {/* Cidade */}
          <div>
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              autoComplete="address-level2"
              placeholder="Sua cidade"
              aria-invalid={invalid("cidade")}
              aria-describedby={describedBy("cidade")}
              {...register("cidade")}
            />
            <FieldError id="cidade-error" message={errors.cidade?.message} />
          </div>

          {/* Estado */}
          <div>
            <Label htmlFor="estado">Estado *</Label>
            <Select
              id="estado"
              aria-invalid={invalid("estado")}
              aria-describedby={describedBy("estado")}
              defaultValue=""
              {...register("estado")}
            >
              <option value="" disabled>
                Selecione a UF
              </option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </Select>
            <FieldError id="estado-error" message={errors.estado?.message} />
          </div>

          {/* Tipo de cliente */}
          <div>
            <Label htmlFor="tipoCliente">Tipo de cliente *</Label>
            <Select
              id="tipoCliente"
              aria-invalid={invalid("tipoCliente")}
              aria-describedby={describedBy("tipoCliente")}
              defaultValue=""
              {...register("tipoCliente")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {TIPOS_CLIENTE.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Select>
            <FieldError
              id="tipoCliente-error"
              message={errors.tipoCliente?.message}
            />
          </div>

          {/* Situação da obra */}
          <div>
            <Label htmlFor="situacaoObra">Situação da obra *</Label>
            <Select
              id="situacaoObra"
              aria-invalid={invalid("situacaoObra")}
              aria-describedby={describedBy("situacaoObra")}
              defaultValue=""
              {...register("situacaoObra")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {SITUACOES_OBRA.map((situacao) => (
                <option key={situacao} value={situacao}>
                  {situacao}
                </option>
              ))}
            </Select>
            <FieldError
              id="situacaoObra-error"
              message={errors.situacaoObra?.message}
            />
          </div>

          {/* Tipo da obra */}
          <div>
            <Label htmlFor="tipoObra">Tipo da obra *</Label>
            <Select
              id="tipoObra"
              aria-invalid={invalid("tipoObra")}
              aria-describedby={describedBy("tipoObra")}
              defaultValue=""
              {...register("tipoObra")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {TIPOS_OBRA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Select>
            <FieldError id="tipoObra-error" message={errors.tipoObra?.message} />
          </div>

          {/* Área */}
          <div>
            <Label htmlFor="area">Área aproximada (m²) *</Label>
            <Input
              id="area"
              inputMode="decimal"
              placeholder="Ex.: 250"
              aria-invalid={invalid("area")}
              aria-describedby={describedBy("area")}
              {...register("area")}
            />
            <FieldError id="area-error" message={errors.area?.message} />
          </div>

          {/* CNO */}
          <div>
            <Label htmlFor="possuiCno">Possui CNO? *</Label>
            <Select
              id="possuiCno"
              aria-invalid={invalid("possuiCno")}
              aria-describedby={describedBy("possuiCno")}
              defaultValue=""
              {...register("possuiCno")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {OPCOES_SIM_NAO_NAOSEI.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </Select>
            <FieldError
              id="possuiCno-error"
              message={errors.possuiCno?.message}
            />
          </div>

          {/* SERO */}
          <div>
            <Label htmlFor="afericaoSero">Já realizou aferição no SERO? *</Label>
            <Select
              id="afericaoSero"
              aria-invalid={invalid("afericaoSero")}
              aria-describedby={describedBy("afericaoSero")}
              defaultValue=""
              {...register("afericaoSero")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {OPCOES_SIM_NAO_NAOSEI.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </Select>
            <FieldError
              id="afericaoSero-error"
              message={errors.afericaoSero?.message}
            />
          </div>

          {/* Origem */}
          <div>
            <Label htmlFor="origem">Como conheceu a CIFRA? *</Label>
            <Select
              id="origem"
              aria-invalid={invalid("origem")}
              aria-describedby={describedBy("origem")}
              defaultValue=""
              {...register("origem")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {ORIGENS.map((origem) => (
                <option key={origem} value={origem}>
                  {origem}
                </option>
              ))}
            </Select>
            <FieldError id="origem-error" message={errors.origem?.message} />
          </div>

          {/* Datas */}
          <div>
            <Label htmlFor="dataInicio">Início da obra (opcional)</Label>
            <Input
              id="dataInicio"
              placeholder="Ex.: 03/2023"
              aria-invalid={invalid("dataInicio")}
              aria-describedby={describedBy("dataInicio")}
              {...register("dataInicio")}
            />
            <FieldError
              id="dataInicio-error"
              message={errors.dataInicio?.message}
            />
          </div>
          <div>
            <Label htmlFor="dataConclusao">Conclusão da obra (opcional)</Label>
            <Input
              id="dataConclusao"
              placeholder="Ex.: 12/2024"
              aria-invalid={invalid("dataConclusao")}
              aria-describedby={describedBy("dataConclusao")}
              {...register("dataConclusao")}
            />
            <FieldError
              id="dataConclusao-error"
              message={errors.dataConclusao?.message}
            />
          </div>

          {/* Valor de INSS */}
          <div className="sm:col-span-2">
            <Label htmlFor="valorInss">
              Valor de INSS apresentado, caso exista (opcional)
            </Label>
            <Input
              id="valorInss"
              inputMode="decimal"
              placeholder="Ex.: 25.000,00"
              aria-invalid={invalid("valorInss")}
              aria-describedby={describedBy("valorInss")}
              {...register("valorInss")}
            />
            <FieldError
              id="valorInss-error"
              message={errors.valorInss?.message}
            />
          </div>

          {/* Observações */}
          <div className="sm:col-span-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Conte brevemente a situação da sua obra"
              aria-invalid={invalid("observacoes")}
              aria-describedby={describedBy("observacoes")}
              {...register("observacoes")}
            />
            <FieldError
              id="observacoes-error"
              message={errors.observacoes?.message}
            />
          </div>

          {/* Consentimento LGPD */}
          <div className="sm:col-span-2">
            <div className="flex items-start gap-3 rounded-xl bg-cream p-4">
              <Checkbox
                id="aceitePrivacidade"
                aria-invalid={invalid("aceitePrivacidade")}
                aria-describedby={describedBy("aceitePrivacidade")}
                {...register("aceitePrivacidade")}
              />
              <label
                htmlFor="aceitePrivacidade"
                className="cursor-pointer text-sm leading-relaxed text-graphite-700"
              >
                Autorizo a CIFRA a entrar em contato comigo pelos dados
                informados e declaro que li a{" "}
                <Link
                  href="/politica-de-privacidade/"
                  target="_blank"
                  className="font-semibold text-pine-700 underline underline-offset-2"
                >
                  Política de Privacidade
                </Link>
                .
              </label>
            </div>
            <FieldError
              id="aceitePrivacidade-error"
              message={errors.aceitePrivacidade?.message}
            />
          </div>
        </div>

        {blockMessage && (
          <p
            role="alert"
            className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {blockMessage}
          </p>
        )}

        {status === "redirecting" && (
          <p
            role="status"
            className="mt-5 flex items-center gap-2 rounded-lg bg-sage-50 px-4 py-3 text-sm font-semibold text-pine-800"
          >
            <CircleCheckBig aria-hidden="true" className="size-4" />
            Dados organizados! Abrindo o WhatsApp da CIFRA…
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || status === "redirecting"}
            className="w-full sm:w-auto"
          >
            {status === "redirecting" ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin" />
                Redirecionando…
              </>
            ) : (
              <>
                Enviar e abrir WhatsApp
                <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
          <p className="flex items-center gap-2 text-xs text-graphite-400">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
            Seus dados são usados apenas para este atendimento.
          </p>
        </div>
      </form>
    </div>
  );
}
