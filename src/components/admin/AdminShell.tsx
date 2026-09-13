"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { adminNav } from "@/lib/admin-config";
import { useSiteInfo } from "@/components/admin/AdminSiteContext";
import { signOut } from "@/server/actions/auth";
import type { AdminIdentity } from "@/lib/auth/current";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  admin,
}: {
  children: ReactNode;
  admin: AdminIdentity | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const siteInfo = useSiteInfo();
  const [open, setOpen] = useState(false);
  const [signingOut, startSignOut] = useTransition();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full bg-[#eef3f8] text-[var(--ink)]">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--line)] bg-[var(--brand-deep)] text-white transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="border-b border-white/10 px-4 py-4">
            <BrandLogo
              href="/admin"
              src={siteInfo.mainLogo}
              alt={`${siteInfo.brandName} logo`}
              imageClassName="h-8 w-auto max-w-[120px] rounded-md bg-black/30 p-0.5"
            />
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/80">
              Admin dashboard
            </p>
          </div>
          <nav
            className="h-[calc(100vh-110px)] space-y-1 overflow-y-auto px-3 py-4"
            aria-label="Admin"
          >
            {adminNav
              .filter((item) => !item.ownerOnly || admin?.role === "owner")
              .map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-white/15 font-semibold text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[var(--line)] bg-white/90 px-4 py-3 backdrop-blur md:px-6">
            <button
              type="button"
              className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--brand-deep)]">
                Content management
              </p>
              <p className="truncate text-xs text-[var(--ink-muted)]">
                MySQL connected · signed in as {admin?.email ?? "unknown"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{admin?.name ?? siteInfo.brandName}</p>
                <p className="text-xs capitalize text-[var(--ink-muted)]">
                  {admin?.role ?? "Admin"}
                </p>
              </div>
              <Image
                src="/brand/crystal-clean-logo.jpg"
                alt=""
                width={36}
                height={36}
                className="hidden h-9 w-9 rounded-full object-cover sm:block"
              />
              <button
                type="button"
                disabled={signingOut}
                onClick={() =>
                  startSignOut(async () => {
                    await signOut();
                    router.replace("/admin/login");
                    router.refresh();
                  })
                }
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] transition hover:border-[var(--brand)] hover:bg-[var(--accent-soft)] disabled:opacity-50"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </header>
          <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
