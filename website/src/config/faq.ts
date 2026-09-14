export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Perguntas frequentes , respostas responsáveis, sem promessa de resultado.
 * Usadas no accordion da home e no Schema.org FAQPage.
 */
export const faqItems: FaqItem[] = [
  {
    question: "O que é INSS de obra?",
    answer:
      "É a contribuição previdenciária incidente sobre a mão de obra empregada na construção civil. Para regularizar a obra e obter a certidão necessária à averbação do imóvel no cartório, é preciso apurar e recolher esse valor conforme as regras da Receita Federal.",
  },
  {
    question: "Quem precisa regularizar o INSS da construção?",
    answer:
      "Em regra, o responsável pela obra: proprietário do imóvel, dono da obra, incorporadora ou empresa construtora, seja pessoa física ou jurídica. A regularização costuma ser exigida para averbar a construção, vender ou financiar o imóvel e emitir certidões.",
  },
  {
    question: "O que é o CNO?",
    answer:
      "O Cadastro Nacional de Obras (CNO) é o registro da obra na Receita Federal, vinculado ao CPF ou CNPJ do responsável. Ele substituiu a antiga matrícula CEI e é a base de todo o processo de regularização , dados incorretos no CNO costumam gerar divergências e atrasos.",
  },
  {
    question: "O que é o SERO?",
    answer:
      "O SERO (Serviço Eletrônico para Aferição de Obras) é o sistema da Receita Federal em que a obra é aferida e regularizada. É por ele que se apuram os valores devidos e se encaminha a emissão da certidão da obra.",
  },
  {
    question: "É possível reduzir o valor do INSS da obra?",
    answer:
      "Em muitos casos a legislação prevê situações que podem diminuir o valor apurado, como o aproveitamento de notas fiscais e recolhimentos já realizados, o enquadramento correto do tipo e do padrão da obra e a observância de prazos legais. Cada caso depende das características e dos documentos da obra , por isso a análise é sempre individual.",
  },
  {
    question: "A análise garante redução?",
    answer:
      "Não. Nenhuma consultoria séria pode garantir redução antes de analisar o caso. O que a CIFRA garante é uma análise técnica e criteriosa, apontando com transparência as possibilidades reais previstas na legislação para a sua obra.",
  },
  {
    question: "Quais documentos são necessários?",
    answer:
      "Depende da situação da obra. Em geral: documentos do responsável, informações do imóvel, projeto ou habite-se, alvará, notas fiscais de materiais e serviços, folhas de pagamento e recolhimentos anteriores, quando existirem. Na análise preliminar indicamos exatamente o que se aplica ao seu caso.",
  },
  {
    question: "A CIFRA atende em todo o Brasil?",
    answer:
      "Sim. O processo de regularização é eletrônico e o atendimento da CIFRA é remoto, o que permite atender clientes de qualquer cidade do país pelo WhatsApp, e-mail e videochamada.",
  },
  {
    question: "Posso contratar mesmo com a obra já concluída?",
    answer:
      "Sim. Obras concluídas , inclusive antigas , podem e devem ser analisadas antes da aferição. Em muitos casos é justamente nessa etapa que aparecem as melhores oportunidades de ajuste dentro da legislação.",
  },
  {
    question: "Arquitetos, engenheiros e contadores podem indicar clientes?",
    answer:
      "Sim. A CIFRA atua em parceria com arquitetos, engenheiros e contadores, cuidando apenas da parte tributária da obra, sem concorrer com o serviço principal desses profissionais. Fale conosco para conhecer o modelo de parceria.",
  },
  {
    question: "Quanto tempo leva o processo?",
    answer:
      "Varia conforme a situação da obra, a documentação disponível e os prazos dos órgãos envolvidos. Após a análise preliminar, apresentamos uma estimativa realista para o seu caso e mantemos você informado em todas as etapas.",
  },
  {
    question: "Como solicitar uma análise?",
    answer:
      "Preencha o formulário de análise inicial aqui do site. Ao enviar, você será direcionado ao nosso WhatsApp com os dados da obra já organizados, e a equipe dará sequência ao atendimento.",
  },
];
