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
  StatusBadge,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import type { GalleryVideo } from "@/lib/types";
import {
  createGalleryVideo,
  deleteGalleryVideo,
  updateGalleryVideo,
} from "@/server/actions/gallery";

type VideoDraft = { title: string; description: string; youtubeId: string; order: number; active: boolean };
const emptyDraft: VideoDraft = { title: "", description: "", youtubeId: "", order: 1, active: true };

type Props = { initial: GalleryVideo[] };

export function AdminGalleryVideosClient({ initial }: Props) {
  const [draft, setDraft] = useState<VideoDraft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<GalleryVideo, VideoDraft>({
      initial,
      create: createGalleryVideo,
      update: updateGalleryVideo,
      remove: deleteGalleryVideo,
      noun: "Video",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft(emptyDraft),
    });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.youtubeId.trim()) return;
    save(draft);
  }

  return (
    <div>
      <AdminPageHeader
        title="Gallery Videos"
        description="Manage YouTube embeds by ID — videos are not downloaded or stored."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Order", "Title", "YouTube ID", "Status", "Actions"]}>
          {rows.map((video) => (
            <tr key={video.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3">{video.order}</td>
              <td className="px-4 py-3 font-medium">{video.title}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{video.youtubeId}</td>
              <td className="px-4 py-3">
                <StatusBadge active={video.active} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => {
                      setEditingId(video.id);
                      setDraft({
                        title: video.title,
                        description: video.description,
                        youtubeId: video.youtubeId,
                        order: video.order,
                        active: video.active,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(video.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit video" : "Add video"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Title">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) => setDraft((c) => ({ ...c, title: event.target.value }))}
              />
            </Field>
            <Field label="YouTube ID">
              <input
                className={inputClass}
                value={draft.youtubeId}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, youtubeId: event.target.value }))
                }
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
            <Field label="Description">
              <textarea
                className={textareaClass}
                value={draft.description}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, description: event.target.value }))
                }
              />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) => setDraft((c) => ({ ...c, active: event.target.checked }))}
              />
              Active (shown in the public gallery)
            </label>
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
