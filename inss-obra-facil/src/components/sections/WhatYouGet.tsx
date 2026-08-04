import * as React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  BarChart3,
  Calculator,
  Scale,
  History,
  LayoutDashboard,
  Users,
  FileBadge,
} from 'lucide-react';

const features = [
  { title: 'Relatório PDF personalizado', icon: FileText },
  { title: 'Simulação de economia', icon: BarChart3 },
  { title: 'Cálculo do INSS', icon: Calculator },
  { title: 'Planejamento tributário', icon: Scale },
  { title: 'Histórico das obras', icon: History },
  { title: 'Painel administrativo', icon: LayoutDashboard },
  { title: 'Gestão de clientes', icon: Users },
  { title: 'Emissão de documentos', icon: FileBadge },
];

export const WhatYouGet: React.FC = () => (
  <section className="section bg-beige-100 dark:bg-olive-900" id="recursos">
    <div className="container-content space-y-10">
      <div className="text-center space-y-3">
        <p className="section-label">Recursos</p>
        <h2 className="section-title">O que você recebe</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="card-hover p-6 rounded-3xl flex flex-col items-start gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <div className="w-11 h-11 rounded-2xl bg-olive-100 dark:bg-olive-700 flex items-center justify-center">
              <f.icon size={20} className="text-olive-600 dark:text-beige-200" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans text-base font-medium text-graphite-900 dark:text-beige-200">
              {f.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
