"use client";

import { useEffect, useRef, useState } from "react";
import { Button, LiveRegion } from "@/components/ui";

export type CopyButtonProps = {
  code: string;
  label?: string;
};

/** Copy the code with the Clipboard API. Success resets after two seconds. */
export function CopyButton({ code, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  async function handleCopy() {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setMessage("Copied");
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
      setMessage("Copy failed. Select the code.");
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={handleCopy}>
        {copied ? "Copied" : label}
      </Button>
      <LiveRegion message={message} />
    </>
  );
}
