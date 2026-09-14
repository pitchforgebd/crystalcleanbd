import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { InnerCta } from "@/components/ui/InnerCta";
import { PageHero } from "@/components/ui/PageHero";
import { getConcernContent } from "@/lib/repository/concern";
import { getPageSeoByPath } from "@/lib/repository/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [concern, pageSeo] = await Promise.all([getConcernContent(), getPageSeoByPath("/our-concern")]);
  return {
    title: pageSeo?.title || "Our Concern — Crystal Force",
    description: pageSeo?.description || concern?.tagline || "",
    alternates: pageSeo?.canonical ? { canonical: pageSeo.canonical } : undefined,
    openGraph: pageSeo?.ogImage ? { images: [{ url: pageSeo.ogImage }] } : undefined,
  };
}

export default async function OurConcernPage() {
  const concern = await getConcernContent();
  if (!concern) return null;

  return (
    <>
      <PageHero
        eyebrow="Our concern"
        title={concern.name}
        description={concern.tagline}
        image={concern.image}
        imageAlt={concern.imageAlt}
        actions={
          <ButtonLink href={concern.ctaHref} variant="ghost">{concern.ctaLabel}</ButtonLink>
        }
      />

      <section className="section-space">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="page-kicker">Overview</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
              Security presence with disciplined standards
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--ink)]">
              {concern.introduction}
            </p>
            <p className="mt-4 leading-relaxed text-[var(--ink-muted)]">
              {concern.brandingNote}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] shadow-[var(--shadow-soft)]">
            <Image
              src={concern.image}
              alt={concern.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02152c]/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                Concern brand
              </p>
              <p className="mt-2 display-font text-2xl">{concern.name}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space surface-panel">
        <Container>
          <div className="max-w-2xl">
            <p className="page-kicker">Emphasis</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
              What Crystal Force emphasizes
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {concern.features.map((feature, index) => (
              <div key={feature.title} className="page-panel p-6 md:p-7">
                <span className="display-font text-3xl text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--brand-deep)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <InnerCta
        title="Discuss facility coverage with Crystal Clean"
        description="Cleaning and security concerns can be coordinated through one professional contact path."
        href={concern.ctaHref}
        label={concern.ctaLabel}
      />
    </>
  );
}
