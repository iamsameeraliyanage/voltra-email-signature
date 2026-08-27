"use client";

import Image from "next/image";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

type SiteHeaderProps = {
  t: Dictionary;
  locale: Locale;
  onSelectLocale: (next: Locale) => void;
};

/**
 * Charcoal Heather bar carrying the wordmark — the brand's own dark surface,
 * and the same colour as the tile the signature is built on.
 */
export function SiteHeader({ t, locale, onSelectLocale }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-charcoal">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/*
            The asset is a 256px charcoal square with the wordmark filling only
            its middle third. Its background is Charcoal Heather — the same
            colour as this bar — so scaling it up proportionally and cropping
            the empty field brings the wordmark to a legible size without
            recolouring, stretching, or otherwise modifying the logo.
          */}
          <span className="relative block h-9 w-[118px] shrink-0 overflow-hidden sm:h-10 sm:w-[136px]">
            <Image
              src="/voltra-logo.png"
              alt={t.brand}
              width={256}
              height={256}
              priority
              className="absolute left-1/2 top-1/2 h-[186px] w-[186px] max-w-none -translate-x-1/2 -translate-y-1/2 sm:h-[215px] sm:w-[215px]"
            />
          </span>

          <span className="h-8 w-px shrink-0 bg-white/20" />

          <span className="min-w-0">
            <span className="block truncate font-display text-[13px] font-semibold leading-tight text-white sm:text-[15px]">
              {t.appTitle}
            </span>
            {/* The eyebrow is the first thing to go when space is tight. */}
            <span className="hidden truncate text-[11px] font-normal uppercase tracking-[0.14em] text-white/55 sm:block">
              {t.appEyebrow}
            </span>
          </span>
        </div>

        <LanguageToggle
          locale={locale}
          onSelect={onSelectLocale}
          label={t.languageLabel}
          names={t.localeNames}
        />
      </div>
    </header>
  );
}
