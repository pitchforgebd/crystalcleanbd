"use client";

import { useState, useTransition } from "react";
import { FeedbackBanner } from "@/components/admin/AdminActions";
import { AdminPageHeader, AdminTable, StatusBadge } from "@/components/admin/AdminUi";
import type { HomepageSection } from "@/lib/admin-types";
import { updateHomepageSection } from "@/server/actions/homepage";

type Props = { initial: HomepageSection[] };

export function AdminHomepageClient({ initial }: Props) {
  const [sections, setSections] = useState<HomepageSection[]>(initial);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  /** Persist the given rows, rolling the screen back if the server refuses. */
  function persist(next: HomepageSection[], changed: HomepageSection[], note: string) {
    const previous = sections;
    setSections(next);
    startTransition(async () => {
      for (const section of changed) {
        const result = await updateHomepageSection({
          key: section.key,
          name: section.name,
          enabled: section.enabled,
          order: section.order,
        });
        if (!result.ok) {
          setSections(previous);
          setFeedback("error");
          setMessage(result.error);
          return;
        }
      }
      setFeedback("success");
      setMessage(note);
    });
  }

  function toggle(section: HomepageSection) {
    const updated = { ...section, enabled: !section.enabled };
    persist(
      sections.map((item) => (item.id === section.id ? updated : item)),
      [updated],
      `${section.name} is now ${updated.enabled ? "visible" : "hidden"}.`,
    );
  }

  function move(section: HomepageSection, direction: -1 | 1) {
    const index = sections.findIndex((item) => item.id === section.id);
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const reordered = [...sections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const renumbered = reordered.map((item, position) => ({ ...item, order: position + 1 }));
    persist(renumbered, [renumbered[index], renumbered[target]], "Section order saved.");
  }

  return (
    <div>
      <AdminPageHeader
        title="Homepage"
        description="Toggle and order the sections shown on the public homepage. Changes save immediately."
      />
      <AdminTable headers={["Order", "Section", "Status", "Actions"]}>
        {sections.map((section, index) => (
          <tr key={section.id} className="border-b border-[var(--line)] last:border-0">
            <td className="px-4 py-3 tabular-nums">{section.order}</td>
            <td className="px-4 py-3 font-medium">{section.name}</td>
            <td className="px-4 py-3">
              <StatusBadge
                active={section.enabled}
                label={section.enabled ? "Visible" : "Hidden"}
              />
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  className="text-xs font-semibold text-[var(--brand)] disabled:opacity-50"
                  onClick={() => toggle(section)}
                >
                  {section.enabled ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  disabled={isPending || index === 0}
                  className="text-xs font-semibold text-[var(--ink-muted)] disabled:opacity-30"
                  onClick={() => move(section, -1)}
                  aria-label={`Move ${section.name} up`}
                >
                  ↑ Up
                </button>
                <button
                  type="button"
                  disabled={isPending || index === sections.length - 1}
                  className="text-xs font-semibold text-[var(--ink-muted)] disabled:opacity-30"
                  onClick={() => move(section, 1)}
                  aria-label={`Move ${section.name} down`}
                >
                  ↓ Down
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
      <FeedbackBanner feedback={feedback} message={message} />
    </div>
  );
}
