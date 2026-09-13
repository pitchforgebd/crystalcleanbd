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
import type { GalleryImage } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import {
  createGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "@/server/actions/gallery";

type ImageDraft = {
  title: string;
  alt: string;
  description: string;
  src: string;
  order: number;
};
const emptyDraft: ImageDraft = { title: "", alt: "", description: "", src: "", order: 1 };

type Props = { initial: GalleryImage[] };

export function AdminGalleryImagesClient({ initial }: Props) {
  const [draft, setDraft] = useState<ImageDraft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<GalleryImage, ImageDraft>({
      initial,
      create: createGalleryImage,
      update: updateGalleryImage,
      remove: deleteGalleryImage,
      noun: "Image",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft(emptyDraft),
    });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.alt.trim()) return;
    save(draft);
  }

  return (
    <div>
      <AdminPageHeader
        title="Gallery Images"
        description="Manage image gallery titles, alt text, order, and source URLs."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Order", "Title", "Alt", "Actions"]}>
          {rows
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((image) => (
              <tr key={image.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">{image.order}</td>
                <td className="px-4 py-3 font-medium">{image.title}</td>
                <td className="px-4 py-3 text-[var(--ink-muted)]">{image.alt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-xs font-semibold text-[var(--accent)]"
                      onClick={() => {
                        setEditingId(image.id);
                        setDraft({
                          title: image.title,
                          alt: image.alt,
                          description: image.description,
                          src: image.src,
                          order: image.order,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(image.id)}
                  />
                  </div>
                </td>
              </tr>
            ))}
        </AdminTable>
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit image" : "Add image"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Title">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) => setDraft((c) => ({ ...c, title: event.target.value }))}
              />
            </Field>
            <Field label="Alt text">
              <input
                className={inputClass}
                value={draft.alt}
                onChange={(event) => setDraft((c) => ({ ...c, alt: event.target.value }))}
              />
            </Field>
            <ImageField
              label="Image"
              value={draft.src}
              onChange={(url) => setDraft((c) => ({ ...c, src: url }))}
            />
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
