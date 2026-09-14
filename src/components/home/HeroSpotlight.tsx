"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { FiArrowRight, FiGrid, FiSearch, FiShield, FiStar } from "react-icons/fi";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { HeroSlide, Service, SiteInfo, Statistic } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  slides: HeroSlide[];
  services: Service[];
  statistics: Statistic[];
  siteInfo: SiteInfo;
};

/** Split a headline so the closing words can carry the gradient accent. */
function splitHeadline(headline: string): [string, string] {
  const words = headline.trim().split(/\s+/);
  if (words.length < 3) return ["", headline.trim()];
  const accentCount = words.length > 5 ? 3 : 2;
  return [
    words.slice(0, words.length - accentCount).join(" "),
    words.slice(words.length - accentCount).join(" "),
  ];
}

/** Count from 0 to target once, after mount. Never renders NaN. */
function useCountUp(target: number, run: boolean): number {
  const safe = Number.isFinite(target) ? target : 0;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1400, 1);
      setValue(Math.round(safe * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, safe]);

  return run ? value : safe;
}

export function HeroSpotlight({ slides, services, statistics, siteInfo }: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const lead = slides[0];
  const [headStart, headAccent] = splitHeadline(
    lead?.heading ?? "Professional cleaning services",
  );

  const categories = useMemo(
    () => [...new Set(services.map((service) => service.category))],
    [services],
  );
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");

  const matching = useMemo(
    () =>
      category ? services.filter((service) => service.category === category) : services,
    [category, services],
  );
  const activeSlug = matching.some((service) => service.slug === slug) ? slug : "";

  const popular = services.filter((service) => service.popular).slice(0, 4);
  const headlineStat = statistics[0];
  const counted = useCountUp(headlineStat?.value ?? 0, !reduce);
  const rating = services.length
    ? services.reduce((total, service) => total + service.rating, 0) / services.length
    : 0;

  const gallery = (
    slides.length >= 3
      ? slides.slice(0, 3)
      : [
          ...slides,
          ...services.map((service) => ({
            image: service.featuredImage,
            imageAlt: service.imageAlt,
          })),
        ]
  ).slice(0, 3);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(activeSlug ? `/services/${activeSlug}` : "/services");
  }

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden">
      <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-20">
        {/* ---------- Copy column ---------- */}
        <div className="max-w-2xl">
          <motion.div {...fade(0)}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-white/80 py-1.5 pl-2 pr-4 text-[12.5px] font-semibold text-[var(--brand-deep)] shadow-[0_8px_24px_rgba(1,87,189,0.08)] backdrop-blur">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)]/45 motion-reduce:hidden" />
                <span className="relative h-2 w-2 rounded-full bg-[var(--brand)]" />
              </span>
              {siteInfo.brandName}
              <span className="text-[var(--ink-muted)]">
                &middot; {lead?.subheading ?? "Commercial & residential cleaning"}
              </span>
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 display-font text-[clamp(2.4rem,5.4vw,4.25rem)] leading-[1.03] text-[var(--ink)]"
            {...fade(0.08)}
          >
            {headStart && <span className="block">{headStart}</span>}
            <span className="block text-[var(--brand)]">
              {headAccent}
            </span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-[var(--ink-muted)] md:text-lg"
            {...fade(0.16)}
          >
            {lead?.text ?? siteInfo.tagline}
          </motion.p>

          {/* ---------- Quick service finder ---------- */}
          <motion.form
            onSubmit={onSearch}
            className="relative z-30 mt-8 rounded-[1.75rem] border border-[var(--line)] bg-white p-2 shadow-[0_24px_60px_rgba(1,87,189,0.12)]"
            {...fade(0.24)}
          >
            <div className="grid gap-1.5 md:grid-cols-[1fr_1fr_auto] md:items-center">
              <SelectMenu
                label="Category"
                value={category}
                onChange={(next) => {
                  setCategory(next);
                  setSlug("");
                }}
                icon={<FiGrid className="h-4.5 w-4.5" />}
                options={[
                  { value: "", label: "All categories", hint: `${services.length}` },
                  ...categories.map((item) => ({
                    value: item,
                    label: item,
                    hint: `${services.filter((s) => s.category === item).length}`,
                  })),
                ]}
              />

              <div className="md:border-l md:border-[var(--line)] md:pl-1.5">
                <SelectMenu
                  label="Service"
                  value={activeSlug}
                  onChange={setSlug}
                  icon={<FiSearch className="h-4.5 w-4.5" />}
                  options={[
                    { value: "", label: "Browse everything" },
                    ...matching.map((service) => ({
                      value: service.slug,
                      label: service.name,
                      icon: <ServiceIcon name={service.icon} className="h-4 w-4" />,
                    })),
                  ]}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary min-h-[3.75rem] px-8 md:ml-1.5"
              >
                <FiSearch className="h-4 w-4" aria-hidden />
                Search
              </button>
            </div>
          </motion.form>

          {popular.length > 0 && (
            <motion.div className="mt-5 flex flex-wrap items-center gap-2" {...fade(0.32)}>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                Popular
              </span>
              {popular.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[13px] font-semibold text-[var(--brand-deep)] transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  <ServiceIcon name={service.icon} className="h-3.5 w-3.5 text-[var(--brand)]" />
                  {service.name}
                </Link>
              ))}
            </motion.div>
          )}

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--line)] pt-7"
            {...fade(0.4)}
          >
            {rating > 0 && (
              <div className="flex items-center gap-2.5">
                <span className="flex text-[var(--accent)]" aria-hidden>
                  {[0, 1, 2, 3, 4].map((star) => (
                    <FiStar
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star < Math.round(rating) && "fill-[var(--accent)]",
                      )}
                    />
                  ))}
                </span>
                <p className="text-sm text-[var(--ink-muted)]">
                  <span className="font-bold text-[var(--brand-deep)]">
                    {rating.toFixed(1)}/5
                  </span>{" "}
                  client rating
                </p>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <FiShield className="h-5 w-5 text-[var(--brand)]" aria-hidden />
              <p className="text-sm text-[var(--ink-muted)]">
                <span className="font-bold text-[var(--brand-deep)]">Trained and vetted</span>{" "}
                teams
              </p>
            </div>

            <Link
              href={lead?.ctaHref || "/contact"}
              className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)]"
            >
              {lead?.ctaLabel || "Get a free quote"}
              <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {/* ---------- Image orbit ---------- */}
        <motion.div
          className="relative mx-auto w-full max-w-[560px]"
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-square w-full">
            <div
              className="hero-orbit absolute inset-[6%] rounded-full border border-dashed border-[var(--brand)]/25"
              aria-hidden
            />
            <div
              className="absolute inset-[18%] rounded-full bg-[var(--accent)]/10 blur-2xl"
              aria-hidden
            />

            {gallery[0] && (
              <figure className="hero-float absolute left-0 top-0 h-[62%] w-[62%] overflow-hidden rounded-full shadow-[0_30px_70px_rgba(1,87,189,0.22)] ring-8 ring-white">
                <Image
                  src={gallery[0].image}
                  alt={gallery[0].imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 60vw, 340px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(4,42,88,0.35)_100%)]" />
              </figure>
            )}

            {gallery[1] && (
              <figure className="hero-float-mid absolute right-[1%] top-[26%] h-[40%] w-[40%] overflow-hidden rounded-full shadow-[0_24px_54px_rgba(1,87,189,0.2)] ring-8 ring-white">
                <Image
                  src={gallery[1].image}
                  alt={gallery[1].imageAlt}
                  fill
                  sizes="(max-width: 1024px) 40vw, 220px"
                  className="object-cover"
                />
              </figure>
            )}

            {gallery[2] && (
              <figure className="hero-float-fast absolute bottom-[1%] left-[20%] h-[36%] w-[36%] overflow-hidden rounded-full shadow-[0_24px_54px_rgba(1,87,189,0.2)] ring-8 ring-white">
                <Image
                  src={gallery[2].image}
                  alt={gallery[2].imageAlt}
                  fill
                  sizes="(max-width: 1024px) 36vw, 200px"
                  className="object-cover"
                />
              </figure>
            )}

            {headlineStat && (
              <div className="hero-float-mid absolute bottom-[6%] right-0 rounded-2xl border border-white/60 bg-white/90 px-5 py-3.5 text-center shadow-[0_20px_45px_rgba(1,87,189,0.18)] backdrop-blur-xl">
                <p className="display-font text-[1.9rem] leading-none text-[var(--brand-deep)] tabular-nums">
                  {counted}
                  {headlineStat.suffix}
                </p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                  {headlineStat.label}
                </p>
              </div>
            )}

            {statistics[1] && (
              <div className="hero-float absolute left-[-4%] top-[58%] hidden items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-[0_20px_45px_rgba(1,87,189,0.16)] backdrop-blur-xl sm:flex">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--brand)]">
                  <ServiceIcon name="spark" className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="display-font text-lg leading-none text-[var(--brand-deep)] tabular-nums">
                    {statistics[1].value}
                    {statistics[1].suffix}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                    {statistics[1].label}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
