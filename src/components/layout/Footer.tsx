import Link from "next/link";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Container } from "@/components/ui/Container";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { listServices } from "@/lib/repository/services";
import { listSocialLinks } from "@/lib/repository/social";
import { getSiteInfo } from "@/lib/repository/site";
import { navLinks } from "@/lib/repository/nav";
import { phoneHref } from "@/lib/utils";

export async function Footer() {
  const [siteInfo, services, socialLinks] = await Promise.all([
    getSiteInfo(),
    listServices(),
    listSocialLinks(),
  ]);

  const year = new Date().getFullYear();
  const quickLinks = navLinks.filter((link) =>
    ["/", "/about", "/gallery", "/blog", "/faq", "/contact"].includes(link.href),
  );
  const serviceLinks = services.slice(0, 5);

  return (
    <footer className="relative mt-auto overflow-hidden text-white">
      <div className="absolute inset-0 bg-[var(--brand-deep)]" />

      <div className="relative border-b border-white/30">
        <Container className="flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">
              Ready for a cleaner routine?
            </p>
            <p className="mt-2 max-w-xl text-lg font-medium leading-snug md:text-xl">
              Request a visit or call us — we will help you choose the right service plan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-ghost">
              Hire Now
            </Link>
            <a href={phoneHref(siteInfo.phone)} className="btn btn-outline">
              {siteInfo.phone}
            </a>
          </div>
        </Container>
      </div>

      <Container className="relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.15fr]">
        <div>
          <BrandLogo
            href="/"
            src={siteInfo.footerLogo || siteInfo.mainLogo}
            alt={`${siteInfo.brandName} logo`}
            height={siteInfo.footerLogoHeight}
            imageClassName="rounded-md bg-black/35 p-1"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
            {siteInfo.tagline}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white/85 transition hover:border-[var(--accent)] hover:bg-[var(--brand)] hover:text-white"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent-soft)]">
            Explore
          </h2>
          <ul className="mt-5 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent-soft)]">
            Services
          </h2>
          <ul className="mt-5 space-y-2.5">
            {serviceLinks.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm text-white/80 transition hover:text-white"
                >
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="text-sm font-semibold text-[var(--accent-soft)] transition hover:text-white"
              >
                All services →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent-soft)]">
            Contact
          </h2>
          <ul className="mt-5 space-y-4 text-sm text-white/80">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <FiMail className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/75">Email</p>
                <a href={`mailto:${siteInfo.email}`} className="hover:text-white">
                  {siteInfo.email}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <FiPhone className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/75">Phone</p>
                <a href={phoneHref(siteInfo.phone)} className="hover:text-white">
                  {siteInfo.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <FiMapPin className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/75">Address</p>
                <p className="leading-relaxed">{siteInfo.address}</p>
              </div>
            </li>
          </ul>
        </div>
      </Container>

      <div className="relative border-t border-white/30 bg-black/15">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteInfo.brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="transition hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/our-concern" className="transition hover:text-white">
              Our Concern
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
