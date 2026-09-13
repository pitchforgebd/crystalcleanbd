import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { InnerCta } from "@/components/ui/InnerCta";
import { PageHero } from "@/components/ui/PageHero";
import { getAboutContent } from "@/lib/repository/about";
import { getConcernContent } from "@/lib/repository/concern";
import { getSiteInfo } from "@/lib/repository/site";

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  return {
    title: "About Us",
    description: `Learn about ${siteInfo.brandName}, our mission, vision, and approach.`,
  };
}

export default async function AboutPage() {
  const [aboutContent, concernContent, siteInfo] = await Promise.all([
    getAboutContent(),
    getConcernContent(),
    getSiteInfo(),
  ]);

  if (!aboutContent) return null;

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`Who we are at ${siteInfo.brandName}`}
        description={aboutContent.introduction}
        image={aboutContent.workspaceImage}
        imageAlt={aboutContent.workspaceImageAlt}
        actions={<ButtonLink href="/contact" variant="ghost">Hire Now</ButtonLink>}
      />

      <section className="section-space">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="page-panel p-7 md:p-8">
            <p className="page-kicker">Mission</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)]">
              What we deliver
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-muted)]">
              {aboutContent.mission}
            </p>
          </div>
          <div className="page-panel p-7 md:p-8">
            <p className="page-kicker">Vision</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)]">
              Where we aim
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-muted)]">
              {aboutContent.vision}
            </p>
          </div>
        </Container>
      </section>

      <section className="section-space surface-panel">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="page-kicker">Leadership</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
              Message from the Proprietor
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--ink)]">
              {aboutContent.proprietorMessage}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] shadow-[var(--shadow-soft)]">
            <Image
              src={aboutContent.teamImage}
              alt={aboutContent.teamImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="max-w-2xl">
            <p className="page-kicker">Values</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
              Standards we work by
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {aboutContent.values.map((value, index) => (
              <div key={value.title} className="page-panel p-6">
                <span className="display-font text-3xl text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--brand-deep)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space surface-panel">
        <Container className="grid gap-8 lg:grid-cols-2">
          {concernContent ? (
            <div className="page-panel overflow-hidden p-0">
              <div className="relative aspect-[16/9]">
                <Image
                  src={concernContent.image}
                  alt={concernContent.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-7">
                <p className="page-kicker">Our concern</p>
                <h2 className="mt-3 display-font text-2xl text-[var(--brand-deep)]">
                  {concernContent.name}
                </h2>
                <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">
                  {concernContent.introduction}
                </p>
                <Link
                  href="/our-concern"
                  className="mt-5 inline-flex text-sm font-bold text-[var(--brand)] underline-offset-4 hover:underline"
                >
                  Visit Crystal Force overview →
                </Link>
              </div>
            </div>
          ) : null}
          <div className="page-panel p-6 md:p-7">
            <p className="page-kicker">Why choose us</p>
            <h2 className="mt-3 display-font text-2xl text-[var(--brand-deep)]">
              Built for dependable presentation
            </h2>
            <ul className="mt-6 space-y-3">
              {aboutContent.whyChooseUs.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-[var(--accent)] pl-4 text-[var(--ink-muted)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <InnerCta
        title="Ready to plan a cleaner routine?"
        description="Share your space type and preferred schedule — we will recommend the right service mix."
      />
    </>
  );
}
