import * as React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-olive-900/80 backdrop-blur-md border-b border-beige-300 dark:border-olive-700 transition-colors">
      <nav className="container-content flex items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-medium text-olive-600 dark:text-beige-200">
            INSS Obra Fácil
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="#benefits" className="text-graphite-700 dark:text-beige-300 hover:text-olive-600 dark:hover:text-beige-100 transition-colors">
            Benefícios
          </Link>
          <Link to="#como-funciona" className="text-graphite-700 dark:text-beige-300 hover:text-olive-600 dark:hover:text-beige-100 transition-colors">
            Como funciona
          </Link>
          <Link to="#faq" className="text-graphite-700 dark:text-beige-300 hover:text-olive-600 dark:hover:text-beige-100 transition-colors">
            FAQ
          </Link>
          <ThemeToggle />
          <Button asChild className="btn-primary hidden sm:inline-flex">
            <Link to="#cta">Começar agora</Link>
          </Button>
        </div>
        {/* Mobile */}
        <button
          aria-label="Menu"
          className="md:hidden text-graphite-700 dark:text-beige-300"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-olive-800 border-t border-beige-300 dark:border-olive-700 py-4">
          <div className="flex flex-col space-y-3 px-4">
            <Link to="#benefits" onClick={() => setMobileOpen(false)} className="text-graphite-700 dark:text-beige-300 hover:text-olive-600 dark:hover:text-beige-100">
              Benefícios
            </Link>
            <Link to="#como-funciona" onClick={() => setMobileOpen(false)} className="text-graphite-700 dark:text-beige-300 hover:text-olive-600 dark:hover:text-beige-100">
              Como funciona
            </Link>
            <Link to="#faq" onClick={() => setMobileOpen(false)} className="text-graphite-700 dark:text-beige-300 hover:text-olive-600 dark:hover:text-beige-100">
              FAQ
            </Link>
            <Button asChild className="btn-primary w-full mt-2">
              <Link to="#cta" onClick={() => setMobileOpen(false)}>
                Começar agora
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
