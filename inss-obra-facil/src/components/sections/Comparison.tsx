import * as React from 'react';
import { motion } from 'framer-motion';
import { X, Check, AlertTriangle, Calculator, FileText, Zap, ShieldCheck } from 'lucide-react';

const traditional = [
  { text: 'Planilhas confusas', icon: X },
  { text: 'Cálculos manuais', icon: X },
  { text: 'Erros frequentes', icon: X },
  { text: 'Retrabalho constante', icon: X },
  { text: 'Risco fiscal elevado', icon: X },
];

const modern = [
  { text: 'Processo automatizado', icon: Check },
  { text: 'Economia tributária real', icon: Check },
  { text: 'Relatórios instantâneos', icon: Check },
  { text: 'Muito mais segurança', icon: Check },
  { text: 'Muito mais rapidez', icon: Check },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export const Comparison: React.FC = () => (
  <section className="section bg-beige-100 dark:bg-olive-900" id="comparison">
    <div className="container-content space-y-10">
      <div className="text-center space-y-3">
        <p className="section-label">Comparativo</p>
        <h2 className="section-title">
          Quanto tempo você perde<br />fazendo isso manualmente?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {/* Traditional */}
        <motion.div
          className="rounded-3xl p-8 bg-white/60 dark:bg-olive-800/60 border border-beige-300 dark:border-olive-700 backdrop-blur-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
        >
          <h3 className="font-serif text-xl font-medium text-graphite-700 dark:text-beige-300 mb-6">
            Método Tradicional
          </h3>
          <ul className="space-y-4">
            {traditional.map((item, i) => (
              <motion.li key={i} className="flex items-center gap-3" variants={itemVariants}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <item.icon size={16} className="text-red-500 dark:text-red-400" />
                </span>
                <span className="text-graphite-700 dark:text-beige-300">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Modern */}
        <motion.div
          className="rounded-3xl p-8 bg-olive-500 dark:bg-olive-600 border border-olive-400 dark:border-olive-500 text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
        >
          <h3 className="font-serif text-xl font-medium mb-6">
            INSS Obra Fácil
          </h3>
          <ul className="space-y-4">
            {modern.map((item, i) => (
              <motion.li key={i} className="flex items-center gap-3" variants={itemVariants}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <item.icon size={16} className="text-white" />
                </span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);
