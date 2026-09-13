"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPhone } from "react-icons/fi";
import { TopBar } from "@/components/layout/TopBar";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { navLinks } from "@/lib/repository/nav";
import type { SiteInfo, SocialLink } from "@/lib/types";
import { cn, phoneHref } from "@/lib/utils";

type Props = {
  siteInfo: SiteInfo;
  socialLinks: SocialLink[];
};

export function Navbar({ siteInfo, socialLinks }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition duration-300",
        scrolled
          ? "border-b border-[var(--line)] bg-white/95 shadow-[0_12px_32px_rgba(1,87,189,0.08)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/90 backdrop-blur-md",
      )}
    >
      <TopBar siteInfo={siteInfo} socialLinks={socialLinks} collapsed={scrolled} />

      <div className="h-[3px] bg-[var(--brand)]" />

      <div className="container-page flex items-center justify-between gap-6 py-3.5 md:py-4">
        <BrandLogo
          priority
          src={siteInfo.mainLogo}
          alt={`${siteInfo.brandName} logo`}
          height={siteInfo.mainLogoHeight}
        />

        <nav
          className="hidden items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--sand)]/70 p-2 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-[-0.01em] transition",
                  active
                    ? "bg-white text-[var(--brand-deep)] shadow-[0_6px_16px_rgba(1,87,189,0.1)]"
                    : "text-[var(--ink-muted)] hover:bg-white/80 hover:text-[var(--brand)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={phoneHref(siteInfo.phone)}
            className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3.5 py-2 text-sm font-semibold text-[var(--brand-deep)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] xl:inline-flex"
          >
            <FiPhone className="h-4 w-4 text-[var(--brand)]" aria-hidden />
            <span className="tabular-nums">{siteInfo.phone}</span>
          </a>
          <Link
            href="/contact"
            className="btn btn-primary hidden min-h-11 px-5 py-2.5 text-sm sm:inline-flex"
          >
            Hire Now
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--brand-deep)] shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
              <span
                className={cn(
                  "h-0.5 w-full bg-current transition",
                  open && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn("h-0.5 w-full bg-current transition", open && "opacity-0")}
              />
              <span
                className={cn(
                  "h-0.5 w-full bg-current transition",
                  open && "-translate-y-[7px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-[var(--line)] bg-white lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--brand-deep)]"
                    : "text-[var(--ink)] hover:bg-[var(--sand)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={phoneHref(siteInfo.phone)}
            className="mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--brand-deep)]"
          >
            <FiPhone className="h-4 w-4" aria-hidden />
            {siteInfo.phone}
          </a>
          <Link href="/contact" className="btn btn-primary btn-block mt-2">
            Hire Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
