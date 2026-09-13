"use client";

import Image from "next/image";
import Link from "next/link";
import { CleanSparkles } from "@/components/motion/CleanEffects";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { FeaturedServicesSlider } from "@/components/home/FeaturedServicesSlider";
import type { Service, SiteInfo } from "@/lib/types";

type Props = { services: Service[]; siteInfo: SiteInfo };
type PopularServicesProps = { services: Service[] };

export function ServicesOverview({ services, siteInfo }: Props) {
  return (
    <section className="relative section-space overflow-hidden">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Our services"
              title="Professional cleaning for every space"
              description="From offices and homes to deep cleans and hygiene care — clear packages, trained teams, and dependable scheduling."
            />
            <Link href="/services" className="btn btn-secondary shrink-0">
              View all services
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" delay={0.05}>
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} siteInfo={siteInfo} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-12">
          <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--brand)] px-6 py-7 text-white md:flex-row md:items-center md:px-8">
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Need a tailored plan?
              </p>
              <p className="mt-2 max-w-xl text-lg font-medium leading-snug">
                Tell us about your site and schedule — we will recommend the right service mix.
              </p>
            </div>
            <Link href="/contact" className="btn btn-ghost relative shrink-0">
              Hire Now
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function FeaturedServices({ services, siteInfo }: Props) {
  const featured = services.filter((s) => s.featured);
  const extras = services.filter((s) => !s.featured);
  const sliderItems = [...featured, ...extras].slice(0, 4);

  return (
    <section className="section-space bg-white/70">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Featured"
            title="Featured Services"
            description="Professional cleaning options ready to book. Browse the slider and call when you need a visit."
          />
        </Reveal>
        <Reveal delay={0.12} className="mt-8">
          <FeaturedServicesSlider services={sliderItems} siteInfo={siteInfo} />
        </Reveal>
      </Container>
    </section>
  );
}

export function PopularServices({ services }: PopularServicesProps) {
  const popular = services
    .filter((s) => s.popular)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="relative section-space overflow-hidden bg-[var(--brand-deep)] text-white">
      <CleanSparkles />

      <Container className="relative">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              light
              eyebrow="Popular"
              title="Most requested cleaning paths"
              description="The service routes clients choose most often — clear starting points for workplaces and homes."
            />
            <Link
              href="/services"
              className="btn btn-ghost shrink-0 self-start lg:self-auto"
            >
              Browse all paths
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-12 space-y-4 md:space-y-5" delay={0.08}>
          {popular.map((service, index) => {
            const rank = String(index + 1).padStart(2, "0");
            return (
              <StaggerItem key={service.id}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid overflow-hidden rounded-[1.35rem] border border-white/25 bg-white/10 backdrop-blur-sm transition duration-500 hover:border-[var(--accent)]/55 hover:bg-white/[0.16] md:grid-cols-[7.5rem_minmax(0,1fr)_minmax(11rem,16rem)]"
                >
                  <div className="flex items-center gap-4 border-b border-white/30 px-5 py-5 md:flex-col md:items-start md:justify-center md:border-b-0 md:border-r md:px-6">
                    <span className="display-font text-4xl leading-none text-[var(--accent)] md:text-5xl">
                      {rank}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                      Path
                    </span>
                  </div>

                  <div className="flex flex-col justify-center gap-3 px-5 py-5 md:px-7 md:py-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/85">
                        <ServiceIcon name={service.icon} className="h-3.5 w-3.5" />
                        {service.category}
                      </span>
                      {service.rating > 0 ? (
                        <span className="text-xs text-white/80">
                          {service.rating.toFixed(1)} · {service.reviewCount} reviews
                        </span>
                      ) : null}
                    </div>
                    <h3 className="display-font text-2xl leading-tight text-white transition group-hover:text-[var(--accent)] md:text-[1.75rem]">
                      {service.name}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-white/85 md:text-[0.95rem]">
                      {service.shortDescription}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-white">
                      Explore path
                      <span
                        aria-hidden
                        className="inline-block transition duration-300 group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </span>
                  </div>

                  <div className="relative min-h-[11rem] overflow-hidden md:min-h-full">
                    <Image
                      src={service.featuredImage}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02152c]/70 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-[#042a58]/35" />
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
