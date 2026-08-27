export const LOCALES = ["de", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "de";

export type Dictionary = {
  htmlLang: string;
  brand: string;
  appTitle: string;
  appEyebrow: string;
  languageLabel: string;
  localeNames: Record<Locale, string>;
  detailsTitle: string;
  detailsHelp: string;
  fullName: string;
  fullNamePlaceholder: string;
  jobTitle: string;
  jobTitlePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  fixedTitle: string;
  fixedLogo: string;
  reset: string;
  previewTitle: string;
  previewNote: string;
  fixedNote: string;
  htmlTitle: string;
  copyHtml: string;
  copied: string;
  download: string;
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  de: {
    htmlLang: "de",
    brand: "Voltra",
    appTitle: "E-Mail-Signatur",
    appEyebrow: "Generator",
    languageLabel: "Sprache",
    localeNames: { de: "Deutsch", en: "Englisch" },
    detailsTitle: "Ihre Angaben",
    detailsHelp:
      "Angaben eingeben, Vorschau prüfen, dann HTML kopieren oder herunterladen.",
    fullName: "Vollständiger Name",
    fullNamePlaceholder: "Max Mustermann",
    jobTitle: "Position",
    jobTitlePlaceholder: "Technischer Ingenieur",
    phone: "Telefon",
    phonePlaceholder: "+41 31 561 92 93",
    email: "E-Mail",
    emailPlaceholder: "max@voltra.ch",
    fixedTitle: "Auf jeder Signatur gleich",
    fixedLogo: "Voltra Logo",
    reset: "Auf Beispiel zurücksetzen",
    previewTitle: "Vorschau",
    previewNote: "700 × 195 px",
    fixedNote: "Nach den Voltra Markenrichtlinien.",
    htmlTitle: "HTML",
    copyHtml: "HTML kopieren",
    copied: "Kopiert",
    download: "HTML herunterladen",
  },
  en: {
    htmlLang: "en",
    brand: "Voltra",
    appTitle: "Email signature",
    appEyebrow: "Generator",
    languageLabel: "Language",
    localeNames: { de: "German", en: "English" },
    detailsTitle: "Your details",
    detailsHelp:
      "Enter your details, check the preview, then copy or download the HTML.",
    fullName: "Full name",
    fullNamePlaceholder: "John Doe",
    jobTitle: "Job title",
    jobTitlePlaceholder: "Technical Engineer",
    phone: "Phone",
    phonePlaceholder: "+41 31 561 92 93",
    email: "Email",
    emailPlaceholder: "john@voltra.ch",
    fixedTitle: "Same on every signature",
    fixedLogo: "Voltra logo",
    reset: "Reset to example",
    previewTitle: "Preview",
    previewNote: "700 × 195 px",
    fixedNote: "Set by the Voltra brand guidelines.",
    htmlTitle: "HTML",
    copyHtml: "Copy HTML",
    copied: "Copied",
    download: "Download HTML",
  },
};
