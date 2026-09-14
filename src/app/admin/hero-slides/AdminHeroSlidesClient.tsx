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
import type { HeroSlide } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import {
  createHeroSlide,
  deleteHeroSlide,
  updateHeroSlide,
} from "@/server/actions/hero";

type SlideDraft = Omit<HeroSlide, "id">;

type Props = { initial: HeroSlide[] };

const emptySlide: Omit<HeroSlide, "id"> = {
  image: "",
  imageAlt: "",
  heading: "",
  subheading: "",
  text: "",
  ctaLabel: "Learn more",
  ctaHref: "/services",
  order: 0,
  active: true,
};

export function AdminHeroSlidesClient({ initial }: Props) {
  const [draft, setDraft] = useState<SlideDraft>({
    ...emptySlide,
    order: initial.length,
  });

  const {
    rows: slides,
    editingId,
    setEditingId,
    feedback,
    message,
    isPending,
    save,
    destroy,
  } = useAdminCrud<HeroSlide, SlideDraft>({
    initial,
    create: createHeroSlide,
    update: updateHeroSlide,
    remove: deleteHeroSlide,
    noun: "Slide",
    toRow: (values, id) => ({ id, ...values }),
    onSaved: () => setDraft({ ...emptySlide, order: sorted.length }),
  });

  const sorted = [...slides].sort((a, b) => a.order - b.order);
  const leadId = sorted.find((slide) => slide.active)?.id;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.heading.trim() || !draft.text.trim()) return;
    save(draft);
  }

  function editSlide(slide: HeroSlide) {
    setEditingId(slide.id);
    setDraft({
      image: slide.image,
      imageAlt: slide.imageAlt,
      heading: slide.heading,
      subheading: slide.subheading,
      text: slide.text,
      ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      order: slide.order,
      active: slide.active,
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Hero Slides"
        description="Controls the homepage hero. Only the active slide with the lowest order supplies the headline, paragraph, and button — every active slide's image appears in the floating photo cluster (up to 3)."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <AdminTable headers={["Order", "Heading", "Role", "Status", "Actions"]}>
          {sorted.map((slide) => (
            <tr key={slide.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 tabular-nums">{slide.order}</td>
              <td className="px-4 py-3 font-medium">{slide.heading}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">
                {slide.id === leadId ? "Headline + CTA + image" : "Image only"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge active={slide.active} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => editSlide(slide)}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(slide.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit slide" : "Add slide"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-xs text-[var(--ink-muted)]">
              Heading, subheading, text, and CTA only show on the homepage if this
              slide ends up being the active slide with the lowest order.
              Every active slide&apos;s image is used regardless.
            </p>
            {(
              [
                ["heading", "Heading"],
                ["subheading", "Subheading"],
                ["imageAlt", "Image alt text"],
                ["ctaLabel", "CTA label"],
                ["ctaHref", "CTA href"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className={inputClass}
                  value={draft[key]}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              </Field>
            ))}
            <ImageField
              label="Slide image"
              hint="Shown in the homepage hero."
              value={draft.image}
              onChange={(url) => setDraft((current) => ({ ...current, image: url }))}
            />
            <Field label="Text">
              <textarea
                className={textareaClass}
                value={draft.text}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, text: event.target.value }))
                }
              />
            </Field>
            <Field label="Order" hint="Lowest order becomes the lead slide.">
              <input
                type="number"
                className={inputClass}
                value={draft.order}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    order: Number(event.target.value) || 0,
                  }))
                }
              />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, active: event.target.checked }))
                }
              />
              Active (shown on the homepage)
            </label>
            <button
              type="submit"
              className="rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {editingId ? "Update slide" : "Create slide"}
            </button>
            <FeedbackBanner feedback={feedback} message={message} />
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
