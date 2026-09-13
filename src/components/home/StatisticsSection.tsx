"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import type { Statistic } from "@/lib/types";

function useCountUp(target: number, active: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const duration = 1100;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function StatItem({
  label,
  value,
  suffix,
  active,
}: {
  label: string;
  value: number;
  suffix: string;
  active: boolean;
}) {
  const counted = useCountUp(value, active);

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-2 text-center sm:px-6">
      <p className="display-font text-[2.5rem] leading-none tracking-tight text-[var(--brand-deep)] tabular-nums md:text-[3rem]">
        <span className="inline-block min-w-[3.5ch] text-center">
          {counted}
          {suffix}
        </span>
      </p>
      <p className="mt-3 max-w-[11rem] text-[0.7rem] font-semibold uppercase leading-snug tracking-[0.14em] text-[var(--ink-muted)] md:text-xs">
        {label}
      </p>
    </div>
  );
}

export function StatisticsSection({ statistics }: { statistics: Statistic[] }) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-space surface-panel">
      <Container>
        <Reveal>
          <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
              Our impact
            </p>
            <h2 className="mt-2 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
              Trusted results in numbers
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_12px_32px_rgba(1,87,189,0.06)]">
            {/* Per-cell borders (not divide-*) so the 2-column mobile grid does
                not draw a stray line above the second tile. */}
            <div className="-mb-px -mr-px grid grid-cols-2 lg:grid-cols-4">
              {statistics.map((stat) => (
                <div
                  key={stat.id}
                  className="min-h-[140px] border-b border-r border-[var(--line)] md:min-h-[160px]"
                >
                  <StatItem
                    label={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    active={active}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
