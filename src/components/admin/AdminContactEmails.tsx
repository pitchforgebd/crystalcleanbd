"use client";

import { FormEvent, useState } from "react";
import {
  ConfirmDeleteButton,
  FeedbackBanner,
  useAdminCrud,
} from "@/components/admin/AdminActions";
import { AdminCard, Field, StatusBadge, inputClass } from "@/components/admin/AdminUi";
import type { ContactEmail } from "@/lib/types";
import {
  createContactEmail,
  deleteContactEmail,
  updateContactEmail,
} from "@/server/actions/contact-info";

type Draft = { label: string; email: string; order: number; active: boolean };
const emptyDraft: Draft = { label: "", email: "", order: 0, active: true };

/** Emails live in their own card: each row saves independently, same as social links. */
export function AdminContactEmails({ initial }: { initial: ContactEmail[] }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<ContactEmail, Draft>({
      initial,
      create: createContactEmail,
      update: updateContactEmail,
      remove: deleteContactEmail,
      noun: "Email",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft({ ...emptyDraft, order: sorted.length }),
    });
  const sorted = [...rows].sort((a, b) => a.order - b.order);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.email.trim()) return;
    save(draft);
  }

  return (
    <AdminCard>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--brand-deep)]">Contact emails</h2>
        <p className="text-xs text-[var(--ink-muted)]">
          Shown in the footer and on the contact page.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {sorted.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--line)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
              No emails yet — add the first one on the right.
            </p>
          ) : (
            <ul className="space-y-2">
              {sorted.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--line)] p-3"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {item.label || "Untitled"}
                    </span>
                    <a
                      href={`mailto:${item.email}`}
                      className="block truncate text-xs text-[var(--ink-muted)] underline-offset-2 hover:underline"
                    >
                      {item.email}
                    </a>
                  </span>
                  <StatusBadge active={item.active} />
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isPending}
                      className="text-xs font-semibold text-[var(--brand)] disabled:opacity-50"
                      onClick={() => {
                        setEditingId(item.id);
                        setDraft({
                          label: item.label,
                          email: item.email,
                          order: item.order,
                          active: item.active,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <ConfirmDeleteButton disabled={isPending} onConfirm={() => destroy(item.id)} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Label" hint="e.g. Support, Sales — optional.">
            <input
              className={inputClass}
              value={draft.label}
              onChange={(event) => setDraft((c) => ({ ...c, label: event.target.value }))}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              value={draft.email}
              onChange={(event) => setDraft((c) => ({ ...c, email: event.target.value }))}
            />
          </Field>
          <Field label="Order">
            <input
              type="number"
              className={inputClass}
              value={draft.order}
              onChange={(event) =>
                setDraft((c) => ({ ...c, order: Number(event.target.value) || 0 }))
              }
            />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(event) => setDraft((c) => ({ ...c, active: event.target.checked }))}
            />
            Active (shown on the site)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-[var(--brand-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
            >
              {isPending ? "Saving…" : editingId ? "Update email" : "Add email"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="text-sm font-semibold text-[var(--ink-muted)]"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyDraft);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
          <FeedbackBanner feedback={feedback} message={message} />
        </form>
      </div>
    </AdminCard>
  );
}
