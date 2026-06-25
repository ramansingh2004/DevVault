'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useUIStore } from './../store/ui.store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    setMounted(true);

    // Load theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }
  }, [setTheme]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    let effectiveTheme = theme;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}