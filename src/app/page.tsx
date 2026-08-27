"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Field } from "@/components/Field";
import {
  buildSignatureHtml,
  DEFAULT_SIGNATURE,
  signatureFileName,
  type SignatureData,
} from "@/lib/signature";

const buttonBase =
  "inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-xs font-semibold transition disabled:opacity-50";
const ghostButton = `${buttonBase} border border-line bg-surface text-foreground hover:border-brand hover:text-brand`;
const solidButton = `${buttonBase} bg-brand text-white hover:brightness-95`;

const subscribeToNothing = () => () => {};

export default function Home() {
  const [fields, setFields] = useState<SignatureData>(DEFAULT_SIGNATURE);
  const [logoOverride, setLogoOverride] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // The signature is pasted into mail clients, so the logo needs an absolute
  // URL. Default it to this app's own copy — whoever hosts the generator also
  // hosts a usable logo. The origin is only knowable in the browser, hence the
  // separate server snapshot.
  const origin = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.origin,
    () => "",
  );
  const logoUrl =
    logoOverride ??
    (origin ? `${origin}/voltra-logo.png` : DEFAULT_SIGNATURE.logoUrl);

  const data = useMemo<SignatureData>(
    () => ({ ...fields, logoUrl }),
    [fields, logoUrl],
  );
  const html = useMemo(() => buildSignatureHtml(data), [data]);

  function update(key: keyof SignatureData) {
    return (value: string) =>
      setFields((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setFields(DEFAULT_SIGNATURE);
    setLogoOverride(null);
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
          <h2 className="font-display text-sm font-semibold">
            Your details
          </h2>

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
              label="Company & address"
              value={data.company}
              onChange={update("company")}
              placeholder="Green Energy Solution GmbH, Zikadenweg 7, CH-3006 Bern"
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
            <Field
              label="Website"
              value={data.website}
              onChange={update("website")}
              placeholder="www.voltra.ch"
            />
            <Field
              label="Logo URL"
              value={logoUrl}
              onChange={setLogoOverride}
              hint="Must be a public absolute URL — mail clients cannot load a local file."
            />
          </div>

          <button
            type="button"
            onClick={reset}
            className={`${ghostButton} mt-5 w-full`}
          >
            Reset to example
          </button>
        </section>

        {/* RIGHT — preview on top, code below */}
        <div className="flex min-w-0 flex-col gap-6">
          <section className="rounded-xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <h2 className="font-display text-sm font-semibold">
                Preview
              </h2>
              <CopyButton
                label="Copy signature"
                onCopy={copySignature}
                className={ghostButton}
              />
            </div>
            <div className="overflow-x-auto p-5">
              <div
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </section>

          <section className="flex min-w-0 flex-col rounded-xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <h2 className="font-display text-sm font-semibold">
                HTML
              </h2>
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
