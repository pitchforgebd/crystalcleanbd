"use client";

import { useEffect, useRef, useState } from "react";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { Service, SiteInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

type FeaturedServicesSliderProps = {
  services: Service[];
  siteInfo: SiteInfo;
};

export function FeaturedServicesSlider({ services, siteInfo }: FeaturedServicesSliderProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function updateArrows() {
    const node = scrollerRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanPrev(node.scrollLeft > 8);
    setCanNext(node.scrollLeft < maxScroll - 8);
  }

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    updateArrows();
    node.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      node.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [services]);

  function scrollByCard(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("[data-featured-card]");
    const amount = card ? card.offsetWidth + 24 : node.clientWidth * 0.8;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  if (services.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--ink-muted)]">
        No featured services available yet.
      </p>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous featured services"
        disabled={!canPrev}
        onClick={() => scrollByCard(-1)}
        className={cn(
          "absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white shadow-[var(--shadow-soft)] transition md:inline-flex",
          canPrev ? "hover:border-[var(--brand)] hover:bg-[var(--brand)]" : "cursor-not-allowed opacity-40",
        )}
      >
        <ArrowIcon direction="left" />
      </button>
      <button
        type="button"
        aria-label="Next featured services"
        disabled={!canNext}
        onClick={() => scrollByCard(1)}
        className={cn(
          "absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white shadow-[var(--shadow-soft)] transition md:inline-flex",
          canNext ? "hover:border-[var(--brand)] hover:bg-[var(--brand)]" : "cursor-not-allowed opacity-40",
        )}
      >
        <ArrowIcon direction="right" />
      </button>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service) => (
          <div
            key={service.id}
            data-featured-card
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc((100%-4.5rem)/4)]"
          >
            <ServiceCard service={service} siteInfo={siteInfo} />
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3 md:hidden">
        <button
          type="button"
          aria-label="Previous"
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white",
            !canPrev && "opacity-40",
          )}
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          aria-label="Next"
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white",
            !canNext && "opacity-40",
          )}
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
