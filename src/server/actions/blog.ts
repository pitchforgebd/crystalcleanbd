"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  blogCategoryInputSchema,
  blogPostInputSchema,
  deleteCategorySchema,
  deletePostSchema,
} from "@/server/validation/blog";

// ---- Categories ----

export async function createCategory(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = blogCategoryInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.blogCategory.create({ data: parsed.data });
    revalidatePath("/admin/blog/categories");
    revalidatePath("/blog");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A category with slug "${parsed.data.slug}" already exists.` };
    }
    return actionError("createCategory", err, "Failed to create category.");
  }
}

export async function updateCategory(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = blogCategoryInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.blogCategory.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/blog/categories");
    revalidatePath("/blog");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A category with slug "${parsed.data.slug}" already exists.` };
    }
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Category not found." };
    }
    return actionError("updateCategory", err, "Failed to update category.");
  }
}

export async function deleteCategory(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteCategorySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.blogCategory.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/blog/categories");
    revalidatePath("/blog");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Category not found." };
    }
    return actionError("deleteCategory", err, "Failed to delete category.");
  }
}

// ---- Posts ----

export async function createPost(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = blogPostInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  const d = parsed.data;
  try {
    const row = await prisma.blogPost.create({
      data: {
        title: d.title, slug: d.slug, excerpt: d.excerpt, content: d.content,
        featuredImage: d.featuredImage, imageAlt: d.imageAlt,
        author: d.author, publishedAt: new Date(d.publishedAt || "1970-01-01"),
        categorySlug: d.categorySlug, featured: d.featured, tags: d.tags,
        seoTitle: d.seoTitle, metaDescription: d.metaDescription,
        ogImage: d.ogImage, canonical: d.canonical, published: d.published,
      },
    });
    revalidatePath("/admin/blog/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${row.slug}`);
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A post with slug "${d.slug}" already exists.` };
    }
    return actionError("createPost", err, "Failed to create post.");
  }
}

export async function updatePost(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = blogPostInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  const d = parsed.data;
  try {
    const row = await prisma.blogPost.update({
      where: { id },
      data: {
        title: d.title, slug: d.slug, excerpt: d.excerpt, content: d.content,
        featuredImage: d.featuredImage, imageAlt: d.imageAlt,
        author: d.author, publishedAt: new Date(d.publishedAt || "1970-01-01"),
        categorySlug: d.categorySlug, featured: d.featured, tags: d.tags,
        seoTitle: d.seoTitle, metaDescription: d.metaDescription,
        ogImage: d.ogImage, canonical: d.canonical, published: d.published,
      },
    });
    revalidatePath("/admin/blog/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${row.slug}`);
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A post with slug "${d.slug}" already exists.` };
    }
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Post not found." };
    }
    return actionError("updatePost", err, "Failed to update post.");
  }
}

export async function deletePost(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deletePostSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.blogPost.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/blog/posts");
    revalidatePath("/blog");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Post not found." };
    }
    return actionError("deletePost", err, "Failed to delete post.");
  }
}
