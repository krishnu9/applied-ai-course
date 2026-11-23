import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "quiet";
export type ButtonSize = "sm" | "md";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-3)] border text-center text-[length:var(--text-small)] font-medium no-underline transition-colors duration-[var(--dur-hover)] disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)] hover:border-[var(--ink)] hover:bg-[var(--ink)]",
  secondary:
    "border-[var(--hairline-strong)] bg-transparent text-[var(--ink)] hover:bg-[var(--surface)]",
  quiet:
    "border-transparent bg-transparent text-[var(--accent)] hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3",
  md: "px-4",
};

/** Shared button classes for `<Link>` elements. */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonProps = ComponentPropsWithoutRef<"button"> & ButtonStyleOptions;

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      aria-disabled={disabled ? true : props["aria-disabled"]}
      className={buttonStyles({ variant, size, className })}
    />
  );
}
