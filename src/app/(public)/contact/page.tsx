import type { Metadata } from "next";
import Image from "next/image";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getAboutContent } from "@/lib/repository/about";
import { listSocialLinks } from "@/lib/repository/social";
import { getSiteInfo } from "@/lib/repository/site";
import { getPageSeoByPath } from "@/lib/repository/seo";
import { phoneHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [siteInfo, pageSeo] = await Promise.all([getSiteInfo(), getPageSeoByPath("/contact")]);
  return {
    title: pageSeo?.title || "Contact Us",
    description:
      pageSeo?.description ||
      `Contact ${siteInfo.brandName} — send a message and we will get back to you.`,
    alternates: pageSeo?.canonical ? { canonical: pageSeo.canonical } : undefined,
    openGraph: pageSeo?.ogImage ? { images: [{ url: pageSeo.ogImage }] } : undefined,
  };
}

export default async function ContactPage() {
  const [aboutContent, siteInfo, socialLinks] = await Promise.all([
    getAboutContent(),
    getSiteInfo(),
    listSocialLinks(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about your space"
        description="Share a few details and our team will follow up shortly."
        image={aboutContent?.contactImage}
        imageAlt={aboutContent?.contactImageAlt}
      />
      <section className="section-space">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="page-panel overflow-hidden p-0">
            <div className="relative aspect-[16/10]">
              <Image
                src={aboutContent?.contactImage ?? ""}
                alt={aboutContent?.contactImageAlt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02152c]/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  Reach us
                </p>
                <p className="mt-2 display-font text-2xl">{siteInfo.brandName}</p>
              </div>
            </div>
            <div className="p-6 md:p-7">
              <ul className="space-y-4 text-[var(--ink-muted)]">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--brand)]">
                    <FiMail className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-deep)]">
                      Email
                    </span>
                    <a href={`mailto:${siteInfo.email}`} className="hover:text-[var(--brand)]">
                      {siteInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--brand)]">
                    <FiPhone className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-deep)]">
                      Phone
                    </span>
                    <a href={phoneHref(siteInfo.phone)} className="hover:text-[var(--brand)]">
                      {siteInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--brand)]">
                    <FiMapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-deep)]">
                      Address
                    </span>
                    {siteInfo.address}
                  </div>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[var(--line)] pt-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--brand)] transition hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="page-panel p-6 md:p-8">
            <p className="page-kicker">Message</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)]">
              Send a request
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              We typically respond within one business day.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
