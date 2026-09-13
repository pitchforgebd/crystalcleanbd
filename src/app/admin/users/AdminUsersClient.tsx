"use client";

import { FormEvent, useState, useTransition } from "react";
import { ConfirmDeleteButton, FeedbackBanner } from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  AdminTable,
  Field,
  StatusBadge,
  inputClass,
} from "@/components/admin/AdminUi";
import type { AdminUser } from "@/lib/admin-types";
import {
  createAdmin,
  deleteAdmin,
  resetAdminPassword,
  updateAdmin,
} from "@/server/actions/users";

type Props = { initial: AdminUser[]; currentId: string };

type Draft = {
  name: string;
  email: string;
  role: "owner" | "editor";
  password: string;
};

const emptyDraft: Draft = { name: "", email: "", role: "editor", password: "" };

export function AdminUsersClient({ initial, currentId }: Props) {
  const [rows, setRows] = useState<AdminUser[]>(initial);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const editing = rows.find((row) => row.id === editingId) ?? null;

  function run(
    action: () => Promise<{ ok: true; data: unknown } | { ok: false; error: string }>,
    onOk: (data: unknown) => void,
    successMessage: string,
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setFeedback("error");
        setMessage(result.error);
        return;
      }
      onOk(result.data);
      setFeedback("success");
      setMessage(successMessage);
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.email.trim()) return;

    if (editingId) {
      run(
        () =>
          updateAdmin({
            id: editingId,
            name: draft.name,
            email: draft.email,
            role: draft.role,
          }),
        (data) => {
          const updated = data as AdminUser;
          setRows((current) =>
            current.map((row) =>
              row.id === editingId
                ? { ...row, name: updated.name, email: updated.email, role: updated.role }
                : row,
            ),
          );
          setEditingId(null);
          setDraft(emptyDraft);
        },
        "Admin updated.",
      );
      return;
    }

    run(
      () => createAdmin(draft),
      (data) => {
        setRows((current) => [...current, data as AdminUser]);
        setDraft(emptyDraft);
      },
      "Admin created.",
    );
  }

  function onResetPassword(id: string) {
    if (!draft.password.trim()) {
      setFeedback("error");
      setMessage("Type the new password in the form first.");
      return;
    }
    run(
      () => resetAdminPassword({ id, password: draft.password }),
      () => setDraft((current) => ({ ...current, password: "" })),
      "Password set. Share it with them and ask them to change it.",
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Admin Users"
        description="Who can sign in to this dashboard. Owners manage admins; editors manage content."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminTable headers={["Name", "Email", "Role", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">
                {row.name}
                {row.id === currentId ? (
                  <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                    you
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.email}</td>
              <td className="px-4 py-3">
                <StatusBadge active={row.role === "owner"} label={row.role} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    className="text-xs font-semibold text-[var(--brand)] disabled:opacity-50"
                    onClick={() => {
                      setEditingId(row.id);
                      setDraft({
                        name: row.name,
                        email: row.email,
                        role: row.role === "owner" ? "owner" : "editor",
                        password: "",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    className="text-xs font-semibold text-[var(--ink-muted)] disabled:opacity-50"
                    onClick={() => onResetPassword(row.id)}
                  >
                    Set password
                  </button>
                  {row.id === currentId ? null : (
                    <ConfirmDeleteButton
                      disabled={isPending}
                      onConfirm={() =>
                        run(
                          () => deleteAdmin({ id: row.id }),
                          () => setRows((current) => current.filter((item) => item.id !== row.id)),
                          "Admin removed.",
                        )
                      }
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-deep)]">
            {editing ? `Edit ${editing.name}` : "Add admin"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, email: event.target.value }))
                }
              />
            </Field>
            <Field label="Role" hint="Owners can also manage admin users.">
              <select
                className={inputClass}
                value={draft.role}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    role: event.target.value as Draft["role"],
                  }))
                }
              >
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
            </Field>
            <Field
              label={editing ? "New password" : "Password"}
              hint={
                editing
                  ? "Type a password here, then use “Set password” on their row."
                  : "Minimum 8 characters."
              }
            >
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                value={draft.password}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, password: event.target.value }))
                }
              />
            </Field>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-[var(--brand-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
              >
                {isPending ? "Saving…" : editing ? "Update admin" : "Create admin"}
              </button>
              {editing ? (
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
