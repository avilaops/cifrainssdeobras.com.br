import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="section bg-beige-200 dark:bg-olive-900 pt-28 lg:pt-32 pb-20 lg:pb-32 overflow-hidden" id="hero">
      <div className="container-content grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Left content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="section-title text-olive-600 dark:text-beige-100">
            Planejamento Tributário de Obras<br />
            <span className="block text-olive-800 dark:text-beige-200">Inteligente</span>
          </h1>
          <p className="section-subtitle max-w-lg">
            Economize milhares de reais no INSS da sua obra com cálculos inteligentes, relatórios profissionais e regularização completa.
          </p>
          <p className="text-graphite-600 dark:text-beige-300">
            Garanta agilidade, precisão e segurança jurídica em todas as etapas da sua obra.
          </p>
          <div className="flex space-x-4 pt-4">
            <Button asChild className="btn-primary">
              <a href="#cta">Começar agora</a>
            </Button>
            <Button asChild className="btn-secondary">
              <a href="#demo">Ver demonstração</a>
            </Button>
          </div>
        </motion.div>
        {/* Right mockup */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, rotate: [0, -2, 2, -2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
        >
          {/* Background image with overlay */}
          <img
            src="/src/assets/hero-bg.png"
            alt="Arquitetura moderna em preto e branco"
            className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-3xl"
          />
          {/* Floating PDF mockup */}
          <motion.img
            src="/src/assets/pdf-mockup.png"
            alt="Mockup do relatório PDF"
            className="w-80 md:w-96 rounded-2xl shadow-lg"
            animate={{ y: [0, -16, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
};
