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
} from "@/components/admin/AdminUi";
import type { ClientLogo } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import { createClient, deleteClient, updateClient } from "@/server/actions/clients";

type ClientDraft = { name: string; logoSrc: string; logoAlt: string; order: number; active: boolean };
const emptyDraft: ClientDraft = { name: "", logoSrc: "", logoAlt: "", order: 0, active: true };

type Props = { initial: ClientLogo[] };

export function AdminClientsClient({ initial }: Props) {
  const [draft, setDraft] = useState<ClientDraft>(emptyDraft);

  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<ClientLogo, ClientDraft>({
      initial,
      create: createClient,
      update: updateClient,
      remove: deleteClient,
      noun: "Client",
      toRow: (values, id) => ({ id, ...values }),
      onSaved: () => setDraft({ ...emptyDraft, order: sorted.length }),
    });
  const sorted = [...rows].sort((a, b) => a.order - b.order);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.logoSrc.trim()) return;
    save({ ...draft, logoAlt: draft.logoAlt.trim() || `${draft.name.trim()} logo` });
  }

  return (
    <div>
      <AdminPageHeader
        title="Clients"
        description="Manage client logos shown in the homepage scrolling strip."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Order", "Client", "Logo path", "Status", "Actions"]}>
          {sorted.map((client) => (
            <tr key={client.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 tabular-nums">{client.order}</td>
              <td className="px-4 py-3 font-medium">{client.name}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{client.logoSrc}</td>
              <td className="px-4 py-3">
                <StatusBadge active={client.active} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => {
                      setEditingId(client.id);
                      setDraft({
                        name: client.name,
                        logoSrc: client.logoSrc,
                        logoAlt: client.logoAlt,
                        order: client.order,
                        active: client.active,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(client.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit client" : "Add client"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) => setDraft((c) => ({ ...c, name: event.target.value }))}
              />
            </Field>
            <ImageField
              label="Client logo"
              hint="A wide logo on a light background works best."
              value={draft.logoSrc}
              onChange={(url) => setDraft((c) => ({ ...c, logoSrc: url }))}
            />
            <Field label="Logo alt text">
              <input
                className={inputClass}
                value={draft.logoAlt}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, logoAlt: event.target.value }))
                }
              />
            </Field>
            <Field label="Order">
              <input
                type="number"
                className={inputClass}
                value={draft.order}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, order: Number(event.target.value) || 0 }))
                }
              />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) => setDraft((c) => ({ ...c, active: event.target.checked }))}
              />
              Active (shown on the homepage)
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
