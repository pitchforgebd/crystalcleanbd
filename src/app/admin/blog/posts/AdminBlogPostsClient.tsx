"use client";

import { FormEvent, useState } from "react";
import {
  ConfirmDeleteButton,
  FeedbackBanner,
  useAdminCrud,
} from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  AdminTable,
  Field,
  StatusBadge,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import type { BlogCategory, BlogPost } from "@/lib/types";
import { createPost, deletePost, updatePost } from "@/server/actions/blog";
import { ImageField } from "@/components/admin/ImageField";

/** What the form collects (content/tags as raw text). */
type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  contentText: string;
  author: string;
  publishedAt: string;
  categorySlug: string;
  featured: boolean;
  tagsText: string;
  featuredImage: string;
  imageAlt: string;
};

/** What the Server Action expects. */
type PostPayload = Omit<PostForm, "contentText" | "tagsText"> & {
  content: string;
  tags: string[];
};

type Props = { initial: { posts: BlogPost[]; categories: BlogCategory[] } };

export function AdminBlogPostsClient({ initial }: Props) {
  const [categories] = useState<BlogCategory[]>(initial.categories);
  const emptyDraft: PostForm = {
    title: "",
    slug: "",
    excerpt: "",
    contentText: "",
    author: "Crystal Clean Editorial",
    publishedAt: new Date().toISOString().slice(0, 10),
    categorySlug: initial.categories[0]?.slug ?? "",
    featured: false,
    tagsText: "",
    featuredImage: "",
    imageAlt: "",
  };
  const [draft, setDraft] = useState<PostForm>(emptyDraft);
  const { rows, editingId, setEditingId, feedback, message, isPending, save, destroy } =
    useAdminCrud<BlogPost, PostPayload>({
      initial: initial.posts,
      create: createPost,
      update: updatePost,
      remove: deletePost,
      noun: "Post",
      toRow: (payload, id) => ({
        id,
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        author: payload.author,
        publishedAt: payload.publishedAt,
        categorySlug: payload.categorySlug,
        featured: payload.featured,
        tags: payload.tags,
        featuredImage: payload.featuredImage,
        imageAlt: payload.imageAlt,
      }),
      onSaved: () => setDraft(emptyDraft),
    });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.slug.trim()) return;
    const { contentText, tagsText, ...rest } = draft;
    save({
      ...rest,
      content: contentText,
      tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        description="Draft and publish posts with categories, excerpts, and SEO-friendly slugs."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminTable headers={["Title", "Category", "Date", "Featured", "Actions"]}>
          {rows.map((post) => (
            <tr key={post.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">{post.title}</td>
              <td className="px-4 py-3">{post.categorySlug}</td>
              <td className="px-4 py-3">{post.publishedAt}</td>
              <td className="px-4 py-3">
                <StatusBadge active={post.featured} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => {
                      setEditingId(post.id);
                      setDraft({
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        contentText: post.content.join("\n"),
                        author: post.author,
                        publishedAt: post.publishedAt,
                        categorySlug: post.categorySlug,
                        featured: post.featured,
                        tagsText: post.tags.join(", "),
                        featuredImage: post.featuredImage,
                        imageAlt: post.imageAlt,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={isPending}
                    onConfirm={() => destroy(post.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit post" : "Add post"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Title">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) => setDraft((c) => ({ ...c, title: event.target.value }))}
              />
            </Field>
            <Field label="Slug">
              <input
                className={inputClass}
                value={draft.slug}
                onChange={(event) => setDraft((c) => ({ ...c, slug: event.target.value }))}
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={draft.categorySlug}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, categorySlug: event.target.value }))
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Excerpt">
              <textarea
                className={textareaClass}
                value={draft.excerpt}
                onChange={(event) => setDraft((c) => ({ ...c, excerpt: event.target.value }))}
              />
            </Field>
            <Field label="Content" hint="One paragraph per line.">
              <textarea
                className={textareaClass}
                value={draft.contentText}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, contentText: event.target.value }))
                }
              />
            </Field>
            <ImageField
              label="Featured image"
              value={draft.featuredImage}
              onChange={(url) => setDraft((c) => ({ ...c, featuredImage: url }))}
            />
            <Field label="Image alt text">
              <input
                className={inputClass}
                value={draft.imageAlt}
                onChange={(event) => setDraft((c) => ({ ...c, imageAlt: event.target.value }))}
              />
            </Field>
            <Field label="Tags" hint="Comma-separated">
              <input
                className={inputClass}
                value={draft.tagsText}
                onChange={(event) => setDraft((c) => ({ ...c, tagsText: event.target.value }))}
              />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, featured: event.target.checked }))
                }
              />
              Featured post
            </label>
            <button
              type="submit"
              className="rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {editingId ? "Update post" : "Create post"}
            </button>
            <FeedbackBanner feedback={feedback} message={message} />
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
