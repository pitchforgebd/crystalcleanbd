"use client";

import { useState, useTransition } from "react";
import { ConfirmDeleteButton, FeedbackBanner } from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  AdminTable,
  StatusBadge,
} from "@/components/admin/AdminUi";
import type { ContactMessage } from "@/lib/admin-types";
import { deleteMessage, updateMessageStatus } from "@/server/actions/messages";
import { formatDateTime } from "@/lib/utils";

type MailStatus = { configured: true; to: string } | { configured: false };
type Props = { initial: ContactMessage[]; mail: MailStatus };

export function AdminMessagesClient({ initial, mail }: Props) {
  const [rows, setRows] = useState<ContactMessage[]>(initial);
  const [selected, setSelected] = useState<ContactMessage | null>(rows[0] ?? null);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function markStatus(id: string, status: ContactMessage["status"]) {
    const previous = rows;
    setRows((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    setSelected((current) =>
      current && current.id === id ? { ...current, status } : current,
    );
    startTransition(async () => {
      const result = await updateMessageStatus({ id, status });
      if (!result.ok) {
        setRows(previous);
        setFeedback("error");
        setMessage(result.error);
        return;
      }
      setFeedback("success");
      setMessage(`Marked as ${status}.`);
    });
  }

  function removeMessage(id: string) {
    const previous = rows;
    setRows((current) => current.filter((item) => item.id !== id));
    setSelected((current) => (current?.id === id ? null : current));
    startTransition(async () => {
      const result = await deleteMessage({ id });
      if (!result.ok) {
        setRows(previous);
        setFeedback("error");
        setMessage(result.error);
        return;
      }
      setFeedback("success");
      setMessage("Message deleted.");
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Contact Messages"
        description="Inbound submissions from the website contact form."
      />

      {/* Operators need to know whether new enquiries reach their inbox. */}
      <div
        className={
          mail.configured
            ? "mb-5 rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--brand-deep)]"
            : "mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        }
      >
        {mail.configured ? (
          <>
            <strong className="font-semibold">Email notifications are on.</strong> New
            messages are emailed to {mail.to}.
          </>
        ) : (
          <>
            <strong className="font-semibold">Email notifications are off.</strong>{" "}
            Messages are stored here, but nobody is notified. Set SMTP_HOST and
            CONTACT_TO_EMAIL in the environment to turn delivery on.
          </>
        )}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Subject", "From", "Status", "Actions"]}>
          {rows.map((message) => (
            <tr key={message.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">{message.subject}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{message.name}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  active={message.status === "new"}
                  label={message.status}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => {
                      setSelected(message);
                      if (message.status === "new") markStatus(message.id, "read");
                    }}
                  >
                    Open
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => removeMessage(message.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminCard>
          {selected ? (
            <div className="space-y-3 text-sm">
              <h2 className="text-lg font-semibold text-[var(--brand)]">{selected.subject}</h2>
              <p>
                <span className="font-medium">From:</span> {selected.name} ({selected.email})
              </p>
              <p>
                <span className="font-medium">Phone:</span> {selected.phone}
              </p>
              <p>
                <span className="font-medium">Received:</span>{" "}
                {formatDateTime(selected.createdAt)}
              </p>
              <p className="rounded-xl bg-[#f7fbfc] p-4 leading-relaxed text-[var(--ink)]">
                {selected.message}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                  onClick={() => markStatus(selected.id, "read")}
                >
                  Mark read
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                  onClick={() => markStatus(selected.id, "archived")}
                >
                  Archive
                </button>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)]"
                >
                  Reply by email
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--ink-muted)]">No message selected.</p>
          )}
        </AdminCard>
      </div>
      <FeedbackBanner feedback={feedback} message={message} />
    </div>
  );
}
