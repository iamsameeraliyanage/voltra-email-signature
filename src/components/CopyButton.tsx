"use client";

import { useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  label: string;
  copiedLabel?: string;
  onCopy: () => Promise<void>;
  className?: string;
};

export function CopyButton({
  label,
  copiedLabel = "Copied",
  onCopy,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleClick() {
    try {
      await onCopy();
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {copied ? copiedLabel : label}
    </button>
  );
}
