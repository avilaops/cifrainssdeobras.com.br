import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const faqs = [
  {
    q: 'O cálculo segue a legislação?',
    a: 'Sim. Todo o motor de cálculo é baseado na IN RFB nº 2.021/2021 e nas tabelas oficiais do SERO/eSocial. As alíquotas e fatores de ajuste são atualizados conforme publicações da Receita Federal.',
  },
  {
    q: 'Posso usar para obras pequenas?',
    a: 'Sim! O sistema calcula corretamente para qualquer metragem — desde pequenas reformas até grandes empreendimentos. O fator de ajuste e as faixas de dedução se adaptam automaticamente.',
  },
  {
    q: 'O sistema gera PDF?',
    a: 'Sim. Você recebe um relatório profissional em PDF com todos os cálculos, comparativos de economia e planejamento mensal de DCTFWeb, pronto para apresentar ao seu cliente.',
  },
  {
    q: 'Posso cadastrar várias obras?',
    a: 'Sim. O painel administrativo permite cadastrar e gerenciar múltiplas obras simultaneamente, cada uma com seu próprio planejamento tributário e histórico.',
  },
  {
    q: 'Existe suporte?',
    a: 'Sim. Oferecemos suporte via WhatsApp e e-mail com tempo de resposta rápido. Nosso time entende tanto a parte técnica quanto a legislação tributária de obras.',
  },
];

export const FAQ: React.FC = () => (
  <section className="section bg-white dark:bg-olive-800" id="faq">
    <div className="container-content max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <p className="section-label">Dúvidas</p>
        <h2 className="section-title">Perguntas frequentes</h2>
      </div>

      <Accordion.Root type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <Accordion.Item
            key={i}
            value={`faq-${i}`}
            className="rounded-2xl border border-beige-300 dark:border-olive-700 bg-beige-100 dark:bg-olive-700/50 overflow-hidden"
          >
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left group cursor-pointer">
                <span className="font-sans font-medium text-graphite-900 dark:text-beige-200 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 text-olive-500 dark:text-olive-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
              <div className="px-6 pb-5 text-graphite-600 dark:text-beige-400 leading-relaxed">
                {faq.a}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  </section>
);
