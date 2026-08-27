"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_LOCALE,
  DICTIONARIES,
  type Dictionary,
  type Locale,
} from "./dictionaries";

const STORAGE_KEY = "voltra-locale";
const listeners = new Set<() => void>();

/**
 * A tiny external store over localStorage. Read through useSyncExternalStore
 * rather than an effect so the server renders the default locale and the
 * browser swaps in the stored one during hydration, without a cascading render.
 */
function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Keep tabs in step when the choice is made in another one.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Locale {
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : DEFAULT_LOCALE;
  } catch {
    // Private mode / storage disabled.
    return DEFAULT_LOCALE;
  }
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function setLocale(next: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisting is survivable; still notify so the UI switches.
  }
  listeners.forEach((notify) => notify());
}

export function useLocale(): {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Dictionary;
} {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { locale, setLocale, t: DICTIONARIES[locale] };
}
