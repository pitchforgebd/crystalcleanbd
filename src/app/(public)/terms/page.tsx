import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getLegalPage } from "@/lib/repository/legal";
import { getPageSeoByPath } from "@/lib/repository/seo";

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath("/terms");
  return {
    title: pageSeo?.title || "Terms & Conditions",
    description: pageSeo?.description || "Terms and conditions for using Crystal Clean Service.",
    alternates: pageSeo?.canonical ? { canonical: pageSeo.canonical } : undefined,
    openGraph: pageSeo?.ogImage ? { images: [{ url: pageSeo.ogImage }] } : undefined,
  };
}

export default async function TermsPage() {
  const page = await getLegalPage("terms");
  if (!page) return null;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={page.title}
        description={`Last updated ${page.updated}.`}
      />
      <section className="section-space">
        <Container className="max-w-3xl">
          <div className="page-panel divide-y divide-[var(--line)] overflow-hidden p-0">
            {page.sections.map((section, index) => (
              <div key={section.heading} className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <span className="display-font text-2xl text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="display-font text-2xl text-[var(--brand-deep)]">
                      {section.heading}
                    </h2>
                    <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">
                      {section.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
