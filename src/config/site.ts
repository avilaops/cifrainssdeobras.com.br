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
  url: "https://cifrainssdeobra.com.br",
  domain: "cifrainssdeobra.com.br",

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
    cnpj: "", // ex.: "00.000.000/0001-00"
    address: "", // endereço físico, se houver
    phone: "", // telefone fixo exibível, se houver
  },

  nav: [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre/" },
    { label: "Serviços", href: "/servicos/" },
    { label: "Como funciona", href: "/#como-funciona" },
    { label: "Para quem é", href: "/#para-quem" },
    { label: "Dúvidas", href: "/#duvidas" },
    { label: "Contato", href: "/contato/" },
  ],

  footerLegal:
    "A CIFRA presta serviços de consultoria tributária e administrativa relacionados à regularização de obras. Resultados e possibilidades de economia dependem da análise individual de cada caso.",
} as const;

export type SiteConfig = typeof siteConfig;
