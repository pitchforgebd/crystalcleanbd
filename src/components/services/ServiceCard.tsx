"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiPhone } from "react-icons/fi";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { StarRating } from "@/components/services/StarRating";
import type { Service, SiteInfo } from "@/lib/types";
import { phoneHref } from "@/lib/utils";

type ServiceCardProps = {
  service: Service;
  siteInfo: SiteInfo;
};

export function ServiceCard({ service, siteInfo }: ServiceCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-white shadow-[0_10px_28px_rgba(1,87,189,0.06)]"
      whileHover={
        reduce
          ? undefined
          : {
              y: -6,
              boxShadow: "0 22px 48px rgba(1,87,189,0.14)",
              borderColor: "var(--brand)",
            }
      }
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <Image
          src={service.featuredImage}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,42,88,0.55)] via-transparent to-transparent opacity-80" />
        <span className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--brand-deep)] shadow-sm backdrop-blur-sm">
          <ServiceIcon name={service.icon} className="h-5 w-5" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <span className="inline-flex w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--brand-deep)]">
          {service.category}
        </span>

        <h3 className="mt-3 text-xl font-semibold leading-snug text-[var(--ink)]">
          <Link
            href={`/services/${service.slug}`}
            className="transition hover:text-[var(--brand)]"
          >
            {service.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink-muted)]">
          {service.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/brand/crystal-clean-logo.jpg"
              alt=""
              width={36}
              height={36}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--line)]"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--ink)]">
                {siteInfo.brandName}
              </p>
              <StarRating rating={service.rating} reviewCount={service.reviewCount} />
            </div>
          </div>
          <Link
            href={`/services/${service.slug}`}
            className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)] transition hover:text-[var(--brand-deep)]"
          >
            Details
          </Link>
        </div>

        <div className="mt-auto pt-5">
          <a href={phoneHref(siteInfo.phone)} className="btn btn-primary btn-block">
            <FiPhone className="h-4 w-4" aria-hidden />
            {siteInfo.phone}
          </a>
        </div>
      </div>
    </motion.article>
  );
}
