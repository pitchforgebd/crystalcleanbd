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
import type { BlogCategory } from "@/lib/types";
import { createCategory, deleteCategory, updateCategory } from "@/server/actions/blog";

type CategoryDraft = { name: string; slug: string; description: string };
const emptyDraft: CategoryDraft = { name: "", slug: "", description: "" };

type Props = { initial: BlogCategory[] };

export function AdminBlogCategoriesClient({ initial }: Props) {
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<BlogCategory, CategoryDraft>({
      initial,
      create: createCategory,
      update: updateCategory,
      remove: deleteCategory,
      noun: "Category",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft(emptyDraft),
    });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.slug.trim()) return;
    save(draft);
  }

  return (
    <div>
      <AdminPageHeader
        title="Blog Categories"
        description="Organize posts with SEO-friendly category slugs."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Name", "Slug", "Description", "Actions"]}>
          {rows.map((category) => (
            <tr key={category.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">{category.name}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{category.slug}</td>
              <td className="px-4 py-3">{category.description}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => {
                      setEditingId(category.id);
                      setDraft({
                        name: category.name,
                        slug: category.slug,
                        description: category.description,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(category.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit category" : "Add category"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) => setDraft((c) => ({ ...c, name: event.target.value }))}
              />
            </Field>
            <Field label="Slug">
              <input
                className={inputClass}
                value={draft.slug}
                onChange={(event) => setDraft((c) => ({ ...c, slug: event.target.value }))}
              />
            </Field>
            <Field label="Description">
              <textarea
                className={textareaClass}
                value={draft.description}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, description: event.target.value }))
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
