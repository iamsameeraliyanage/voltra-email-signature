"use client";

import { LOCALES, type Locale } from "@/i18n/dictionaries";

type LanguageToggleProps = {
  locale: Locale;
  onSelect: (next: Locale) => void;
  label: string;
  names: Record<Locale, string>;
};

/**
 * A segmented control rather than a dropdown: with two languages, both options
 * stay visible and reachable in one click. Sits on the charcoal header, so the
 * active state is Apple Green with the brand's dark button label.
 */
export function LanguageToggle({
  locale,
  onSelect,
  label,
  names,
}: LanguageToggleProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-1 rounded-lg border border-rule-dark p-1"
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onSelect(code)}
            aria-pressed={active}
            title={names[code]}
            className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              active
                ? "bg-volt text-ink"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
