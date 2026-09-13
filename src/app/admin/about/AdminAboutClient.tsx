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
import { ImageField } from "@/components/admin/ImageField";
import type { AboutContent } from "@/lib/types";
import { updateAboutContent } from "@/server/actions/about";

type Props = { initial: AboutContent };

export function AdminAboutClient({ initial }: Props) {
  const [form, setForm] = useState({
    introduction: initial.introduction,
    mission: initial.mission,
    vision: initial.vision,
    proprietorMessage: initial.proprietorMessage,
    teamImage: initial.teamImage,
    teamImageAlt: initial.teamImageAlt,
    workspaceImage: initial.workspaceImage,
    workspaceImageAlt: initial.workspaceImageAlt,
    contactImage: initial.contactImage,
    contactImageAlt: initial.contactImageAlt,
    // One value per line as "Title | Description"
    valuesText: initial.values.map((v) => `${v.title} | ${v.description}`).join("\n"),
    whyText: initial.whyChooseUs.join("\n"),
  });

  const { feedback, message, isPending, execute } = useServerAction(updateAboutContent, {
    successMessage: "About page saved.",
    errorPrefix: "Save failed:",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.introduction.trim()) return;

    const { valuesText, whyText, ...rest } = form;
    execute({
      ...rest,
      values: valuesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, ...description] = line.split("|");
          return { title: title.trim(), description: description.join("|").trim() };
        }),
      whyChooseUs: whyText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="About Page"
        description="Company story, mission and vision, values, and the images used on /about."
      />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-deep)]">Story</h2>
          <div className="space-y-4">
            <Field label="Introduction">
              <textarea
                className={textareaClass}
                value={form.introduction}
                onChange={(event) => set("introduction", event.target.value)}
              />
            </Field>
            <Field label="Mission">
              <textarea
                className={textareaClass}
                value={form.mission}
                onChange={(event) => set("mission", event.target.value)}
              />
            </Field>
            <Field label="Vision">
              <textarea
                className={textareaClass}
                value={form.vision}
                onChange={(event) => set("vision", event.target.value)}
              />
            </Field>
            <Field label="Proprietor message">
              <textarea
                className={textareaClass}
                value={form.proprietorMessage}
                onChange={(event) => set("proprietorMessage", event.target.value)}
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-deep)]">
            Values and highlights
          </h2>
          <div className="space-y-4">
            <Field label="Values" hint="One per line as Title | Description">
              <textarea
                className={textareaClass}
                rows={6}
                value={form.valuesText}
                onChange={(event) => set("valuesText", event.target.value)}
              />
            </Field>
            <Field label="Why choose us" hint="One point per line">
              <textarea
                className={textareaClass}
                rows={6}
                value={form.whyText}
                onChange={(event) => set("whyText", event.target.value)}
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-deep)]">Images</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-3">
              <ImageField
                label="Team photo"
                value={form.teamImage}
                onChange={(url) => set("teamImage", url)}
              />
              <Field label="Team photo alt text">
                <input
                  className={inputClass}
                  value={form.teamImageAlt}
                  onChange={(event) => set("teamImageAlt", event.target.value)}
                />
              </Field>
            </div>
            <div className="space-y-3">
              <ImageField
                label="Workspace photo"
                value={form.workspaceImage}
                onChange={(url) => set("workspaceImage", url)}
              />
              <Field label="Workspace photo alt text">
                <input
                  className={inputClass}
                  value={form.workspaceImageAlt}
                  onChange={(event) => set("workspaceImageAlt", event.target.value)}
                />
              </Field>
            </div>
            <div className="space-y-3">
              <ImageField
                label="Contact photo"
                value={form.contactImage}
                onChange={(url) => set("contactImage", url)}
              />
              <Field label="Contact photo alt text">
                <input
                  className={inputClass}
                  value={form.contactImageAlt}
                  onChange={(event) => set("contactImageAlt", event.target.value)}
                />
              </Field>
            </div>
          </div>
        </AdminCard>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save about page"}
          </button>
          <FeedbackBanner feedback={feedback} message={message} />
        </div>
      </form>
    </div>
  );
}
