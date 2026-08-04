import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const CtaSection: React.FC = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8 bg-olive-500 dark:bg-olive-600 relative overflow-hidden" id="cta">
    {/* Subtle pattern overlay */}
    <div className="absolute inset-0 opacity-5">
      <div className="w-full h-full" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />
    </div>

    <motion.div
      className="container-content relative z-10 text-center space-y-8 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-tight">
        Economize tempo para focar<br />no que realmente importa
      </h2>
      <div className="space-y-4 text-white/85 text-lg leading-relaxed max-w-2xl mx-auto">
        <p>Tenha mais tempo para outras tarefas.</p>
        <p>Garanta a agilidade e a precisão que sua aferição precisa.</p>
        <p>
          Com o <strong className="text-white">INSS Obra Fácil</strong> você simplifica processos,
          economiza tempo, reduz riscos fiscais e regulariza sua obra com muito mais eficiência.
        </p>
        <p className="font-medium text-white">Comece agora.</p>
      </div>

      <a
        href="#"
        className="inline-flex items-center gap-2 bg-white text-olive-600 hover:bg-beige-100 px-8 py-4 rounded-2xl font-sans font-semibold text-base tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Quero Economizar Agora
        <ArrowRight size={18} />
      </a>
    </motion.div>
  </section>
);
