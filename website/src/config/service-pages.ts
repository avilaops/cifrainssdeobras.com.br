/**
 * Conteúdo das páginas de detalhe de serviços (/servicos/[slug]).
 * Texto informativo e responsável: nenhuma promessa de resultado.
 */

export interface ServicePageContent {
  slug: string;
  /** Nome curto usado em menus e breadcrumbs. */
  name: string;
  /** Título da página (tag <title>). */
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  sections: { heading: string; paragraphs: string[] }[];
  checklist: { heading: string; items: string[] };
  ctaTitle: string;
  steps?: { title: string; description: string }[];
  faq?: { question: string; answer: string }[];
  sources?: { label: string; href: string }[];
}

export const servicePages: ServicePageContent[] = [
  {
    slug: "inss-de-obra",
    name: "INSS de obra",
    metaTitle: "INSS de Obra , Análise e Revisão de Cálculos",
    metaDescription:
      "Entenda como funciona o INSS incidente sobre obras da construção civil e como a CIFRA analisa e revisa cálculos antes da regularização.",
    heroTitle: "Análise de INSS de obra",
    heroDescription:
      "Antes de aceitar qualquer valor, é importante entender como o INSS da sua obra foi , ou será , calculado. A CIFRA analisa o caso e aponta as possibilidades previstas na legislação.",
    sections: [
      {
        heading: "O que é o INSS de obra",
        paragraphs: [
          "Toda obra de construção civil gera contribuição previdenciária sobre a mão de obra empregada na execução. Para averbar a construção no cartório, vender ou financiar o imóvel e emitir certidões, o responsável precisa demonstrar à Receita Federal que essa contribuição foi apurada e recolhida corretamente.",
          "O valor pode ser apurado com base na escrituração e nos documentos da obra ou, na ausência deles, por aferição indireta , um cálculo estimado que considera área, destinação e padrão da construção. A forma de apuração e a qualidade das informações influenciam diretamente o valor final.",
        ],
      },
      {
        heading: "Como a CIFRA atua",
        paragraphs: [
          "Analisamos os dados e documentos da obra, conferimos o enquadramento aplicado (tipo, destinação, área e padrão), verificamos recolhimentos e notas fiscais que possam ser aproveitados e identificamos inconsistências no cálculo apresentado.",
          "Ao final, você recebe um diagnóstico claro: o que está correto, o que pode ser ajustado dentro da legislação e quais passos seguir para regularizar com segurança.",
        ],
      },
    ],
    checklist: {
      heading: "Essa análise é indicada quando",
      items: [
        "Você recebeu um cálculo de INSS e quer conferir o valor antes de pagar.",
        "A obra precisa de certidão para averbação, venda ou financiamento.",
        "Existem notas fiscais e recolhimentos que talvez não tenham sido considerados.",
        "A aferição foi feita e você quer avaliar a possibilidade de revisão.",
        "A obra ainda vai começar e você quer prever o custo previdenciário.",
      ],
    },
    ctaTitle: "Solicite a análise do INSS da sua obra",
  },
  {
    slug: "cno",
    name: "CNO",
    metaTitle: "CNO , Cadastro Nacional de Obras",
    metaDescription:
      "Inscrição, correção e vinculação de obras no CNO (Cadastro Nacional de Obras). A CIFRA organiza o cadastro para destravar a regularização.",
    heroTitle: "Cadastro Nacional de Obras , CNO",
    heroDescription:
      "O CNO é a porta de entrada da regularização. Dados incorretos ou divergentes no cadastro travam certidões e geram cobranças indevidas , e é aqui que muitos processos emperram.",
    sections: [
      {
        heading: "O que é o CNO",
        paragraphs: [
          "O Cadastro Nacional de Obras é o registro da obra na Receita Federal, vinculado ao CPF ou CNPJ do responsável. Ele substituiu a antiga matrícula CEI e concentra as informações que servem de base para a aferição: endereço, área, destinação, período de execução e responsáveis.",
          "A inscrição é obrigatória para obras sujeitas à regularização previdenciária e deve refletir a realidade da construção. Divergências entre o CNO, o projeto, o habite-se e a prefeitura estão entre as causas mais comuns de atraso na emissão de certidões.",
        ],
      },
      {
        heading: "Como a CIFRA atua",
        paragraphs: [
          "Fazemos a inscrição da obra no CNO, corrigimos cadastros existentes, ajustamos vínculos de responsabilidade e alinhamos as informações cadastrais com os documentos da obra antes da aferição.",
          "Com o cadastro consistente, o processo no SERO flui com menos pendências e o valor apurado tende a refletir corretamente as características da obra.",
        ],
      },
    ],
    checklist: {
      heading: "Situações em que ajudamos",
      items: [
        "Obra ainda sem inscrição no CNO.",
        "Cadastro com área, destinação ou período incorretos.",
        "Obra antiga registrada na matrícula CEI que precisa de migração.",
        "Divergências entre CNO, projeto aprovado e habite-se.",
        "Troca de responsável pela obra (compra, herança, incorporação).",
      ],
    },
    ctaTitle: "Regularize o cadastro da sua obra",
  },
  {
    slug: "sero",
    name: "SERO",
    metaTitle: "SERO , Regularização Eletrônica de Obras",
    metaDescription:
      "Acompanhamento completo no SERO, o Serviço Eletrônico para Aferição de Obras da Receita Federal, da preparação dos dados à certidão.",
    heroTitle: "Regularização no SERO",
    heroDescription:
      "O SERO é o sistema em que a obra é aferida e regularizada. Preencher sem planejamento pode consolidar um valor maior do que o necessário , e revisar depois é sempre mais difícil.",
    sections: [
      {
        heading: "O que é o SERO",
        paragraphs: [
          "O Serviço Eletrônico para Aferição de Obras é a plataforma da Receita Federal em que o responsável declara as informações da construção, apura o valor devido de contribuição previdenciária e encaminha a regularização para obter a certidão da obra.",
          "As informações declaradas no SERO geram efeitos imediatos: definem o valor a recolher e vinculam o responsável às declarações transmitidas. Por isso, a preparação dos dados e documentos antes da transmissão é a etapa mais importante do processo.",
        ],
      },
      {
        heading: "Como a CIFRA atua",
        paragraphs: [
          "Organizamos previamente os documentos e as informações da obra, simulamos o enquadramento correto, orientamos sobre notas fiscais e recolhimentos aproveitáveis e conduzimos a transmissão no sistema com acompanhamento de cada pendência até a liberação da certidão.",
          "Se a aferição já foi transmitida, avaliamos a situação e orientamos sobre os caminhos de revisão possíveis dentro das regras vigentes.",
        ],
      },
    ],
    checklist: {
      heading: "O acompanhamento inclui",
      items: [
        "Conferência prévia de cadastro, documentos e enquadramento.",
        "Organização das notas fiscais e recolhimentos existentes.",
        "Transmissão da aferição com os dados corretos.",
        "Acompanhamento de pendências junto ao sistema.",
        "Suporte até a emissão da certidão da obra.",
      ],
    },
    ctaTitle: "Conduza sua regularização no SERO com apoio técnico",
  },
  {
    slug: "afericao-de-obra",
    name: "Aferição de obra",
    metaTitle: "Aferição de obra no SERO: etapas e documentos",
    metaDescription:
      "Entenda como fazer a aferição de obra no SERO, quais documentos reunir e como conferir áreas e cálculos. Solicite a análise do INSS da sua construção.",
    heroTitle: "Aferição de obra no SERO",
    heroDescription:
      "A aferição apura as contribuições previdenciárias da construção. Entenda as etapas, organize os documentos e confira as informações da obra antes de concluir o procedimento na Receita Federal.",
    sections: [
      {
        heading: "Como funciona a aferição",
        paragraphs: [
          "O Serviço Eletrônico para Aferição de Obras, o SERO, utiliza os dados da construção cadastrada no CNO para apurar as contribuições relacionadas à mão de obra. A regularização é uma etapa do processo para obter a certidão fiscal da obra.",
          "Segundo a Receita Federal, obras de responsabilidade de pessoa física são regularizadas por aferição indireta. Para pessoas jurídicas, a forma de apuração depende, entre outros requisitos, da existência de contabilidade regular e formalizada. O enquadramento deve ser conferido antes do preenchimento.",
        ],
      },
      {
        heading: "Como a CIFRA atua",
        paragraphs: [
          "Antes da aferição, verificamos o enquadramento e reunimos os documentos que podem reduzir a base de cálculo dentro da lei. Durante o processo, conferimos as informações declaradas e acompanhamos o resultado.",
          "Para obras que já passaram por aferição, analisamos o cálculo apresentado e orientamos sobre a viabilidade de revisão, sempre com transparência sobre o que é ou não possível no seu caso.",
        ],
      },
    ],
    checklist: {
      heading: "Fatores que influenciam o valor",
      items: [
        "Área construída e destinação do imóvel.",
        "Tipo e padrão construtivo da obra.",
        "Período de execução e data de conclusão.",
        "Notas fiscais e recolhimentos já realizados.",
        "Qualidade e consistência da documentação.",
      ],
    },
    ctaTitle: "Solicite a análise e o orçamento da aferição da sua obra",
    steps: [
      {
        title: "Confira o cadastro e reúna os documentos",
        description: "Verifique o CNO, o alvará, o habite-se ou documentos equivalentes e as informações de execução. Separe também os registros e recolhimentos de mão de obra existentes.",
      },
      {
        title: "Revise as características e as áreas da obra",
        description: "Confira destinação, tipo, datas e áreas informadas. Identifique se a regularização é da obra completa ou de uma parte e considere as regularizações anteriores.",
      },
      {
        title: "Confira a memória de cálculo no SERO",
        description: "Analise o enquadramento e os créditos admitidos nas regras antes da transmissão. Notas fiscais e outros documentos só podem ser considerados nas situações previstas para cada caso.",
      },
      {
        title: "Acompanhe a declaração e a regularidade fiscal",
        description: "A conclusão da aferição gera a DCTFWeb Aferição de Obras. Os próximos passos dependem do resultado, dos valores devidos e de eventuais pendências para a emissão da certidão.",
      },
    ],
    faq: [
      {
        question: "A aferição usa a área construída ou a área total do terreno?",
        answer: "A obra deve ser descrita pelas áreas do projeto e do cadastro no CNO, com o enquadramento de áreas principais e complementares. A metragem do terreno, sozinha, não representa a área da construção. Na regularização parcial, também é preciso identificar a parte que será aferida.",
      },
      {
        question: "Uma obra de até 70 m² tem isenção automaticamente?",
        answer: "A área isoladamente não define a dispensa. A Receita estabelece condições conjuntas relacionadas ao responsável, à finalidade e ao tipo da residência e à utilização de mão de obra remunerada. É necessário conferir os requisitos aplicáveis à construção antes de concluir que não há contribuição devida.",
      },
      {
        question: "O que fazer se ampliei a construção depois da aferição?",
        answer: "Reúna os documentos da ampliação e da regularização anterior. É preciso conferir o cadastro no CNO e a situação das aferições existentes para identificar o procedimento adequado. A Receita prevê retificação de aferições, mas a aplicação desse procedimento depende do caso.",
      },
      {
        question: "Como solicitar um orçamento de aferição de obra?",
        answer: "Informe a localização, a área construída, a fase e o período de execução da obra, além da existência de CNO ou cálculo anterior. Pelo formulário de análise, a CIFRA recebe os dados iniciais para avaliar o escopo do atendimento e orientar o orçamento e os próximos passos.",
      },
    ],
    sources: [
      { label: "Receita Federal: aferição de obras no SERO", href: "https://www.gov.br/receitafederal/pt-br/assuntos/construcao-civil/sero" },
      { label: "Receita Federal: procedimentos para regularizar a obra", href: "https://www.gov.br/receitafederal/pt-br/assuntos/construcao-civil/sero/afericao/como-regularizar" },
      { label: "Manual oficial do SERO, incluindo áreas e situações de dispensa", href: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/manuais/manual-do-sero/manual-do-sero.pdf" },
      { label: "Receita Federal: como corrigir uma aferição realizada", href: "https://www.gov.br/receitafederal/pt-br/assuntos/construcao-civil/sero/retificar" },
    ],
  },
  {
    slug: "planejamento-tributario",
    name: "Planejamento tributário",
    metaTitle: "Planejamento Tributário de Obra",
    metaDescription:
      "Planejamento tributário para obras: organize documentos e decisões antes da execução e evite custos previdenciários desnecessários.",
    heroTitle: "Planejamento tributário de obra",
    heroDescription:
      "O melhor momento para cuidar do INSS da obra é antes de ela começar. Decisões simples tomadas no início evitam custos e retrabalho na hora de regularizar.",
    sections: [
      {
        heading: "Por que planejar antes de construir",
        paragraphs: [
          "O valor previdenciário de uma obra não depende apenas do que foi construído, mas de como a construção foi documentada: contratos, notas fiscais de materiais e serviços, folhas de pagamento, cadastros e prazos. Sem organização, o responsável frequentemente acaba na aferição indireta , que estima valores e pode custar mais caro.",
          "Com planejamento, é possível definir desde o início a forma de contratação da mão de obra, o registro correto no CNO e a rotina de guarda de documentos, criando as condições para uma apuração justa e sem surpresas ao final.",
        ],
      },
      {
        heading: "Como a CIFRA atua",
        paragraphs: [
          "Avaliamos o projeto e o perfil da obra, orientamos sobre contratações e documentação, estruturamos o cadastro e definimos um plano de acompanhamento para os meses de execução.",
          "O resultado é um caminho claro do início da obra até a certidão, com o custo previdenciário previsto no orçamento , e não descoberto no final.",
        ],
      },
    ],
    checklist: {
      heading: "O planejamento aborda",
      items: [
        "Forma de contratação da mão de obra e seus reflexos tributários.",
        "Inscrição e parametrização correta no CNO.",
        "Rotina de organização de notas fiscais e comprovantes.",
        "Previsão do custo previdenciário no orçamento da obra.",
        "Cronograma de obrigações até a regularização final.",
      ],
    },
    ctaTitle: "Comece sua obra com o tributário planejado",
  },
];

export function getServicePage(slug: string): ServicePageContent | undefined {
  return servicePages.find((page) => page.slug === slug);
}
