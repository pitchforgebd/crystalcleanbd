import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { InnerCta } from "@/components/ui/InnerCta";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCatalog } from "@/components/services/ServiceCatalog";
import { listServices } from "@/lib/repository/services";
import { getSiteInfo } from "@/lib/repository/site";
import { getPageSeoByPath } from "@/lib/repository/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [siteInfo, pageSeo] = await Promise.all([getSiteInfo(), getPageSeoByPath("/services")]);
  return {
    title: pageSeo?.title || "Services",
    description: pageSeo?.description || `Explore cleaning services offered by ${siteInfo.brandName}.`,
    alternates: pageSeo?.canonical ? { canonical: pageSeo.canonical } : undefined,
    openGraph: pageSeo?.ogImage ? { images: [{ url: pageSeo.ogImage }] } : undefined,
  };
}

export default async function ServicesPage() {
  const [services, siteInfo] = await Promise.all([listServices(), getSiteInfo()]);
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Cleaning services for workplaces and homes"
        description="Browse the full catalog. Each package opens with scope, availability, and customer reviews."
        image={services[0]?.featuredImage}
        imageAlt={services[0]?.imageAlt}
        actions={
          <>
            <ButtonLink href="/contact" variant="ghost">Hire Now</ButtonLink>
            <ButtonLink href="/gallery" variant="outline">
              View gallery
            </ButtonLink>
          </>
        }
      />

      <section className="section-space">
        <Container>
          <div className="max-w-2xl">
            <p className="page-kicker">Catalog</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
              Choose a service path
            </h2>
            <p className="mt-3 text-[var(--ink-muted)]">
              {services.length} packages across {categories.length} categories —
              commercial, residential, and specialty care.
            </p>
          </div>

          <ServiceCatalog services={services} siteInfo={siteInfo} />

        </Container>
      </section>

      <InnerCta
        title="Need a mix of services for one site?"
        description="Tell us about floors, restrooms, glass, and schedule preferences."
      />
    </>
  );
}
