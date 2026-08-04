import * as React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/5517999999999"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco via WhatsApp"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
  >
    <FaWhatsapp size={28} />
  </a>
);
