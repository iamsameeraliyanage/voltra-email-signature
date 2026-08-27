"use client";

import { useMemo, useRef, useState } from "react";
import { CodeDrawer } from "@/components/CodeDrawer";
import { CopyButton } from "@/components/CopyButton";
import { Field } from "@/components/Field";
import { SiteHeader } from "@/components/SiteHeader";
import { useLocale } from "@/i18n/useLocale";
import {
  buildSignatureDocument,
  buildSignatureTable,
  COMPANY_ADDRESS,
  DEFAULT_SIGNATURE,
  signatureFileName,
  WEBSITE,
  type SignatureData,
} from "@/lib/signature";

// Button labels are SemiBold, and the Apple Green button carries the brand's
// dark label colour rather than white — both per the type hierarchy.
const buttonBase =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold transition-colors";
const ghostButton = `${buttonBase} border border-rule bg-surface text-ink hover:border-volt hover:text-heading`;
const solidButton = `${buttonBase} bg-volt text-ink hover:bg-[#4CA808]`;
const iconButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rule bg-surface text-muted transition-colors hover:border-volt hover:text-heading";
const panel = "rounded-xl border border-rule bg-surface";
const panelTitle = "font-display text-sm font-semibold text-heading";
const overline = "text-[11px] font-normal uppercase tracking-[0.12em] text-muted";

export default function Home() {
  const { locale, setLocale, t } = useLocale();
  const [data, setData] = useState<SignatureData>(DEFAULT_SIGNATURE);
  const [codeOpen, setCodeOpen] = useState(false);
  const codeTriggerRef = useRef<HTMLButtonElement>(null);

  // The preview renders the bare table; everything the user takes away is the
  // full document, which is what Outlook wants on disk.
  const table = useMemo(() => buildSignatureTable(data), [data]);
  const document_ = useMemo(() => buildSignatureDocument(data), [data]);

  function update(key: keyof SignatureData) {
    return (value: string) => setData((current) => ({ ...current, [key]: value }));
  }

  async function copyHtml() {
    await navigator.clipboard.writeText(document_);
  }

  function download() {
    const blob = new Blob([document_], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = signatureFileName(data.fullName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function closeCode() {
    setCodeOpen(false);
    codeTriggerRef.current?.focus();
  }

  return (
    // The document element is served as German; this marks the live choice for
    // assistive tech when it changes client-side.
    <div lang={t.htmlLang} className="flex min-h-full flex-1 flex-col">
      <SiteHeader t={t} locale={locale} onSelectLocale={setLocale} />

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 py-6 sm:px-6">
        {/* On large screens the row fills the remaining viewport height, so the
            preview can stretch; the form keeps its natural height beside it. */}
        <div className="grid gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(300px,360px)_1fr] lg:grid-rows-[1fr]">
          {/* LEFT — the four things that vary */}
          <section className={`${panel} p-5 lg:self-start`}>
            <h2 className={panelTitle}>{t.detailsTitle}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {t.detailsHelp}
            </p>

            <div className="mt-5 space-y-4">
              <Field
                label={t.fullName}
                value={data.fullName}
                onChange={update("fullName")}
                placeholder={t.fullNamePlaceholder}
              />
              <Field
                label={t.jobTitle}
                value={data.jobTitle}
                onChange={update("jobTitle")}
                placeholder={t.jobTitlePlaceholder}
              />
              <Field
                label={t.phone}
                type="tel"
                value={data.phone}
                onChange={update("phone")}
                placeholder={t.phonePlaceholder}
              />
              <Field
                label={t.email}
                type="email"
                value={data.email}
                onChange={update("email")}
                placeholder={t.emailPlaceholder}
              />
            </div>

            <div className="mt-6 rounded-lg bg-tint px-4 py-3.5">
              <p className={overline}>{t.fixedTitle}</p>
              <p className="mt-2 text-xs font-medium leading-relaxed text-ink">
                {COMPANY_ADDRESS}
                <br />
                {WEBSITE} · {t.fixedLogo}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                {t.fixedNote}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setData(DEFAULT_SIGNATURE)}
              className={`${ghostButton} mt-4 w-full`}
            >
              {t.reset}
            </button>
          </section>

          {/* RIGHT — the signature, with everything you can do with it.
              min-w-0 lets the 700px signature scroll inside its own container
              instead of widening the whole grid column on narrow screens. */}
          <section className={`${panel} flex min-w-0 flex-col`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
              <h2 className={panelTitle}>{t.previewTitle}</h2>

              <div className="flex items-center gap-2">
                <CopyButton
                  label={t.copyHtml}
                  copiedLabel={t.copied}
                  onCopy={copyHtml}
                  className={ghostButton}
                />
                <button type="button" onClick={download} className={solidButton}>
                  {t.download}
                </button>
                <button
                  ref={codeTriggerRef}
                  type="button"
                  onClick={() => setCodeOpen(true)}
                  aria-label={t.viewCode}
                  title={t.viewCode}
                  aria-expanded={codeOpen}
                  className={iconButton}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/*
              Presented the way the guidelines present it: the signature on
              white, floating on the brand's light green tint.
            */}
            {/*
              White, because that is what mail clients render on — the preview
              should show what a recipient sees, not a styled backdrop.
            */}
            <div className="flex min-h-0 flex-1 overflow-auto rounded-b-xl bg-surface p-6">
              {/*
                Auto margins rather than justify/align-center: they centre the
                signature in both axes while still letting it scroll from its
                own left edge when it is wider than the box. The ring and shadow
                are preview affordances so the signature's edges stay legible
                against the white; they are not part of the signature.
              */}
              <div
                className="m-auto w-fit shrink-0 bg-surface ring-1 ring-rule shadow-[0_1px_2px_rgba(35,40,43,0.06),0_12px_28px_-14px_rgba(35,40,43,0.25)]"
                dangerouslySetInnerHTML={{ __html: table }}
              />
            </div>
          </section>
        </div>
      </main>

      <CodeDrawer
        open={codeOpen}
        onClose={closeCode}
        title={t.htmlTitle}
        note={t.htmlNote}
        code={document_}
        copyLabel={t.copyHtml}
        copiedLabel={t.copied}
        closeLabel={t.closeLabel}
        onCopy={copyHtml}
      />
    </div>
  );
}
