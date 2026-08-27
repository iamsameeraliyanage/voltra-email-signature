"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Field } from "@/components/Field";
import {
  buildSignatureHtml,
  COMPANY_ADDRESS,
  DEFAULT_SIGNATURE,
  signatureFileName,
  WEBSITE,
  type SignatureData,
} from "@/lib/signature";

const buttonBase =
  "inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-xs font-semibold transition disabled:opacity-50";
const ghostButton = `${buttonBase} border border-line bg-surface text-foreground hover:border-brand hover:text-brand`;
const solidButton = `${buttonBase} bg-brand text-white hover:brightness-95`;

export default function Home() {
  const [data, setData] = useState<SignatureData>(DEFAULT_SIGNATURE);
  const previewRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => buildSignatureHtml(data), [data]);

  function update(key: keyof SignatureData) {
    return (value: string) => setData((current) => ({ ...current, [key]: value }));
  }

  async function copyHtml() {
    await navigator.clipboard.writeText(html);
  }

  /** Copies the rendered signature so it pastes styled into Gmail/Outlook. */
  async function copySignature() {
    const node = previewRef.current;
    if (!node) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([node.innerText], { type: "text/plain" }),
        }),
      ]);
    } catch {
      // Safari and older browsers: fall back to a selection-based copy.
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
    }
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
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line bg-surface px-6 py-4">
        <h1 className="font-display text-lg font-semibold">
          Voltra Email Signature Generator
        </h1>
        <p className="mt-0.5 text-sm text-muted">
          Enter your details, check the preview, then copy or download the HTML.
        </p>
      </header>

      <main className="grid flex-1 gap-6 p-6 lg:grid-cols-[minmax(320px,380px)_1fr] lg:items-start">
        {/* LEFT — details */}
        <section className="rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-6">
          <h2 className="font-display text-sm font-semibold">Your details</h2>

          <div className="mt-4 space-y-4">
            <Field
              label="Full name"
              value={data.fullName}
              onChange={update("fullName")}
              placeholder="John Doe"
            />
            <Field
              label="Job title"
              value={data.jobTitle}
              onChange={update("jobTitle")}
              placeholder="Technical Engineer"
            />
            <Field
              label="Phone"
              type="tel"
              value={data.phone}
              onChange={update("phone")}
              placeholder="+41 31 561 92 93"
            />
            <Field
              label="Email"
              type="email"
              value={data.email}
              onChange={update("email")}
              placeholder="john@voltra.ch"
            />
          </div>

          <div className="mt-5 rounded-lg border border-line bg-background px-3.5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Same on every signature
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {COMPANY_ADDRESS}
              <br />
              {WEBSITE} · Voltra logo
            </p>
          </div>

          <button
            type="button"
            onClick={() => setData(DEFAULT_SIGNATURE)}
            className={`${ghostButton} mt-4 w-full`}
          >
            Reset to example
          </button>
        </section>

        {/* RIGHT — preview on top, code below */}
        <div className="flex min-w-0 flex-col gap-6">
          <section className="rounded-xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <h2 className="font-display text-sm font-semibold">Preview</h2>
              <CopyButton
                label="Copy signature"
                onCopy={copySignature}
                className={ghostButton}
              />
            </div>
            <div className="overflow-x-auto p-5">
              <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </section>

          <section className="flex min-w-0 flex-col rounded-xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <h2 className="font-display text-sm font-semibold">HTML</h2>
              <div className="flex gap-2">
                <CopyButton
                  label="Copy HTML"
                  onCopy={copyHtml}
                  className={ghostButton}
                />
                <button type="button" onClick={download} className={solidButton}>
                  Download HTML
                </button>
              </div>
            </div>
            <pre className="max-h-[420px] overflow-auto px-5 py-4 text-xs leading-relaxed">
              <code>{html}</code>
            </pre>
          </section>
        </div>
      </main>
    </div>
  );
}
