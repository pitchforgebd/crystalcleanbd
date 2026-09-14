import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { InnerCta } from "@/components/ui/InnerCta";
import { PageHero } from "@/components/ui/PageHero";
import { listBlogCategories, listBlogPosts } from "@/lib/repository/blog";
import { getPageSeoByPath } from "@/lib/repository/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath("/blog");
  return {
    title: pageSeo?.title || "Blog",
    description: pageSeo?.description || "Articles and notes from Crystal Clean Service.",
    alternates: pageSeo?.canonical ? { canonical: pageSeo.canonical } : undefined,
    openGraph: pageSeo?.ogImage ? { images: [{ url: pageSeo.ogImage }] } : undefined,
  };
}

export default async function BlogPage() {
  const [categories, posts] = await Promise.all([
    listBlogCategories(),
    listBlogPosts(),
  ]);

  const sorted = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const [featured, ...rest] = sorted;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Practical notes on cleaner spaces"
        description="Articles on workplace care, deep cleaning, and professional standards."
        image={featured?.featuredImage}
        imageAlt={featured?.imageAlt}
        actions={<ButtonLink href="/contact" variant="ghost">Talk to our team</ButtonLink>}
      />

      <section className="section-space">
        <Container>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] transition hover:border-[var(--brand)] hover:bg-[var(--accent-soft)]"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {featured ? (
            <article className="page-panel mt-10 overflow-hidden p-0">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid lg:grid-cols-[1.15fr_0.85fr]"
              >
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
                  <Image
                    src={featured.featuredImage}
                    alt={featured.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                    Featured · {formatDate(featured.publishedAt)}
                  </p>
                  <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] transition group-hover:text-[var(--brand)]">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)] md:text-base">
                    {featured.excerpt}
                  </p>
                  <span className="mt-6 text-sm font-bold text-[var(--brand)]">
                    Read article →
                  </span>
                </div>
              </Link>
            </article>
          ) : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.id}
                className="page-panel overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(1,87,189,0.1)]"
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--brand-deep)] transition group-hover:text-[var(--brand)]">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <InnerCta
        title="Questions after reading?"
        description="Reach out with your site details and we will recommend a practical cleaning plan."
      />
    </>
  );
}
