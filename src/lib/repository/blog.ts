// Blog repository.
import { prisma } from "@/lib/db";
import { mapBlogCategory, mapBlogPost } from "@/lib/mappers";
import type { BlogCategory, BlogPost } from "@/lib/types";

export async function listBlogCategories(): Promise<BlogCategory[]> {
  const rows = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapBlogCategory);
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const row = await prisma.blogCategory.findUnique({ where: { slug } });
  return row ? mapBlogCategory(row) : null;
}

export async function listBlogPosts(opts?: {
  featured?: boolean;
  categorySlug?: string;
}): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: {
      published: true,
      ...(opts?.featured !== undefined ? { featured: opts.featured } : {}),
      ...(opts?.categorySlug !== undefined
        ? { categorySlug: opts.categorySlug }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  return row ? mapBlogPost(row) : null;
}

export async function listPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  return listBlogPosts({ categorySlug });
}

export async function listBlogPostSlugs(): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function listBlogCategorySlugs(): Promise<string[]> {
  const rows = await prisma.blogCategory.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
