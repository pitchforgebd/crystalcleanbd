"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition, type FormEvent } from "react";
import { Field, inputClass } from "@/components/admin/AdminUi";
import { signIn } from "@/server/actions/auth";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signIn({ email, password });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const next = params.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <Field label="Email">
        <input
          className={inputClass}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Field label="Password">
        <input
          className={inputClass}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--brand-deep)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-deep)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
        <p className="display-font text-2xl text-[var(--brand-deep)]">Crystal Clean Service</p>
        <h1 className="mt-2 text-lg font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Enter the credentials for your admin account.
        </p>

        <Suspense fallback={<div className="mt-6 h-64" />}>
          <LoginForm />
        </Suspense>

        <Link
          href="/"
          className="mt-5 inline-flex text-sm text-[var(--brand)] underline-offset-4 hover:underline"
        >
          Back to website
        </Link>
      </div>
    </div>
  );
}
