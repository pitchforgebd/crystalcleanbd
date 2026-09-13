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
} from "@/components/admin/AdminUi";
import type { Statistic } from "@/lib/types";
import {
  createStatistic,
  deleteStatistic,
  updateStatistic,
} from "@/server/actions/statistics";

type StatisticDraft = { label: string; value: number; suffix: string; order: number };
const emptyDraft: StatisticDraft = { label: "", value: 0, suffix: "+", order: 0 };

type Props = { initial: Statistic[] };

export function AdminStatisticsClient({ initial }: Props) {
  const [draft, setDraft] = useState<StatisticDraft>(emptyDraft);

  const crud = useAdminCrud<Statistic, StatisticDraft>({
    initial,
    create: createStatistic,
    update: updateStatistic,
    remove: deleteStatistic,
    noun: "Statistic",
    toRow: (values, id) => ({
      id,
      label: values.label,
      value: values.value,
      suffix: values.suffix,
    }),
    onSaved: () => setDraft(emptyDraft),
  });
  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } = crud;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.label.trim()) return;
    save(draft);
  }

  return (
    <div>
      <AdminPageHeader
        title="Statistics"
        description="Manage animated counter values shown on the homepage."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Label", "Value", "Suffix", "Actions"]}>
          {rows.map((stat) => (
            <tr key={stat.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">{stat.label}</td>
              <td className="px-4 py-3">{stat.value}</td>
              <td className="px-4 py-3">{stat.suffix}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => {
                      setEditingId(stat.id);
                      setDraft({
                        label: stat.label,
                        value: stat.value,
                        suffix: stat.suffix,
                        order: rows.findIndex((row) => row.id === stat.id) + 1,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(stat.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit statistic" : "Add statistic"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Label">
              <input
                className={inputClass}
                value={draft.label}
                onChange={(event) => setDraft((c) => ({ ...c, label: event.target.value }))}
              />
            </Field>
            <Field label="Value">
              <input
                className={inputClass}
                type="number"
                value={draft.value}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, value: Number(event.target.value) || 0 }))
                }
              />
            </Field>
            <Field label="Suffix">
              <input
                className={inputClass}
                value={draft.suffix}
                onChange={(event) => setDraft((c) => ({ ...c, suffix: event.target.value }))}
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
