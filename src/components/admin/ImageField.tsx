"use client";

import Image from "next/image";
import { useId, useRef, useState, type DragEvent } from "react";
import { Field } from "@/components/admin/AdminUi";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  hint?: string;
  /** Current image URL — an uploaded path or an external URL. */
  value: string;
  onChange: (url: string) => void;
};

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

/**
 * Upload-or-paste image control. Uploading posts to /api/admin/upload and
 * stores the returned path; the URL box stays available for images that are
 * already hosted somewhere else.
 */
export function ImageField({ label, hint, value, onChange }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = (await response.json()) as
        | { ok: true; url: string }
        | { ok: false; error: string };

      if (!result.ok) {
        setError(result.error);
        return;
      }
      onChange(result.url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex items-center gap-3 rounded-xl border border-dashed p-2.5 transition",
            dragging
              ? "border-[var(--brand)] bg-[var(--accent-soft)]"
              : "border-[var(--line)] bg-white",
          )}
        >
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--sand)]">
            {value ? (
              <Image
                src={value}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                None
              </span>
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor={inputId}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold text-white transition",
                  uploading
                    ? "bg-[var(--silver)]"
                    : "bg-[var(--brand-deep)] hover:bg-[#01458f]",
                )}
              >
                {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
              </label>
              {value ? (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="text-xs font-semibold text-[var(--danger)]"
                >
                  Remove
                </button>
              ) : null}
              <span className="text-[11px] text-[var(--ink-muted)]">
                or drag a file here · JPG, PNG, GIF, WEBP up to 5 MB
              </span>
            </div>

            <input
              id={inputId}
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />

            {/* Deliberately type="text": a type="url" input fails HTML5
                validation for uploaded paths like /uploads/2026/09/a.png and
                silently blocks the whole form from submitting. */}
            <input
              type="text"
              inputMode="url"
              value={value}
              placeholder="…or paste an image URL"
              onChange={(event) => onChange(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs outline-none transition focus:border-[var(--brand)]"
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="text-xs font-medium text-[var(--danger)]">
            {error}
          </p>
        ) : null}
      </div>
    </Field>
  );
}
