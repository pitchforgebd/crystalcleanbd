import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const blogCategoryInputSchema = z.object({
  name:        z.string().min(1).max(160),
  slug:        z.string().min(1).max(160)
                 .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  description: z.string().max(500).default(""),
});

export const blogPostInputSchema = z.object({
  title:           z.string().min(1).max(255),
  slug:            z.string().min(1).max(255)
                    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  excerpt:         z.string().max(500).default(""),
  content:         z.string().min(1),
  featuredImage:   imageSource,
  imageAlt:       z.string().max(255).default(""),
  author:         z.string().max(160).default("Crystal Clean Editorial"),
  publishedAt:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format").default(""),
  categorySlug:   z.string().min(1).max(160),
  featured:       z.boolean().default(false),
  tags:           z.array(z.string()).default([]),
  seoTitle:       z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  ogImage:        imageSource.optional(),
  canonical:      z.string().max(255).optional(),
  published:      z.boolean().default(true),
});

export const deleteCategorySchema = z.object({ id: z.string().min(1) });
export const deletePostSchema = z.object({ id: z.string().min(1) });

export type BlogCategoryInput = z.infer<typeof blogCategoryInputSchema>;
export type BlogPostInput = z.infer<typeof blogPostInputSchema>;
