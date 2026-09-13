"use client";

import { FormEvent, useState } from "react";
import { FeedbackBanner, useServerAction } from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  Field,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import type { ConcernContent } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import { updateConcernContent } from "@/server/actions/concern";

type Props = { initial: ConcernContent };

export function AdminConcernClient({ initial }: Props) {
  const [form, setForm] = useState({
    name: initial.name,
    tagline: initial.tagline,
    introduction: initial.introduction,
    brandingNote: initial.brandingNote,
    image: initial.image,
    imageAlt: initial.imageAlt,
    ctaLabel: initial.ctaLabel,
    ctaHref: initial.ctaHref,
    featuresText:
      initial.features.length > 0
        ? initial.features.map((f) => `${f.title} | ${f.description}`).join("\n")
        : "",
  });

  const { feedback, message, isPending, execute } = useServerAction(updateConcernContent, {
    successMessage: "Concern page saved.",
    errorPrefix: "Save failed:",
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.introduction.trim()) return;
    const { featuresText, ...rest } = form;
    execute({
      ...rest,
      // one feature per line, "Title | Description"
      features: featuresText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, ...description] = line.split("|");
          return {
            title: title.trim(),
            description: description.join("|").trim(),
          };
        }),
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Our Concern"
        description="Edit Crystal Force concern page content and feature highlights."
      />
      <AdminCard>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Concern name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(event) => setForm((c) => ({ ...c, name: event.target.value }))}
            />
          </Field>
          <Field label="Tagline">
            <input
              className={inputClass}
              value={form.tagline}
              onChange={(event) => setForm((c) => ({ ...c, tagline: event.target.value }))}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Introduction">
              <textarea
                className={textareaClass}
                value={form.introduction}
                onChange={(event) =>
                  setForm((c) => ({ ...c, introduction: event.target.value }))
                }
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Branding note">
              <textarea
                className={textareaClass}
                value={form.brandingNote}
                onChange={(event) =>
                  setForm((c) => ({ ...c, brandingNote: event.target.value }))
                }
              />
            </Field>
          </div>
          <ImageField
            label="Concern image"
            value={form.image}
            onChange={(url) => setForm((c) => ({ ...c, image: url }))}
          />
          <Field label="Image alt text">
            <input
              className={inputClass}
              value={form.imageAlt}
              onChange={(event) => setForm((c) => ({ ...c, imageAlt: event.target.value }))}
            />
          </Field>
          <div className="md:col-span-2">
            <Field
              label="Features"
              hint="One per line as Title | Description"
            >
              <textarea
                className={textareaClass}
                value={form.featuresText}
                onChange={(event) =>
                  setForm((c) => ({ ...c, featuresText: event.target.value }))
                }
              />
            </Field>
          </div>
          <Field label="CTA label">
            <input
              className={inputClass}
              value={form.ctaLabel}
              onChange={(event) => setForm((c) => ({ ...c, ctaLabel: event.target.value }))}
            />
          </Field>
          <Field label="CTA href">
            <input
              className={inputClass}
              value={form.ctaHref}
              onChange={(event) => setForm((c) => ({ ...c, ctaHref: event.target.value }))}
            />
          </Field>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
            >
              Save concern content
            </button>
            <FeedbackBanner feedback={feedback} message={message} />
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
