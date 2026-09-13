import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { InnerCta } from "@/components/ui/InnerCta";
import {
  getBlogPostBySlug,
  getBlogCategoryBySlug,
  listBlogPostSlugs,
} from "@/lib/repository/blog";
import { formatDate } from "@/lib/utils";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog post" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featuredImage }],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const category = await getBlogCategoryBySlug(post.categorySlug);

  return (
    <article>
      <section className="relative min-h-[52vh] overflow-hidden text-white">
        <Image
          src={post.featuredImage}
          alt={post.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,42,88,0.35),rgba(4,42,88,0.88))]" />
        <Container className="relative flex min-h-[52vh] flex-col justify-end py-14 md:py-16">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
            {category ? (
              <Link
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[var(--accent)] backdrop-blur-sm"
              >
                {category.name}
              </Link>
            ) : null}
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <h1 className="mt-4 max-w-3xl display-font text-4xl leading-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-white/80">{post.author}</p>
        </Container>
      </section>

      <section className="section-space">
        <Container className="max-w-3xl">
          <div className="page-panel p-6 md:p-10">
            <p className="text-lg leading-relaxed text-[var(--ink)]">{post.excerpt}</p>
            <div className="mt-8 space-y-5 border-t border-[var(--line)] pt-8">
              {post.content.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-[var(--ink-muted)]">
                  {paragraph}
                </p>
              ))}
            </div>
            {post.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            <Link
              href="/blog"
              className="mt-10 inline-flex text-sm font-bold text-[var(--brand)] underline-offset-4 hover:underline"
            >
              ← Back to blog
            </Link>
          </div>
        </Container>
      </section>

      <InnerCta
        title="Put these ideas into practice"
        description="Book a visit and we will map a cleaning routine around your space."
      />
    </article>
  );
}
