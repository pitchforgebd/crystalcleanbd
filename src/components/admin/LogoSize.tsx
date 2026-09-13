"use client";

import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";

const MIN = 16;
const MAX = 160;

type Props = {
  label: string;
  /** Height in pixels. */
  value: number;
  /** Image to preview at that height. */
  src: string;
  /** Preview on a dark strip, matching the footer. */
  dark?: boolean;
  onChange: (height: number) => void;
};

/**
 * Pixel height control with a live preview, so the size can be judged by eye
 * rather than by guessing a number and reloading the site.
 */
export function LogoSize({ label, value, src, dark = false, onChange }: Props) {
  const id = useId();
  const clamp = (next: number) => Math.min(MAX, Math.max(MIN, Math.round(next)));

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-xs text-[var(--ink-muted)]">
          {MIN}–{MAX} px
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={value}
          onChange={(event) => onChange(clamp(Number(event.target.value)))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--line)] accent-[var(--brand-deep)]"
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={MIN}
            max={MAX}
            value={value}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) onChange(clamp(next));
            }}
            className="w-16 rounded-lg border border-[var(--line)] bg-white px-2 py-1.5 text-sm tabular-nums outline-none transition focus:border-[var(--brand)]"
          />
          <span className="text-xs text-[var(--ink-muted)]">px</span>
        </div>
      </div>

      <div
        className={cn(
          "mt-2 flex items-center gap-3 overflow-hidden rounded-xl border border-[var(--line)] px-4 py-3",
          dark ? "bg-[var(--brand-deep)]" : "bg-white",
        )}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            width={512}
            height={224}
            unoptimized
            style={{ height: `${value}px`, width: "auto" }}
            className="max-w-[70%] object-contain"
          />
        ) : (
          <span
            className={cn(
              "text-xs",
              dark ? "text-white/70" : "text-[var(--ink-muted)]",
            )}
          >
            Upload a logo to preview it here.
          </span>
        )}
        <span
          className={cn(
            "ml-auto shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em]",
            dark ? "text-white/60" : "text-[var(--ink-muted)]",
          )}
        >
          preview
        </span>
      </div>
    </div>
  );
}
