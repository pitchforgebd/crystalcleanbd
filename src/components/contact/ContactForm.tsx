"use client";

import { FormEvent, useState, useTransition } from "react";
import { submitContactMessage } from "@/server/actions/messages";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.phone.trim()) errors.phone = "Phone is required.";
  if (!values.subject.trim()) errors.subject = "Subject is required.";
  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 12) {
    errors.message = "Please provide a bit more detail.";
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [company, setCompany] = useState(""); // honeypot
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setServerError(null);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    startTransition(async () => {
      const result = await submitContactMessage({ ...values, company });
      if (!result.ok) {
        setServerError(result.error);
        setStatus("error");
        return;
      }
      setStatus("success");
      setValues(initial);
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      {(
        [
          ["name", "Name", "text"],
          ["email", "Email", "email"],
          ["phone", "Phone", "tel"],
          ["subject", "Subject", "text"],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key}>
          <label htmlFor={key} className="mb-1.5 block text-sm font-medium">
            {label}
          </label>
          <input
            id={key}
            name={key}
            type={type}
            value={values[key]}
            onChange={(event) =>
              setValues((current) => ({ ...current, [key]: event.target.value }))
            }
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]",
              errors[key] ? "border-[var(--danger)]" : "border-[var(--line)]",
            )}
            aria-invalid={Boolean(errors[key])}
            aria-describedby={errors[key] ? `${key}-error` : undefined}
          />
          {errors[key] ? (
            <p id={`${key}-error`} className="mt-1 text-sm text-[var(--danger)]">
              {errors[key]}
            </p>
          ) : null}
        </div>
      ))}

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(event) =>
            setValues((current) => ({ ...current, message: event.target.value }))
          }
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]",
            errors.message ? "border-[var(--danger)]" : "border-[var(--line)]",
          )}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 text-sm text-[var(--danger)]">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>

      {status === "success" ? (
        <p className="text-sm font-medium text-[var(--success)]" role="status">
          Thank you — your message has been sent. We will get back to you shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-medium text-[var(--danger)]" role="alert">
          {serverError ?? "Please fix the highlighted fields and try again."}
        </p>
      ) : null}
    </form>
  );
}
