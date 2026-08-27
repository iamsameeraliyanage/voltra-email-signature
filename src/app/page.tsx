"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Field } from "@/components/Field";
import { SiteHeader } from "@/components/SiteHeader";
import { useLocale } from "@/i18n/useLocale";
import {
  buildSignatureHtml,
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
const panel = "rounded-xl border border-rule bg-surface";
const panelHead =
  "flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5";
const panelTitle = "font-display text-sm font-semibold text-heading";
const overline = "text-[11px] font-normal uppercase tracking-[0.12em] text-muted";

export default function Home() {
  const { locale, setLocale, t } = useLocale();
  const [data, setData] = useState<SignatureData>(DEFAULT_SIGNATURE);

  const html = useMemo(() => buildSignatureHtml(data), [data]);

  function update(key: keyof SignatureData) {
    return (value: string) => setData((current) => ({ ...current, [key]: value }));
  }

  async function copyHtml() {
    await navigator.clipboard.writeText(html);
  }

  function download() {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = signatureFileName(data.fullName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    // The document element is served as German; this marks the live choice for
    // assistive tech when it changes client-side.
    <div lang={t.htmlLang} className="flex min-h-full flex-col">
      <SiteHeader t={t} locale={locale} onSelectLocale={setLocale} />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(300px,360px)_1fr] lg:items-start">
          {/* LEFT — the four things that vary */}
          <section className={`${panel} p-5 lg:sticky lg:top-[88px]`}>
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

          {/* RIGHT — preview above, markup below */}
          <div className="flex min-w-0 flex-col gap-5">
            <section className={panel}>
              <div className={panelHead}>
                <h2 className={panelTitle}>{t.previewTitle}</h2>
                <span className={overline}>{t.previewNote}</span>
              </div>
              {/*
                Presented the way the guidelines present it: the signature on
                white, floating on the brand's light green tint.
              */}
              <div className="overflow-x-auto bg-tint p-6">
                <div
                  className="w-fit bg-surface"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </section>

            <section className={`${panel} flex min-w-0 flex-col`}>
              <div className={panelHead}>
                <h2 className={panelTitle}>{t.htmlTitle}</h2>
                <div className="flex gap-2">
                  <CopyButton
                    label={t.copyHtml}
                    copiedLabel={t.copied}
                    onCopy={copyHtml}
                    className={ghostButton}
                  />
                  <button type="button" onClick={download} className={solidButton}>
                    {t.download}
                  </button>
                </div>
              </div>
              <pre className="max-h-[420px] overflow-auto rounded-b-xl bg-[#F7FAF4] px-5 py-4 text-xs leading-relaxed text-ink">
                <code>{html}</code>
              </pre>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
