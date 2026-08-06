// Catálogo central de todas as ferramentas do sistema CIFRA.
// Edite aqui para adicionar, reordenar ou alterar o status de qualquer ferramenta.

export type ToolStatus = "disponivel" | "em-breve";

export interface Tool {
  id: string;
  label: string;
  description: string;
  href: string;
  status: ToolStatus;
  icon: string; // emoji ou nome de ícone lucide
}

export interface ToolCategory {
  id: string;
  label: string;
  tools: Tool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "simuladores",
    label: "Simuladores",
    tools: [
      {
        id: "obra-predial",
        label: "Obra Predial",
        description: "Simula o INSS de obras prediais com fator de ajuste e planejamento DCTFWeb.",
        href: "/simulador-obra-predial",
        status: "disponivel",
        icon: "Building2",
      },
      {
        id: "obra-nao-predial",
        label: "Obra Não Predial",
        description: "Simula o INSS de serviços e obras não prediais com tabela SERO.",
        href: "/em-breve/obra-nao-predial",
        status: "em-breve",
        icon: "HardHat",
      },
      {
        id: "reforma-tributaria",
        label: "Reforma Tributária (IBS/CBS)",
        description: "Simulador de impacto da Reforma Tributária para obras e serviços.",
        href: "/simulador-reforma-tributaria",
        status: "disponivel",
        icon: "Scale",
      },
    ],
  },
  {
    id: "calculadoras",
    label: "Calculadoras",
    tools: [
      {
        id: "reducao-irpf",
        label: "Redução de IRPF",
        description: "Calcula a redução do IRPF com base na Lei 15.270/2025.",
        href: "/calculadora-reducao-irpf",
        status: "disponivel",
        icon: "Calculator",
      },
      {
        id: "fator-ajuste",
        label: "Fator de Ajuste",
        description: "Calcula o fator de ajuste e os créditos mínimos para aferição.",
        href: "/em-breve/fator-ajuste",
        status: "em-breve",
        icon: "SlidersHorizontal",
      },
      {
        id: "esocial",
        label: "eSocial",
        description: "Calculadora de obrigações e competências do eSocial para obras.",
        href: "/em-breve/esocial",
        status: "em-breve",
        icon: "FileText",
      },
      {
        id: "gps-espontanea",
        label: "GPS Espontânea",
        description: "Calcula GPS espontânea com multa e juros automáticos.",
        href: "/em-breve/gps-espontanea",
        status: "em-breve",
        icon: "Receipt",
      },
      {
        id: "gfip",
        label: "GFIP",
        description: "Geração e conferência de GFIP para obras de construção civil.",
        href: "/em-breve/gfip",
        status: "em-breve",
        icon: "ClipboardList",
      },
      {
        id: "decadencia",
        label: "Decadência",
        description: "Calcula prazos de decadência e prescrição de créditos tributários.",
        href: "/em-breve/decadencia",
        status: "em-breve",
        icon: "Clock",
      },
      {
        id: "obras-pj",
        label: "Obras PJ",
        description: "Calculadora específica para obras de Pessoa Jurídica construtora.",
        href: "/em-breve/obras-pj",
        status: "em-breve",
        icon: "Briefcase",
      },
      {
        id: "base-calculo-irpfm",
        label: "Base de Cálculo IRPFM",
        description: "Apura a base de cálculo do IRPF sobre rendimentos mensais.",
        href: "/em-breve/base-calculo-irpfm",
        status: "em-breve",
        icon: "PieChart",
      },
      {
        id: "irpfm",
        label: "IRPFM",
        description: "Calcula o Imposto de Renda Retido na Fonte sobre rendimentos mensais.",
        href: "/em-breve/irpfm",
        status: "em-breve",
        icon: "Percent",
      },
    ],
  },
  {
    id: "automacoes",
    label: "Automações",
    tools: [
      {
        id: "contrato",
        label: "Contrato",
        description: "Gera contratos de prestação de serviços de forma automática.",
        href: "/em-breve/contrato",
        status: "em-breve",
        icon: "FileSignature",
      },
      {
        id: "formulario-captura",
        label: "Formulário de Captura",
        description: "Formulários inteligentes para captura e qualificação de leads.",
        href: "/em-breve/formulario-captura",
        status: "em-breve",
        icon: "Users",
      },
      {
        id: "proposta-servicos",
        label: "Proposta de Serviços",
        description: "Gera propostas de honorários profissionais personalizadas.",
        href: "/em-breve/proposta-servicos",
        status: "em-breve",
        icon: "Send",
      },
      {
        id: "recibos",
        label: "Recibos",
        description: "Emite recibos de honorários e pagamentos automaticamente.",
        href: "/em-breve/recibos",
        status: "em-breve",
        icon: "Printer",
      },
      {
        id: "personalizar-pdf",
        label: "Personalizar PDF",
        description: "Personaliza o layout e dados dos PDFs de memória de cálculo.",
        href: "/em-breve/personalizar-pdf",
        status: "em-breve",
        icon: "Palette",
      },
    ],
  },
];

export const ALL_TOOLS = TOOL_CATEGORIES.flatMap((c) => c.tools);
