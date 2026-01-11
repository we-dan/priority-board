import { Moon, Sun } from 'lucide-react';
import { useTheme } from './providers/theme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted/50 active:bg-muted/70 active:scale-95 transition-all duration-200 text-muted-foreground hover:text-foreground group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
      )}
    </button>
  );
}
