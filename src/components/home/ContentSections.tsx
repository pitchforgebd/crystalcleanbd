"use client";

import Image from "next/image";
import Link from "next/link";
import { CleanSparkles } from "@/components/motion/CleanEffects";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type {
  BlogPost,
  ClientLogo,
  ConcernContent,
  GalleryImage,
  Testimonial,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function JoinCta() {
  return (
    <section className="section-space">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[var(--brand)] px-6 py-12 text-white md:px-12">
            <CleanSparkles />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Join with us
              </p>
              <h2 className="mt-3 display-font text-3xl md:text-4xl">
                Ready for a cleaner, more dependable routine?
              </h2>
              <p className="mt-4 text-white">
                Tell us about your space and schedule. Our team will recommend a
                practical plan.
              </p>
              <div className="mt-7">
                <ButtonLink href="/contact" variant="ghost">
                  Start a conversation
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  const loop = [...items, ...items];

  return (
    <section className="section-space surface-panel overflow-hidden">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Testimonials"
            title="What clients notice first"
            description="Quotes from clients who count on our team."
          />
        </Reveal>
      </Container>

      <div className="relative mt-10">
        <div
          className="testimonials-marquee [mask-image:linear-gradient(90deg,transparent_0%,black_6%,black_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_6%,black_94%,transparent_100%)]"
          aria-label="Client testimonials"
        >
          <ul className="testimonials-marquee-track">
            {loop.map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                className="w-[min(22rem,78vw)] shrink-0 border-l-2 border-[var(--accent)] bg-white/70 px-5 py-5 shadow-[0_10px_28px_rgba(1,87,189,0.06)]"
              >
                <figure>
                  <blockquote className="text-base leading-relaxed text-[var(--ink)]">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={item.avatarSrc}
                        alt={item.avatarAlt}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <span className="text-sm text-[var(--ink-muted)]">
                      <span className="block font-semibold text-[var(--brand)]">
                        {item.name}
                      </span>
                      <span className="block">{item.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function GalleryPreview({ images }: { images: GalleryImage[] }) {
  const preview = images.slice(0, 6);

  return (
    <section className="section-space">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Gallery"
              title="A look at finished spaces"
              description="A preview of work from across the team."
            />
            <ButtonLink href="/gallery" variant="secondary">
              Open gallery
            </ButtonLink>
          </div>
        </Reveal>
        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {preview.map((image) => (
            <StaggerItem key={image.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--line)]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function ConcernPreview({ content }: { content: ConcernContent | null }) {
  const c = content;
  if (!c) {
    return (
      <section className="section-space">
        <Container>
          <SectionHeading eyebrow="Our concern" title="Coming soon" />
        </Container>
      </section>
    );
  }
  return (
    <section className="section-space">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
            <SectionHeading
              eyebrow="Our concern"
              title={c.name}
              description={c.tagline}
            />
            <p className="mt-5 max-w-xl text-[var(--ink-muted)] leading-relaxed">
              {c.introduction}
            </p>
            <div className="mt-7">
              <ButtonLink href="/our-concern">Learn about {c.name}</ButtonLink>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <Image
              src={c.image}
              alt={c.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,42,88,0.85)] via-[rgba(4,42,88,0.25)] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
                Security concern
              </p>
              <p className="mt-2 display-font text-2xl md:text-3xl">{c.name}</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                {c.brandingNote}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function LatestBlogs({ posts }: { posts: BlogPost[] }) {
  const latest = [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 6);

  return (
    <section className="section-space">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Latest blogs"
            title="Insights for cleaner spaces"
            description="Practical notes on workplace care, deep cleaning, and professional standards."
          />
        </Reveal>

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {latest.map((post) => (
            <StaggerItem key={post.id}>
              <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_10px_28px_rgba(1,87,189,0.05)] transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[0_16px_36px_rgba(1,87,189,0.1)]">
                <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[var(--brand-deep)]">
                        {post.categorySlug.replace(/-/g, " ")}
                      </span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--ink)] transition group-hover:text-[var(--brand)]">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                      {post.excerpt}
                    </p>
                    <span className="mt-auto pt-5 text-sm font-bold text-[var(--brand-deep)]">
                      Read more →
                    </span>
                  </div>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <ButtonLink href="/blog" variant="secondary">
            Read all posts
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}


export function ClientLogos({ clients, brandName }: { clients: ClientLogo[]; brandName: string }) {
  const loop = [...clients, ...clients];

  return (
    <section className="section-space overflow-hidden">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Clients"
          title="Organizations we support"
          description={`Client logos for ${brandName}.`}
        />
      </Container>

      <div className="relative mt-10">
        <div className="clients-marquee [mask-image:linear-gradient(90deg,transparent_0%,black_6%,black_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_6%,black_94%,transparent_100%)]" aria-label="Client logos">
          <ul className="clients-marquee-track">
            {loop.map((client, index) => (
              <li
                key={`${client.id}-${index}`}
                className="flex h-20 w-[200px] shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-4"
              >
                <Image
                  src={client.logoSrc}
                  alt={client.logoAlt}
                  width={168}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
