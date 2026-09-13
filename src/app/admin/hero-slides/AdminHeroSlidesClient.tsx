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
};

export function AdminHeroSlidesClient({ initial }: Props) {
  const [draft, setDraft] = useState<SlideDraft>(emptySlide);

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
    onSaved: () => setDraft(emptySlide),
  });

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
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Hero Slides"
        description="Manage homepage hero slider content, imagery, and CTAs."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <AdminTable headers={["Heading", "Subheading", "CTA", "Actions"]}>
          {slides.map((slide) => (
            <tr key={slide.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">{slide.heading}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{slide.subheading}</td>
              <td className="px-4 py-3">{slide.ctaLabel}</td>
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
