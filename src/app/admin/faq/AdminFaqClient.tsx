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
import type { FaqItem } from "@/lib/types";
import { createFaq, deleteFaq, updateFaq } from "@/server/actions/faq";

type FaqDraft = { question: string; answer: string; order: number };
const emptyDraft: FaqDraft = { question: "", answer: "", order: 1 };

type Props = { initial: FaqItem[] };

export function AdminFaqClient({ initial }: Props) {
  const [draft, setDraft] = useState<FaqDraft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<FaqItem, FaqDraft>({
      initial,
      create: createFaq,
      update: updateFaq,
      remove: deleteFaq,
      noun: "FAQ item",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft(emptyDraft),
    });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.question.trim() || !draft.answer.trim()) return;
    save(draft);
  }

  return (
    <div>
      <AdminPageHeader
        title="FAQ"
        description="Manage frequently asked questions with display ordering."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Order", "Question", "Actions"]}>
          {rows
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">{item.order}</td>
                <td className="px-4 py-3 font-medium">{item.question}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-xs font-semibold text-[var(--accent)]"
                      onClick={() => {
                        setEditingId(item.id);
                        setDraft({
                          question: item.question,
                          answer: item.answer,
                          order: item.order,
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
            {editingId ? "Edit FAQ" : "Add FAQ"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Question">
              <input
                className={inputClass}
                value={draft.question}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, question: event.target.value }))
                }
              />
            </Field>
            <Field label="Answer">
              <textarea
                className={textareaClass}
                value={draft.answer}
                onChange={(event) => setDraft((c) => ({ ...c, answer: event.target.value }))}
              />
            </Field>
            <Field label="Order">
              <input
                className={inputClass}
                type="number"
                value={draft.order}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, order: Number(event.target.value) || 1 }))
                }
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
