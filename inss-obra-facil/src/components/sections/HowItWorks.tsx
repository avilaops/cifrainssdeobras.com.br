import * as React from 'react';
import { motion } from 'framer-motion';
import { Building2, ClipboardList, Cpu, FileDown } from 'lucide-react';

const steps = [
  { num: 1, title: 'Cadastre sua obra', desc: 'Informe os dados do CNO e do responsável.', icon: Building2 },
  { num: 2, title: 'Informe os dados básicos', desc: 'Área, tipo de obra, UF, período.', icon: ClipboardList },
  { num: 3, title: 'Algoritmo calcula tudo', desc: 'Nosso motor aplica a legislação vigente.', icon: Cpu },
  { num: 4, title: 'Receba o relatório em PDF', desc: 'Relatório completo pronto para imprimir.', icon: FileDown },
];

export const HowItWorks: React.FC = () => (
  <section className="section bg-white dark:bg-olive-800" id="como-funciona">
    <div className="container-content space-y-12">
      <div className="text-center space-y-3">
        <p className="section-label">Passo a passo</p>
        <h2 className="section-title">Como funciona</h2>
      </div>

      {/* Desktop timeline */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* connector line */}
        <div className="absolute top-10 left-[12%] right-[12%] h-px bg-beige-300 dark:bg-olive-600" />
        {steps.map((s, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center text-center w-1/4 relative z-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-olive-500 dark:bg-olive-600 flex items-center justify-center mb-4 shadow-md-olive">
              <s.icon size={28} className="text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-olive-500 dark:text-olive-400 mb-1">
              Passo {s.num}
            </span>
            <h3 className="font-serif text-lg font-medium text-graphite-900 dark:text-beige-200 mb-1">
              {s.title}
            </h3>
            <p className="text-sm text-graphite-500 dark:text-beige-400 max-w-[180px]">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile vertical timeline */}
      <div className="md:hidden space-y-8">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            className="flex gap-4 items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-olive-500 dark:bg-olive-600 flex items-center justify-center shadow-md-olive">
              <s.icon size={22} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-olive-500 dark:text-olive-400">
                Passo {s.num}
              </span>
              <h3 className="font-serif text-lg font-medium text-graphite-900 dark:text-beige-200">
                {s.title}
              </h3>
              <p className="text-sm text-graphite-500 dark:text-beige-400">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
