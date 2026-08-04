/**
 * Configuração central do site.
 * Dados ainda não fornecidos pela empresa ficam como placeholders explícitos
 * ("" ou null) e simplesmente não são exibidos na interface.
 */
export const siteConfig = {
  name: "CIFRA",
  legalName: "CIFRA — Consultoria Tributária de Obra",
  shortDescription:
    "Consultoria especializada em INSS de obra, CNO, SERO, aferição e regularização tributária de obras em todo o Brasil.",
  url: "https://cifrainssdeobras.com.br",
  domain: "cifrainssdeobras.com.br",
  calculatorUrl: process.env.NEXT_PUBLIC_CALCULADORA_URL || "/calculadora",

  seo: {
    title: "CIFRA | Consultoria de INSS de Obra e Regularização",
    titleTemplate: "%s | CIFRA — Consultoria Tributária de Obra",
    description:
      "Consultoria especializada em INSS de obra, CNO, SERO, aferição e regularização tributária. Solicite uma análise da sua obra com a CIFRA.",
    keywords: [
      "INSS de obra",
      "consultoria INSS de obra",
      "regularização de obra",
      "aferição de obra",
      "SERO",
      "CNO",
      "reduzir INSS de obra",
      "planejamento tributário de obra",
      "regularizar construção",
      "consultoria tributária construção civil",
    ],
    locale: "pt_BR",
  },

  /**
   * Dados empresariais — preencher somente com informações reais.
   * Enquanto vazios, nada é exibido nem incluído no Schema.org.
   */
  company: {
    cnpj: "", // Será preenchido quando o CNPJ for emitido
    address: "Rua Oscar Adami Sobrinho, 4464, Votuporanga - SP",
    phone: "+55 17 99743-2052", 
  },

  nav: [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre/" },
    { label: "Serviços", href: "/servicos/" },
    { label: "Calculadora", href: process.env.NEXT_PUBLIC_CALCULADORA_URL || "/calculadora" },
    { label: "Como funciona", href: "/#como-funciona" },
    { label: "Parceiros", href: "/parceiros/" },
    { label: "Dúvidas", href: "/#duvidas" },
    { label: "Contato", href: "/contato/" },
  ],

  footerLegal:
    "A CIFRA presta serviços de consultoria tributária e administrativa relacionados à regularização de obras. Resultados e possibilidades de economia dependem da análise individual de cada caso.",
} as const;

export type SiteConfig = typeof siteConfig;
