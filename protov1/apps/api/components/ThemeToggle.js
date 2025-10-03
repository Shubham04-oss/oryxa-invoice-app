import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ id = 'theme-toggle' }) {
  const [theme, setTheme] = useState('dark');

  const applyTheme = (nextTheme) => {
    setTheme(nextTheme);

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);

    if (nextTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  };

  return (
    <button
      id={id}
      type="button"
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={theme === 'dark'}
    >
      <span className={`theme-toggle-icon${theme === 'light' ? ' active' : ''}`}>
        <Sun size={15} />
      </span>
      <span className={`theme-toggle-icon${theme === 'dark' ? ' active' : ''}`}>
        <Moon size={15} />
      </span>
    </button>
  );
}
