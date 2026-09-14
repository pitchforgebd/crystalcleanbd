"use client";

import { FormEvent, useState } from "react";
import { FeedbackBanner, useServerAction } from "@/components/admin/AdminActions";
import { AdminCard, AdminPageHeader, Field, inputClass, textareaClass } from "@/components/admin/AdminUi";
import type { HeroContent } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import { updateHeroContent } from "@/server/actions/hero";

type Props = { initial: HeroContent };

export function AdminHeroClient({ initial }: Props) {
  const [form, setForm] = useState<HeroContent>(initial);

  const { feedback, message, isPending, execute } = useServerAction(updateHeroContent, {
    successMessage: "Hero section saved.",
    errorPrefix: "Save failed:",
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.heading.trim()) return;
    execute(form);
  }

  return (
    <div>
      <AdminPageHeader
        title="Hero Section"
        description="The homepage hero is a single static section, not a slider. Edit its headline, paragraph, button, and the three floating photos."
      />
      <AdminCard>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Heading">
              <input
                className={inputClass}
                value={form.heading}
                onChange={(event) => setForm((c) => ({ ...c, heading: event.target.value }))}
              />
            </Field>
          </div>
          <Field label="Subheading" hint="Shown next to the brand name badge.">
            <input
              className={inputClass}
              value={form.subheading}
              onChange={(event) => setForm((c) => ({ ...c, subheading: event.target.value }))}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Text" hint="Paragraph under the heading.">
              <textarea
                className={textareaClass}
                value={form.text}
                onChange={(event) => setForm((c) => ({ ...c, text: event.target.value }))}
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

          <div className="md:col-span-2 mt-2 border-t border-[var(--line)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--brand)]">Photo 1 — large, top-left</h3>
          </div>
          <ImageField
            label="Image"
            value={form.image1}
            onChange={(url) => setForm((c) => ({ ...c, image1: url }))}
          />
          <Field label="Alt text">
            <input
              className={inputClass}
              value={form.image1Alt}
              onChange={(event) => setForm((c) => ({ ...c, image1Alt: event.target.value }))}
            />
          </Field>

          <div className="md:col-span-2 border-t border-[var(--line)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--brand)]">Photo 2 — mid, right</h3>
          </div>
          <ImageField
            label="Image"
            value={form.image2}
            onChange={(url) => setForm((c) => ({ ...c, image2: url }))}
          />
          <Field label="Alt text">
            <input
              className={inputClass}
              value={form.image2Alt}
              onChange={(event) => setForm((c) => ({ ...c, image2Alt: event.target.value }))}
            />
          </Field>

          <div className="md:col-span-2 border-t border-[var(--line)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--brand)]">Photo 3 — small, bottom-left</h3>
          </div>
          <ImageField
            label="Image"
            value={form.image3}
            onChange={(url) => setForm((c) => ({ ...c, image3: url }))}
          />
          <Field label="Alt text">
            <input
              className={inputClass}
              value={form.image3Alt}
              onChange={(event) => setForm((c) => ({ ...c, image3Alt: event.target.value }))}
            />
          </Field>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Save hero section"}
            </button>
            <FeedbackBanner feedback={feedback} message={message} />
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
