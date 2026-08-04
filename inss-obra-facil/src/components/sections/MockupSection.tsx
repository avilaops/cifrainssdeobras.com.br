import * as React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import pdfMockup from '@/assets/pdf-mockup.png';

export const MockupSection: React.FC = () => (
  <section className="section bg-white dark:bg-olive-800 overflow-hidden" id="demo">
    <div className="container-content space-y-10">
      <div className="text-center space-y-3">
        <p className="section-label">Demonstração</p>
        <h2 className="section-title">Veja um exemplo do relatório</h2>
        <p className="section-subtitle max-w-xl mx-auto">
          Relatórios profissionais gerados automaticamente, prontos para apresentar ao seu cliente.
        </p>
      </div>

      <motion.div
        className="relative max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Notebook/tablet frame */}
        <div className="relative bg-graphite-900 dark:bg-olive-900 rounded-3xl p-3 pt-6 shadow-xl-olive">
          {/* Notch / camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-graphite-700 dark:bg-olive-700" />
          {/* Screen */}
          <div className="rounded-2xl overflow-hidden bg-white">
            <motion.img
              src={pdfMockup}
              alt="Exemplo de relatório PDF do INSS Obra Fácil"
              className="w-full h-auto"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              loading="lazy"
            />
          </div>
        </div>
        {/* Base stand */}
        <div className="mx-auto w-1/3 h-3 bg-graphite-700 dark:bg-olive-700 rounded-b-xl" />
        <div className="mx-auto w-1/2 h-1 bg-graphite-500 dark:bg-olive-600 rounded-b-lg" />
      </motion.div>

      <div className="text-center pt-4">
        <button className="btn-secondary inline-flex items-center gap-2">
          <Download size={18} />
          Baixar exemplo
        </button>
      </div>
    </div>
  </section>
);
