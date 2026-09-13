"use client";

import { useMemo, useState } from "react";
import { FiLayers, FiSearch, FiX } from "react-icons/fi";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { Service, SiteInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  services: Service[];
  siteInfo: SiteInfo;
};

const ALL = "all";

export function ServiceCatalog({ services, siteInfo }: Props) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const service of services) {
      counts.set(service.category, (counts.get(service.category) ?? 0) + 1);
    }
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
  }, [services]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return services.filter((service) => {
      const inCategory = category === ALL || service.category === category;
      if (!inCategory) return false;
      if (!needle) return true;
      return (
        service.name.toLowerCase().includes(needle) ||
        service.shortDescription.toLowerCase().includes(needle) ||
        service.packageTags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [category, query, services]);

  const filtered = category !== ALL || query.trim() !== "";

  return (
    <>
      {/* ---------- Filter bar ---------- */}
      <div className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white p-3 shadow-[0_16px_40px_rgba(1,87,189,0.07)] md:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter services by category"
          >
            <button
              type="button"
              onClick={() => setCategory(ALL)}
              aria-pressed={category === ALL}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold transition",
                category === ALL
                  ? "border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white"
                  : "border-[var(--line)] bg-white text-[var(--brand-deep)] hover:border-[var(--brand)] hover:bg-[var(--accent-soft)]",
              )}
            >
              <FiLayers className="h-3.5 w-3.5" aria-hidden />
              All services
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                  category === ALL
                    ? "bg-white/20 text-white"
                    : "bg-[var(--sand)] text-[var(--ink-muted)]",
                )}
              >
                {services.length}
              </span>
            </button>

            {categories.map((item) => {
              const active = category === item.name;
              const sample = services.find((service) => service.category === item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCategory(item.name)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold transition",
                    active
                      ? "border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white"
                      : "border-[var(--line)] bg-white text-[var(--brand-deep)] hover:border-[var(--brand)] hover:bg-[var(--accent-soft)]",
                  )}
                >
                  {sample ? (
                    <ServiceIcon name={sample.icon} className="h-3.5 w-3.5" />
                  ) : null}
                  {item.name}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[var(--sand)] text-[var(--ink-muted)]",
                    )}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative lg:w-72 lg:shrink-0">
            <FiSearch
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand)]"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search services…"
              aria-label="Search services"
              className="w-full rounded-full border border-[var(--line)] bg-[var(--sand)] py-2.5 pl-11 pr-10 text-sm font-medium text-[var(--ink)] outline-none transition placeholder:font-normal placeholder:text-[var(--ink-muted)] focus:border-[var(--brand)] focus:bg-white"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--line)] text-[var(--brand-deep)] transition hover:bg-[var(--brand-deep)] hover:text-white"
              >
                <FiX className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ---------- Results ---------- */}
      <p className="mt-5 text-sm text-[var(--ink-muted)]" aria-live="polite">
        Showing <span className="font-bold text-[var(--brand-deep)]">{visible.length}</span>{" "}
        of {services.length} services
        {category !== ALL ? (
          <>
            {" "}
            in <span className="font-bold text-[var(--brand-deep)]">{category}</span>
          </>
        ) : null}
      </p>

      {visible.length > 0 ? (
        <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" delay={0.04}>
          {visible.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} siteInfo={siteInfo} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--line)] bg-white px-6 py-14 text-center">
          <p className="display-font text-xl text-[var(--brand-deep)]">
            No services match that filter
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--ink-muted)]">
            Try another category or a different search term — or tell us what you need and
            we will put a plan together.
          </p>
          {filtered ? (
            <button
              type="button"
              onClick={() => {
                setCategory(ALL);
                setQuery("");
              }}
              className="btn btn-secondary mt-6"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      )}
    </>
  );
}
