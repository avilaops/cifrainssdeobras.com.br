import * as React from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    // read from localStorage or default to system
    typeof window !== 'undefined'
      ? (localStorage.getItem('theme') as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : 'light'
  );

  React.useEffect(() => {
    setMounted(true);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-olive-100 dark:bg-olive-700 hover:bg-olive-200 dark:hover:bg-olive-600 transition-colors"
    >
      {theme === 'dark' ? <Sun size={20} className="text-beige-200" /> : <Moon size={20} className="text-olive-600" />}
    </button>
  );
};
