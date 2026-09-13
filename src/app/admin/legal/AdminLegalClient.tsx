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
import type { LegalPageShape } from "@/lib/mappers";
import { updateLegalPage } from "@/server/actions/legal";

type Props = { initial: { terms: LegalPageShape; privacy: LegalPageShape } };

export function AdminLegalClient({ initial }: Props) {
  const [active, setActive] = useState<"terms" | "privacy">("terms");
  const [terms, setTerms] = useState(initial.terms);
  const [privacy, setPrivacy] = useState(initial.privacy);
  const current = active === "terms" ? terms : privacy;
  const setCurrent = active === "terms" ? setTerms : setPrivacy;

  const { feedback, message, isPending, execute } = useServerAction(updateLegalPage, {
    successMessage: "Legal page saved.",
    errorPrefix: "Save failed:",
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!current.title.trim()) return;
    execute({
      kind: active,
      title: current.title,
      updated: current.updated,
      sections: current.sections,
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Legal Pages"
        description="Edit Terms & Conditions and Privacy Policy sample content."
      />
      <div className="mb-4 flex gap-2">
        {(
          [
            ["terms", "Terms & Conditions"],
            ["privacy", "Privacy Policy"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              active === key
                ? "bg-[var(--brand-deep)] text-white"
                : "border border-[var(--line)] bg-white text-[var(--brand-deep)]"
            }`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <AdminCard>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Page title">
            <input
              className={inputClass}
              value={current.title}
              onChange={(event) =>
                setCurrent((c) => ({ ...c, title: event.target.value }))
              }
            />
          </Field>
          <Field label="Updated date">
            <input
              className={inputClass}
              value={current.updated}
              onChange={(event) =>
                setCurrent((c) => ({ ...c, updated: event.target.value }))
              }
            />
          </Field>
          {current.sections.map((section, index) => (
            <div key={`${section.heading}-${index}`} className="grid gap-3 md:grid-cols-2">
              <Field label={`Section ${index + 1} heading`}>
                <input
                  className={inputClass}
                  value={section.heading}
                  onChange={(event) =>
                    setCurrent((c) => ({
                      ...c,
                      sections: c.sections.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, heading: event.target.value }
                          : item,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Body">
                <textarea
                  className={textareaClass}
                  value={section.body}
                  onChange={(event) =>
                    setCurrent((c) => ({
                      ...c,
                      sections: c.sections.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, body: event.target.value }
                          : item,
                      ),
                    }))
                  }
                />
              </Field>
            </div>
          ))}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save legal page"}
          </button>
          <FeedbackBanner feedback={feedback} message={message} />
        </form>
      </AdminCard>
    </div>
  );
}
