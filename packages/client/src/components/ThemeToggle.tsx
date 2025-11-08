import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full glass-card hover:shadow-lg hover:shadow-primary/20 hover:scale-110 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-foreground group-hover:rotate-12 transition-transform duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-foreground group-hover:rotate-180 transition-transform duration-300" />
      )}
    </button>
  );
}
