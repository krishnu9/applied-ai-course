"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";

const GENERIC_ERROR = "We could not send the link. Try again in a moment.";
const RATE_LIMIT_ERROR =
  "Too many sign-in emails were sent. Wait a minute, then try again.";
const INVALID_EMAIL = "Enter your email address.";
const LINK_ERROR = "That sign-in link did not work. Request a new one.";
const COOLDOWN_SECONDS = 30;

type Status = "idle" | "sending" | "sent" | "error";

function isRateLimited(error: { status?: number; message?: string }): boolean {
  if (error.status === 429) return true;
  const message = error.message?.toLowerCase() ?? "";
  return message.includes("rate limit") || message.includes("too many");
}

export type LoginFormProps = {
  nextPath: string;
  hasError?: boolean;
  className?: string;
};

/**
 * Email magic-link form. A successful send always shows the same generic
 * message, so the form does not reveal whether an account exists. It shows a
 * rate-limit message only when Supabase reports one.
 */
export function LoginForm({
  nextPath,
  hasError = false,
  className,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(hasError ? "error" : "idle");
  const [message, setMessage] = useState<string | null>(
    hasError ? LINK_ERROR : null,
  );
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const isSending = status === "sending";
  const address = email.trim();

  async function sendLink(): Promise<void> {
    setStatus("sending");
    setMessage(null);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email: address,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        setStatus("error");
        setMessage(isRateLimited(error) ? RATE_LIMIT_ERROR : GENERIC_ERROR);
        return;
      }
      setStatus("sent");
      setCooldown(COOLDOWN_SECONDS);
    } catch {
      setStatus("error");
      setMessage(GENERIC_ERROR);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (isSending) return;
    if (address.length === 0) {
      setStatus("error");
      setMessage(INVALID_EMAIL);
      return;
    }
    void sendLink();
  }

  function handleResend(): void {
    if (isSending || cooldown > 0 || address.length === 0) return;
    void sendLink();
  }

  if (status === "sent") {
    return (
      <div className={cn("max-w-[46ch]", className)}>
        <div
          role="status"
          aria-live="polite"
          className="rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-4 md:p-6"
        >
          <h2 className="text-[length:var(--text-h3)]">Check your email</h2>
          <p className="mt-2 [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
            If an account exists for{" "}
            <span className="break-all text-[var(--ink)]">{address}</span>, a
            sign-in link is on its way. It can take a minute. Check the spam
            folder too.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResend}
              disabled={cooldown > 0 || isSending}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Send another link"}
            </Button>
            <button
              type="button"
              className="text-[length:var(--text-small)] text-[var(--accent)] underline"
              onClick={() => {
                setStatus("idle");
                setMessage(null);
              }}
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("max-w-[46ch]", className)}
      aria-describedby={message ? "login-message" : undefined}
    >
      <label
        htmlFor="login-email"
        className="block text-[length:var(--text-small)] font-medium text-[var(--ink)]"
      >
        Email address
      </label>
      <input
        id="login-email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        aria-invalid={status === "error" ? true : undefined}
        className="mt-1 min-h-11 w-full min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 text-[var(--ink)] aria-invalid:border-[var(--danger)]"
      />
      {message ? (
        <p
          id="login-message"
          role="alert"
          className="mt-2 text-[length:var(--text-small)] text-[var(--danger)]"
        >
          {message}
        </p>
      ) : null}
      <Button type="submit" className="mt-4 w-full sm:w-auto" disabled={isSending}>
        {isSending ? "Sending..." : "Email me a sign-in link"}
      </Button>
      <p className="mt-3 text-[length:var(--text-small)] text-[var(--ink-muted)]">
        No password. The link signs you in on this device.
      </p>
    </form>
  );
}
