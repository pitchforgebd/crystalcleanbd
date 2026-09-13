import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import {
  getBlogCategoryBySlug,
  listPostsByCategory,
  listBlogCategorySlugs,
} from "@/lib/repository/blog";
import { formatDate } from "@/lib/utils";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listBlogCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getBlogCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getBlogCategoryBySlug(slug),
    listPostsByCategory(slug),
  ]);
  if (!category) notFound();

  return (
    <>
      <PageHero
        eyebrow="Blog category"
        title={category.name}
        description={category.description}
        image={posts[0]?.featuredImage}
        imageAlt={posts[0]?.imageAlt}
      />
      <section className="section-space">
        <Container>
          <Link
            href="/blog"
            className="inline-flex text-sm font-bold text-[var(--brand)] underline-offset-4 hover:underline"
          >
            ← All posts
          </Link>
          {posts.length === 0 ? (
            <p className="mt-8 text-[var(--ink-muted)]">No posts in this category yet.</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="page-panel overflow-hidden p-0 transition hover:-translate-y-0.5"
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                        {formatDate(post.publishedAt)}
                      </p>
                      <h2 className="mt-2 display-font text-2xl text-[var(--brand-deep)] group-hover:text-[var(--brand)]">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--ink-muted)]">{post.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
