import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const benefits = [
  { title: 'Economize até dezenas de milhares de reais em impostos', icon: 'CheckCircle' },
  { title: 'Regularize sua obra rapidamente', icon: 'CheckCircle' },
  { title: 'Gere relatórios profissionais em PDF', icon: 'CheckCircle' },
  { title: 'Planejamento tributário automatizado', icon: 'CheckCircle' },
  { title: 'Interface simples', icon: 'CheckCircle' },
  { title: 'Atualizações conforme legislação', icon: 'CheckCircle' },
];

export const Benefits: React.FC = () => (
  <section className="section bg-white dark:bg-olive-800" id="benefits">
    <div className="container-content text-center space-y-8">
      <h2 className="section-title text-olive-600 dark:text-beige-100">Por que escolher o INSS Obra Fácil?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            className="card-hover p-6 rounded-3xl bg-beige-100 dark:bg-olive-700 border border-beige-300 dark:border-olive-600"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-center mb-4 text-olive-500 dark:text-beige-200">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-medium text-graphite-800 dark:text-beige-200">{b.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
