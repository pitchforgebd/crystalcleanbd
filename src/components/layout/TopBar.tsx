"use client";

import { FiClock, FiMail, FiPhone } from "react-icons/fi";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { SiteInfo, SocialLink } from "@/lib/types";
import { cn, phoneHref } from "@/lib/utils";

type Props = {
  siteInfo: SiteInfo;
  socialLinks: SocialLink[];
  /** When true the bar folds away so the nav row alone stays sticky. */
  collapsed?: boolean;
};

export function TopBar({ siteInfo, socialLinks, collapsed = false }: Props) {
  const socials = socialLinks.filter((link) => link.platform !== "whatsapp");

  return (
    <div
      className={cn(
        "overflow-hidden bg-[var(--brand-deep)] text-white transition-[max-height,opacity] duration-[400ms] ease-out",
        collapsed ? "max-h-0 opacity-0" : "max-h-24 opacity-100",
      )}
      aria-hidden={collapsed}
      // inert keeps the folded bar's links out of the tab order, not just out
      // of the accessibility tree.
      inert={collapsed}
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(600px_60px_at_18%_120%,rgba(87,192,255,0.55),transparent_70%)]"
          aria-hidden
        />
        <div className="container-page relative flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 py-2 text-[12.5px]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={phoneHref(siteInfo.phone)}
              className="group inline-flex items-center gap-2 font-semibold tracking-[0.01em] text-white/90 transition hover:text-white"
            >
              <FiPhone className="h-3.5 w-3.5 text-[var(--accent)] transition group-hover:scale-110" aria-hidden />
              <span className="tabular-nums">{siteInfo.phone}</span>
            </a>

            <span className="hidden h-4 w-px bg-white/25 sm:block" aria-hidden />

            <a
              href={`mailto:${siteInfo.email}`}
              className="group hidden items-center gap-2 font-medium text-white/85 transition hover:text-white sm:inline-flex"
            >
              <FiMail className="h-3.5 w-3.5 text-[var(--accent)] transition group-hover:scale-110" aria-hidden />
              <span>{siteInfo.email}</span>
            </a>

            <span className="hidden h-4 w-px bg-white/25 lg:block" aria-hidden />

            <span className="hidden items-center gap-2 font-medium text-white/85 lg:inline-flex">
              <FiClock className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
              <span>Open 24/7 — same-day booking</span>
            </span>
          </div>

          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 md:inline">
                Follow
              </span>
              {socials.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/85 transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white hover:text-[var(--brand-deep)]"
                >
                  <SocialIcon platform={link.platform} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
