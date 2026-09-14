"use client";

import { FormEvent, useState } from "react";
import {
  ConfirmDeleteButton,
  FeedbackBanner,
  useAdminCrud,
} from "@/components/admin/AdminActions";
import { AdminCard, Field, StatusBadge, inputClass } from "@/components/admin/AdminUi";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { SocialLink } from "@/lib/types";
import {
  createSocialLink,
  deleteSocialLink,
  updateSocialLink,
} from "@/server/actions/social";
import { cn } from "@/lib/utils";

type Platform = SocialLink["platform"];

const PLATFORMS: { value: Platform; label: string; placeholder: string }[] = [
  { value: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourpage" },
  { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { value: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/you" },
  { value: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourpage" },
  { value: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/8801700000000" },
];

type Draft = { platform: Platform; label: string; href: string; order: number; active: boolean };

const emptyDraft: Draft = {
  platform: "facebook",
  label: "Facebook",
  href: "",
  order: 0,
  active: true,
};

/**
 * Social links live in their own card rather than inside the settings form:
 * HTML forms cannot nest, and each link saves on its own.
 */
export function AdminSocialLinks({ initial }: { initial: SocialLink[] }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<SocialLink, Draft>({
      initial,
      create: createSocialLink,
      update: updateSocialLink,
      remove: deleteSocialLink,
      noun: "Social link",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft({ ...emptyDraft, order: sorted.length }),
    });
  const sorted = [...rows].sort((a, b) => a.order - b.order);

  const placeholder =
    PLATFORMS.find((item) => item.value === draft.platform)?.placeholder ?? "";

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.label.trim() || !draft.href.trim()) return;
    save(draft);
  }

  return (
    <AdminCard className="lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--brand-deep)]">Social links</h2>
        <p className="text-xs text-[var(--ink-muted)]">
          Shown in the top bar and the footer. A WhatsApp link also powers the floating
          chat button.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {sorted.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--line)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
              No social links yet — add the first one on the right.
            </p>
          ) : (
            <ul className="space-y-2">
              {sorted.map((link) => (
                <li
                  key={link.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 rounded-xl border p-3 transition",
                    editingId === link.id
                      ? "border-[var(--brand)] bg-[var(--accent-soft)]"
                      : "border-[var(--line)]",
                  )}
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-deep)] text-white">
                    <SocialIcon platform={link.platform} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{link.label}</span>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-xs text-[var(--ink-muted)] underline-offset-2 hover:underline"
                    >
                      {link.href}
                    </a>
                  </span>
                  <StatusBadge active={link.active} />
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isPending}
                      className="text-xs font-semibold text-[var(--brand)] disabled:opacity-50"
                      onClick={() => {
                        setEditingId(link.id);
                        setDraft({
                          platform: link.platform,
                          label: link.label,
                          href: link.href,
                          order: link.order,
                          active: link.active,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <ConfirmDeleteButton
                      disabled={isPending}
                      onConfirm={() => destroy(link.id)}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Platform">
            <select
              className={inputClass}
              value={draft.platform}
              onChange={(event) => {
                const platform = event.target.value as Platform;
                const preset = PLATFORMS.find((item) => item.value === platform);
                setDraft((current) => ({
                  ...current,
                  platform,
                  // Keep a custom label, otherwise follow the platform name.
                  label:
                    PLATFORMS.some((item) => item.label === current.label) || !current.label
                      ? (preset?.label ?? current.label)
                      : current.label,
                }));
              }}
            >
              {PLATFORMS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Label" hint="Used as the link's accessible name.">
            <input
              className={inputClass}
              value={draft.label}
              onChange={(event) =>
                setDraft((current) => ({ ...current, label: event.target.value }))
              }
            />
          </Field>

          <Field label="Link" hint="Full URL, e.g. https://…">
            <input
              className={inputClass}
              type="text"
              inputMode="url"
              placeholder={placeholder}
              value={draft.href}
              onChange={(event) =>
                setDraft((current) => ({ ...current, href: event.target.value }))
              }
            />
          </Field>

          <Field label="Order">
            <input
              type="number"
              className={inputClass}
              value={draft.order}
              onChange={(event) =>
                setDraft((current) => ({ ...current, order: Number(event.target.value) || 0 }))
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
            Active (shown in the top bar / footer)
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-[var(--brand-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
            >
              {isPending ? "Saving…" : editingId ? "Update link" : "Add link"}
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
      </div>
    </AdminCard>
  );
}
