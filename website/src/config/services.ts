import {
  BadgeCheck,
  CalendarClock,
  Calculator,
  CircleCheckBig,
  ClipboardList,
  FileSearch2,
  FileCheck2,
  FolderOpen,
  LineChart,
  Percent,
  type LucideIcon,
} from "lucide-react";

export interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Página de detalhe relacionada (sempre com trailing slash). */
  href: string;
}

export const services: ServiceCard[] = [
  {
    icon: LineChart,
    title: "Planejamento tributário de obra",
    description:
      "Organização prévia das informações e escolha do melhor caminho de apuração antes de a obra gerar custos desnecessários.",
    href: "/servicos/planejamento-tributario/",
  },
  {
    icon: Percent,
    title: "Análise de INSS de obra",
    description:
      "Estudo individual do valor de INSS incidente sobre a obra, com verificação das possibilidades previstas na legislação.",
    href: "/servicos/inss-de-obra/",
  },
  {
    icon: Calculator,
    title: "Aferição indireta",
    description:
      "Acompanhamento do cálculo por aferição indireta, considerando área, tipo, padrão da obra e informações disponíveis.",
    href: "/servicos/afericao-de-obra/",
  },
  {
    icon: FileCheck2,
    title: "Regularização no SERO",
    description:
      "Condução do processo no Serviço Eletrônico para Aferição de Obras, da preparação dos dados à transmissão.",
    href: "/servicos/sero/",
  },
  {
    icon: ClipboardList,
    title: "Cadastro Nacional de Obras , CNO",
    description:
      "Inscrição, vinculação e correção de dados da obra no CNO, evitando divergências cadastrais que travam a regularização.",
    href: "/servicos/cno/",
  },
  {
    icon: FileSearch2,
    title: "Revisão de cálculos",
    description:
      "Conferência de valores de INSS já apresentados, identificando inconsistências e oportunidades de ajuste.",
    href: "/servicos/inss-de-obra/",
  },
  {
    icon: FolderOpen,
    title: "Organização documental",
    description:
      "Levantamento e organização dos documentos da obra para dar suporte à aferição e reduzir riscos de pendências.",
    href: "/servicos/sero/",
  },
  {
    icon: BadgeCheck,
    title: "Emissão e acompanhamento de certidões",
    description:
      "Suporte na obtenção da certidão da obra e acompanhamento das pendências até a liberação para averbação.",
    href: "/servicos/sero/",
  },
  {
    icon: CalendarClock,
    title: "Consultoria para obras em andamento",
    description:
      "Orientação durante a execução para manter documentos, notas e cadastros em ordem desde o início.",
    href: "/servicos/planejamento-tributario/",
  },
  {
    icon: CircleCheckBig,
    title: "Consultoria para obras concluídas",
    description:
      "Análise e regularização de obras já finalizadas, inclusive antigas, que precisam de certidão para averbação.",
    href: "/servicos/afericao-de-obra/",
  },
];
