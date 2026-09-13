"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FeedbackBanner } from "@/components/admin/AdminActions";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUi";
import { deleteOrphanUploads } from "@/server/actions/storage";
import { cn, formatDateTime } from "@/lib/utils";

type FileRow = { url: string; size: number; modifiedAt: string };

type Props = {
  orphans: FileRow[];
  recent: FileRow[];
  fileCount: number;
  totalBytes: number;
  orphanBytes: number;
  graceHours: number;
};

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminStorageClient({
  orphans,
  recent,
  fileCount,
  totalBytes,
  orphanBytes,
  graceHours,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(orphans.map((file) => file.url));
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedBytes = orphans
    .filter((file) => selected.includes(file.url))
    .reduce((sum, file) => sum + file.size, 0);

  function toggle(url: string) {
    setSelected((current) =>
      current.includes(url) ? current.filter((item) => item !== url) : [...current, url],
    );
  }

  function onDelete() {
    startTransition(async () => {
      const result = await deleteOrphanUploads(selected);
      if (!result.ok) {
        setFeedback("error");
        setMessage(result.error);
        return;
      }
      setFeedback("success");
      setMessage(
        `Deleted ${result.data.deleted} file${result.data.deleted === 1 ? "" : "s"} and freed ${humanSize(result.data.freedBytes)}.`,
      );
      setSelected([]);
      router.refresh();
    });
  }

  const stats = [
    { label: "Files stored", value: String(fileCount) },
    { label: "Total size", value: humanSize(totalBytes) },
    { label: "Unused", value: `${orphans.length} · ${humanSize(orphanBytes)}` },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Storage"
        description="Images uploaded from this dashboard. Files nothing links to can be deleted here."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              {stat.label}
            </p>
            <p className="mt-2 display-font text-2xl text-[var(--brand-deep)]">{stat.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <AdminCard>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--brand-deep)]">
              Unused files ({orphans.length})
            </h2>
            {orphans.length > 0 ? (
              <button
                type="button"
                className="text-xs font-semibold text-[var(--brand)]"
                onClick={() =>
                  setSelected((current) =>
                    current.length === orphans.length ? [] : orphans.map((file) => file.url),
                  )
                }
              >
                {selected.length === orphans.length ? "Clear selection" : "Select all"}
              </button>
            ) : null}
          </div>

          {orphans.length === 0 ? (
            <p className="text-sm text-[var(--ink-muted)]">
              Nothing to clean up — every stored file is used somewhere on the site.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {orphans.map((file) => {
                  const checked = selected.includes(file.url);
                  return (
                    <li key={file.url}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition",
                          checked
                            ? "border-[var(--brand)] bg-[var(--accent-soft)]"
                            : "border-[var(--line)] hover:bg-[var(--sand)]",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(file.url)}
                          className="h-4 w-4 accent-[var(--brand-deep)]"
                        />
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--sand)]">
                          <Image
                            src={file.url}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{file.url}</span>
                          <span className="block text-xs text-[var(--ink-muted)]">
                            {humanSize(file.size)} · uploaded{" "}
                            {formatDateTime(file.modifiedAt).split(" ")[0]}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={isPending || selected.length === 0}
                  onClick={onDelete}
                  className="rounded-full bg-[var(--danger)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                >
                  {isPending
                    ? "Deleting…"
                    : `Delete ${selected.length} file${selected.length === 1 ? "" : "s"} (${humanSize(selectedBytes)})`}
                </button>
                <span className="text-xs text-[var(--ink-muted)]">
                  This cannot be undone.
                </span>
              </div>
            </>
          )}

          <FeedbackBanner feedback={feedback} message={message} />
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-lg font-semibold text-[var(--brand-deep)]">
            How this works
          </h2>
          <ul className="space-y-2.5 text-sm leading-relaxed text-[var(--ink-muted)]">
            <li>
              Every piece of content is scanned for image paths — including text such as blog
              paragraphs — so a file in use is never offered for deletion.
            </li>
            <li>
              Files uploaded in the last {graceHours} hours are held back, in case you are
              still filling in the form they belong to.
            </li>
            <li>The list is recalculated when you press delete, so it cannot go stale.</li>
          </ul>

          {recent.length > 0 ? (
            <p className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--sand)] px-3 py-2.5 text-xs text-[var(--ink-muted)]">
              {recent.length} recently uploaded file{recent.length === 1 ? " is" : "s are"} not
              linked to anything yet. They will appear here after {graceHours} hours.
            </p>
          ) : null}
        </AdminCard>
      </div>
    </div>
  );
}
