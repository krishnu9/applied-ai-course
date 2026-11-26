import type { Metadata } from "next";
import { LoginForm } from "@/components/auth";
import { safeNextPath } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(firstValue(params.next));
  const hasError = firstValue(params.error) === "auth";

  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] min-w-0 px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <section aria-labelledby="login-title">
        <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
          Course access
        </p>
        <h1 id="login-title" className="mt-3">
          Sign in to the course
        </h1>
        <p className="mt-4 max-w-[46ch] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
          Enter your email address. We send a sign-in link. There is no
          password.
        </p>
      </section>

      <LoginForm nextPath={nextPath} hasError={hasError} className="mt-8" />
    </div>
  );
}
