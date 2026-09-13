import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display-font text-3xl text-[var(--brand)]">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({
  active,
  label,
}: {
  active: boolean;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {label ?? (active ? "Active" : "Inactive")}
    </span>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_10px_30px_rgba(1,87,189,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] bg-[#f7fbfc] text-xs uppercase tracking-[0.08em] text-[var(--ink-muted)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-[var(--ink-muted)]">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]";

export const textareaClass = `${inputClass} min-h-28`;
