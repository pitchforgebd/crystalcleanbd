"use client";

import { FormEvent, useState } from "react";
import {
  ConfirmDeleteButton,
  FeedbackBanner,
  useAdminCrud,
} from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  AdminTable,
  Field,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import type { Testimonial } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "@/server/actions/testimonials";

type TestimonialDraft = {
  name: string;
  role: string;
  quote: string;
  avatarSrc: string;
  avatarAlt: string;
};

const emptyDraft: TestimonialDraft = {
  name: "",
  role: "",
  quote: "",
  avatarSrc: "",
  avatarAlt: "",
};

type Props = { initial: Testimonial[] };

export function AdminTestimonialsClient({ initial }: Props) {
  const [draft, setDraft] = useState<TestimonialDraft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<Testimonial, TestimonialDraft>({
      initial,
      create: createTestimonial,
      update: updateTestimonial,
      remove: deleteTestimonial,
      noun: "Testimonial",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft(emptyDraft),
    });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.quote.trim()) return;
    save({
      ...draft,
      avatarAlt: draft.avatarAlt.trim() || `Portrait of ${draft.name.trim()}`,
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Manage customer quotes displayed on the homepage."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Name", "Role", "Quote", "Actions"]}>
          {rows.map((item) => (
            <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">{item.name}</td>
              <td className="px-4 py-3">{item.role}</td>
              <td className="max-w-sm px-4 py-3 text-[var(--ink-muted)]">{item.quote}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => {
                      setEditingId(item.id);
                      setDraft({
                        name: item.name,
                        role: item.role,
                        quote: item.quote,
                        avatarSrc: item.avatarSrc,
                        avatarAlt: item.avatarAlt,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(item.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit testimonial" : "Add testimonial"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) => setDraft((c) => ({ ...c, name: event.target.value }))}
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
                value={draft.role}
                onChange={(event) => setDraft((c) => ({ ...c, role: event.target.value }))}
              />
            </Field>
            <Field label="Quote">
              <textarea
                className={textareaClass}
                value={draft.quote}
                onChange={(event) => setDraft((c) => ({ ...c, quote: event.target.value }))}
              />
            </Field>
            <ImageField
              label="Avatar"
              hint="Optional — a square photo works best."
              value={draft.avatarSrc}
              onChange={(url) => setDraft((c) => ({ ...c, avatarSrc: url }))}
            />
            <Field label="Avatar alt text">
              <input
                className={inputClass}
                value={draft.avatarAlt}
                onChange={(event) => setDraft((c) => ({ ...c, avatarAlt: event.target.value }))}
              />
            </Field>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-[var(--brand-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
              >
                {isPending ? "Saving…" : editingId ? "Update" : "Create"}
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
        </AdminCard>
      </div>
    </div>
  );
}
