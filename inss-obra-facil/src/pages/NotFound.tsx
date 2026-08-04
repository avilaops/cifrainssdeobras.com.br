import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="min-h-screen bg-beige-200 dark:bg-olive-900 flex items-center justify-center px-6">
    <motion.div
      className="text-center space-y-6 max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-serif text-8xl font-bold text-olive-500 dark:text-olive-400">404</h1>
      <h2 className="font-serif text-2xl font-medium text-graphite-900 dark:text-beige-200">
        Página não encontrada
      </h2>
      <p className="text-graphite-500 dark:text-beige-400">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="btn-primary inline-flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Voltar ao início
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
