"use client";

import { useState, useTransition } from "react";

type Feedback = "idle" | "success" | "error";
type ActionResult = { ok: true; data?: unknown } | { ok: false; error: string };

/**
 * Phase 2: wires a Server Action to a `useTransition`.
 * Call `execute(payload)` from a form/click handler; `isPending` reflects
 * in-flight state. Success or error message is surfaced via `feedback`.
 */
export function useServerAction<T = unknown>(
  action: (input: T) => Promise<ActionResult>,
  options?: {
    successMessage?: string;
    errorPrefix?: string;
    onSuccess?: (data: unknown, input: T) => void;
  },
) {
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function execute(input: T) {
    startTransition(async () => {
      try {
        const result = await action(input);
        if (result.ok) {
          setFeedback("success");
          setMessage(options?.successMessage ?? "Saved.");
          options?.onSuccess?.(result.data, input);
        } else {
          setFeedback("error");
          setMessage(
            options?.errorPrefix
              ? `${options.errorPrefix} ${result.error}`
              : result.error,
          );
        }
      } catch (err) {
        setFeedback("error");
        setMessage(
          err instanceof Error ? err.message : "Unexpected error. Please retry.",
        );
      }
    });
  }

  function resetFeedback() {
    setFeedback("idle");
    setMessage("");
  }

  return { feedback, message, isPending, execute, resetFeedback };
}

export function FeedbackBanner({
  feedback,
  message,
}: {
  feedback: Feedback;
  message: string;
}) {
  if (feedback === "idle") return null;
  return (
    <p
      role={feedback === "error" ? "alert" : "status"}
      className={`mt-4 text-sm font-medium ${
        feedback === "success" ? "text-[var(--success)]" : "text-[var(--danger)]"
      }`}
    >
      {message}
    </p>
  );
}

export function ConfirmDeleteButton({
  label = "Delete",
  confirmLabel = "Confirm delete?",
  onConfirm,
  disabled = false,
}: {
  label?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className="text-xs font-semibold text-[var(--danger)] disabled:opacity-50"
        disabled={disabled}
        onClick={() => setConfirming(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className="text-xs font-semibold text-[var(--danger)] disabled:opacity-50"
        disabled={disabled}
        onClick={() => {
          onConfirm();
          setConfirming(false);
        }}
      >
        {confirmLabel}
      </button>
      <button
        type="button"
        className="text-xs font-semibold text-[var(--ink-muted)]"
        onClick={() => setConfirming(false)}
      >
        Cancel
      </button>
    </span>
  );
}

/**
 * List-CRUD wiring shared by the admin modules: keeps the on-screen rows in
 * sync with create/update/delete Server Actions and surfaces one feedback line.
 */
export function useAdminCrud<Row extends { id: string }, Draft>(config: {
  initial: Row[];
  create: (data: Draft) => Promise<ActionResult>;
  update: (id: string, data: Draft) => Promise<ActionResult>;
  remove: (input: { id: string }) => Promise<ActionResult>;
  /** Build the on-screen row from the submitted draft plus the row id. */
  toRow: (draft: Draft, id: string) => Row;
  /** Singular noun used in the feedback messages, e.g. "Statistic". */
  noun: string;
  /** Called after a successful create or update — reset the form here. */
  onSaved?: () => void;
}) {
  const { initial, create, update, remove, toRow, noun, onSaved } = config;

  const [rows, setRows] = useState<Row[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function run(
    action: () => Promise<ActionResult>,
    onOk: (data: unknown) => void,
    successMessage: string,
  ) {
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) {
          setFeedback("error");
          setMessage(result.error);
          return;
        }
        onOk("data" in result ? result.data : undefined);
        setFeedback("success");
        setMessage(successMessage);
      } catch (error) {
        setFeedback("error");
        setMessage(
          error instanceof Error ? error.message : "Unexpected error. Please retry.",
        );
      }
    });
  }

  function save(draft: Draft) {
    const id = editingId;
    if (id) {
      run(
        () => update(id, draft),
        () => {
          setRows((current) =>
            current.map((row) => (row.id === id ? toRow(draft, id) : row)),
          );
          setEditingId(null);
          onSaved?.();
        },
        `${noun} updated.`,
      );
      return;
    }
    run(
      () => create(draft),
      (data) => {
        const created = data as { id?: string } | undefined;
        if (created?.id) setRows((current) => [...current, toRow(draft, created.id as string)]);
        onSaved?.();
      },
      `${noun} created.`,
    );
  }

  function destroy(id: string) {
    run(
      () => remove({ id }),
      () => {
        setRows((current) => current.filter((row) => row.id !== id));
        if (editingId === id) setEditingId(null);
      },
      `${noun} deleted.`,
    );
  }

  return {
    rows,
    setRows,
    editingId,
    setEditingId,
    feedback,
    message,
    isPending,
    save,
    destroy,
  };
}
