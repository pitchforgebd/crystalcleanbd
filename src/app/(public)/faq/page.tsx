import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { InnerCta } from "@/components/ui/InnerCta";
import { PageHero } from "@/components/ui/PageHero";
import { listFaqs } from "@/lib/repository/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Crystal Clean Service.",
};

export default async function FaqPage() {
  const items = await listFaqs();
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Answers to common questions"
        description="Clear demo answers about coverage, scheduling, supplies, and how to request a quote."
        actions={
          <Link href="/contact" className="btn btn-ghost">
            Still need help?
          </Link>
        }
      />
      <section className="section-space">
        <Container className="max-w-3xl">
          <div className="space-y-3">
            {sorted.map((item, index) => (
              <details
                key={item.id}
                className="group page-panel overflow-hidden open:shadow-[0_16px_36px_rgba(1,87,189,0.1)]"
              >
                <summary className="cursor-pointer list-none px-5 py-4 marker:content-none md:px-6 md:py-5">
                  <span className="flex items-start gap-4">
                    <span className="display-font mt-0.5 text-lg text-[var(--accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-1 items-start justify-between gap-4">
                      <span className="font-semibold text-[var(--brand-deep)]">
                        {item.question}
                      </span>
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--brand)] transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </span>
                </summary>
                <div className="border-t border-[var(--line)] px-5 pb-5 pt-4 md:px-6">
                  <p className="pl-11 text-sm leading-relaxed text-[var(--ink-muted)] md:pl-12">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <InnerCta
        title="Didn’t find your answer?"
        description="Send a short note with your space type and preferred schedule."
        label="Contact us"
      />
    </>
  );
}
