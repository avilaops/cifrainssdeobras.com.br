import * as React from 'react';
import { Mail, Phone } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export const Footer: React.FC = () => (
  <footer className="bg-graphite-900 dark:bg-olive-900 border-t border-graphite-700 dark:border-olive-700 py-16 px-6 lg:px-8">
    <div className="container-content">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <span className="font-serif text-2xl font-medium text-beige-200">
            INSS Obra Fácil
          </span>
          <p className="text-sm text-graphite-400 dark:text-beige-400 leading-relaxed">
            Planejamento tributário inteligente para obras de construção civil.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-graphite-400 dark:text-beige-400">
            Produto
          </h4>
          <ul className="space-y-2">
            {['Funcionalidades', 'Planos', 'Contato'].map((link) => (
              <li key={link}>
                <a href="#" className="text-sm text-graphite-400 dark:text-beige-400 hover:text-beige-100 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-graphite-400 dark:text-beige-400">
            Legal
          </h4>
          <ul className="space-y-2">
            {['Política de Privacidade', 'Termos de Uso'].map((link) => (
              <li key={link}>
                <a href="#" className="text-sm text-graphite-400 dark:text-beige-400 hover:text-beige-100 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-graphite-400 dark:text-beige-400">
            Contato
          </h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="flex items-center gap-2 text-sm text-graphite-400 dark:text-beige-400 hover:text-beige-100 transition-colors">
                <FaInstagram size={16} /> Instagram
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 text-sm text-graphite-400 dark:text-beige-400 hover:text-beige-100 transition-colors">
                <FaWhatsapp size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 text-sm text-graphite-400 dark:text-beige-400 hover:text-beige-100 transition-colors">
                <Mail size={16} /> E-mail
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-graphite-700 dark:border-olive-700 text-center text-xs text-graphite-500 dark:text-beige-400">
        © {new Date().getFullYear()} INSS Obra Fácil. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);
