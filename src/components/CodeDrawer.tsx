"use client";

import { useEffect, useRef } from "react";
import { CopyButton } from "@/components/CopyButton";

type CodeDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  note: string;
  code: string;
  copyLabel: string;
  copiedLabel: string;
  closeLabel: string;
  onCopy: () => Promise<void>;
};

export function CodeDrawer({
  open,
  onClose,
  title,
  note,
  code,
  copyLabel,
  copiedLabel,
  closeLabel,
  onCopy,
}: CodeDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and the page behind must not scroll while the drawer is up.
  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-charcoal/40 [animation:scrim-in_150ms_ease-out]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute right-0 top-0 flex h-full w-full max-w-[min(760px,94vw)] flex-col bg-surface shadow-2xl [animation:drawer-in_200ms_ease-out]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-sm font-semibold text-heading">
              {title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <CopyButton
              label={copyLabel}
              copiedLabel={copiedLabel}
              onCopy={onCopy}
              className="inline-flex items-center justify-center rounded-lg border border-rule bg-surface px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-volt hover:text-heading"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rule text-muted transition-colors hover:border-volt hover:text-heading"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <pre className="flex-1 overflow-auto bg-[#F7FAF4] px-5 py-4 text-xs leading-relaxed text-ink">
          <code>{code}</code>
        </pre>
      </aside>
    </div>
  );
}
