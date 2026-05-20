'use client';

import clsx from 'clsx';
import { useSyncExternalStore, type JSX } from 'react';

const themeStorageKey = 'budget-manager-theme';
const themes = ['latte', 'macchiato'] as const;

type Theme = (typeof themes)[number];

const themeLabels: Record<Theme, string> = {
  latte: 'Light',
  macchiato: 'Dark',
};

function isTheme(value: string | null): value is Theme {
  return themes.some((theme: Theme): boolean => theme === value);
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event('theme-change'));
}

function getThemeSnapshot(): Theme {
  const storedTheme = localStorage.getItem(themeStorageKey);

  return isTheme(storedTheme) ? storedTheme : 'macchiato';
}

function getServerThemeSnapshot(): Theme {
  return 'macchiato';
}

function subscribeToThemeChange(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('theme-change', onStoreChange);

  return (): void => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('theme-change', onStoreChange);
  };
}

export default function ThemeSwitcher(): JSX.Element {
  const selectedTheme = useSyncExternalStore(
    subscribeToThemeChange,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  function onThemeClick(theme: Theme): void {
    applyTheme(theme);
  }

  return (
    <div aria-label="Theme" className="rounded-lg bg-[var(--ctp-surface0)] p-2">
      <div className="grid grid-cols-2 gap-2" role="radiogroup">
        {themes.map(
          (theme: Theme): JSX.Element => (
            <button
              aria-checked={selectedTheme === theme}
              className={clsx(
                'cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                selectedTheme === theme
                  ? 'bg-[var(--ctp-blue)] text-[var(--ctp-crust)]'
                  : 'text-[var(--ctp-text)] hover:bg-[var(--ctp-blue)]/20'
              )}
              key={theme}
              onClick={(): void => onThemeClick(theme)}
              role="radio"
              type="button"
            >
              {themeLabels[theme]}
            </button>
          )
        )}
      </div>
    </div>
  );
}
