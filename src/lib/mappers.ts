// DB row → domain type converters.
// All DB rows come from Prisma (plain JS objects); these functions apply the
// correct TypeScript types and decode JSON string arrays.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseJson<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as T[]; } catch { return [] as T[]; }
  }
  return [] as T[];
}

// ---------------------------------------------------------------------------
// Site
// ---------------------------------------------------------------------------

import type { SiteInfo } from "@/lib/types";
import type { SiteSettings, HomepageSection as DbHomepageSection } from "@/lib/admin-types";

export function mapSiteSettings(s: SiteSettings): SiteInfo {
  return {
    brandName:    s.brandName,
    tagline:      s.tagline,
    email:        s.email,
    phone:        s.phone,
    address:      s.address,
    mainLogo:     s.mainLogo,
    footerLogo:   s.footerLogo,
    favicon:      s.favicon,
    mainLogoHeight:   s.mainLogoHeight,
    footerLogoHeight: s.footerLogoHeight,
    mockNotice:   "",
  };
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

import type { HeroSlide } from "@/lib/types";

export function mapHeroSlide(r: {
  id: string; image: string; imageAlt: string; heading: string;
  subheading: string; text: string; ctaLabel: string; ctaHref: string;
  order: number; active: boolean;
}): HeroSlide {
  return { id: r.id, image: r.image, imageAlt: r.imageAlt, heading: r.heading,
    subheading: r.subheading, text: r.text, ctaLabel: r.ctaLabel, ctaHref: r.ctaHref };
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

import type { Service, ServiceIcon } from "@/lib/types";

export function mapService(r: {
  id: string; name: string; slug: string; category: string;
  icon: string; featuredImage: string; imageAlt: string;
  shortDescription: string; fullDescription: string;
  workScope: unknown; outcomes: unknown; features: unknown; packageTags: unknown;
  availability: string; rating: number; reviewCount: number;
  featured: boolean; popular: boolean; order: number;
}): Service {
  return {
    id: r.id, name: r.name, slug: r.slug, category: r.category,
    icon: r.icon as ServiceIcon,
    featuredImage: r.featuredImage, imageAlt: r.imageAlt,
    shortDescription: r.shortDescription, fullDescription: r.fullDescription,
    workScope: parseJson<string>(r.workScope),
    outcomes: parseJson<string>(r.outcomes),
    features: parseJson<string>(r.features),
    packageTags: parseJson<string>(r.packageTags),
    availability: r.availability, rating: r.rating, reviewCount: r.reviewCount,
    featured: r.featured, popular: r.popular, order: r.order,
  };
}

// ---------------------------------------------------------------------------
// Service Reviews
// ---------------------------------------------------------------------------

import type { ServiceReview } from "@/lib/types";

export function mapServiceReview(r: {
  id: string; serviceSlug: string; name: string; rating: number;
  comment: string; createdAt: Date | string;
}): ServiceReview {
  return {
    id: r.id, serviceSlug: r.serviceSlug, name: r.name,
    rating: r.rating, comment: r.comment,
    createdAt: r.createdAt instanceof Date
      ? r.createdAt.toISOString().split("T")[0]
      : String(r.createdAt),
  };
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

import type { Statistic } from "@/lib/types";

export function mapStatistic(r: {
  id: string; label: string; value: number; suffix: string; order: number;
}): Statistic {
  return { id: r.id, label: r.label, value: r.value, suffix: r.suffix };
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

import type { Testimonial } from "@/lib/types";

export function mapTestimonial(r: {
  id: string; name: string; role: string; quote: string;
  avatarSrc: string; avatarAlt: string; order: number;
}): Testimonial {
  return { id: r.id, name: r.name, role: r.role, quote: r.quote,
    avatarSrc: r.avatarSrc, avatarAlt: r.avatarAlt };
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

import type { ClientLogo } from "@/lib/types";

export function mapClient(r: {
  id: string; name: string; logoSrc: string; logoAlt: string;
}): ClientLogo {
  return { id: r.id, name: r.name, logoSrc: r.logoSrc, logoAlt: r.logoAlt };
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

import type { GalleryImage, GalleryVideo } from "@/lib/types";

export function mapGalleryImage(r: {
  id: string; title: string; alt: string; description: string;
  src: string; order: number;
}): GalleryImage {
  return { id: r.id, title: r.title, alt: r.alt, description: r.description,
    src: r.src, order: r.order };
}

export function mapGalleryVideo(r: {
  id: string; title: string; description: string;
  youtubeId: string; order: number;
}): GalleryVideo {
  return { id: r.id, title: r.title, description: r.description,
    youtubeId: r.youtubeId, order: r.order };
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

import type { BlogCategory, BlogPost } from "@/lib/types";

export function mapBlogCategory(r: {
  id: string; name: string; slug: string; description: string;
}): BlogCategory {
  return { id: r.id, name: r.name, slug: r.slug, description: r.description };
}

export function mapBlogPost(r: {
  id: string; title: string; slug: string; excerpt: string;
  content: string; featuredImage: string; imageAlt: string;
  author: string; publishedAt: Date | string; categorySlug: string;
  featured: boolean; tags: unknown; seoTitle: string | null;
  metaDescription: string | null; ogImage: string | null;
  canonical: string | null; published: boolean;
}): BlogPost {
  return {
    id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt,
    // BlogPost.content is string[] — split on double-newline as in the mock
    content: r.content.split("\n\n").filter(Boolean),
    featuredImage: r.featuredImage, imageAlt: r.imageAlt,
    author: r.author,
    publishedAt: r.publishedAt instanceof Date
      ? r.publishedAt.toISOString().split("T")[0]
      : String(r.publishedAt),
    categorySlug: r.categorySlug, featured: r.featured,
    tags: parseJson<string>(r.tags),
  };
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

import type { FaqItem } from "@/lib/types";

export function mapFaqItem(r: {
  id: string; question: string; answer: string; order: number;
}): FaqItem {
  return { id: r.id, question: r.question, answer: r.answer, order: r.order };
}

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

import type { SocialLink } from "@/lib/types";

export function mapSocialLink(r: {
  id: string; platform: string; label: string; href: string;
}): SocialLink {
  return { id: r.id,
    platform: r.platform as SocialLink["platform"],
    label: r.label, href: r.href };
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

import type { ConcernContent } from "@/lib/types";

export function mapConcernContent(r: {
  name: string; tagline: string; introduction: string;
  brandingNote: string; image: string; imageAlt: string;
  ctaLabel: string; ctaHref: string; features: unknown;
}): ConcernContent {
  return {
    name: r.name, tagline: r.tagline, introduction: r.introduction,
    brandingNote: r.brandingNote, image: r.image, imageAlt: r.imageAlt,
    ctaLabel: r.ctaLabel, ctaHref: r.ctaHref,
    features: parseJson<{ title: string; description: string }>(r.features),
  };
}

// ---------------------------------------------------------------------------
// About / Why-choose-us
// ---------------------------------------------------------------------------

import type { AboutContent as AboutType } from "@/lib/types";

export function mapAboutContent(r: {
  introduction: string; mission: string; vision: string;
  proprietorMessage: string; teamImage: string; teamImageAlt: string;
  workspaceImage: string; workspaceImageAlt: string;
  contactImage: string; contactImageAlt: string;
  values: unknown; whyChooseUs: unknown;
}): AboutType {
  return {
    introduction: r.introduction, mission: r.mission, vision: r.vision,
    proprietorMessage: r.proprietorMessage,
    teamImage: r.teamImage, teamImageAlt: r.teamImageAlt,
    workspaceImage: r.workspaceImage, workspaceImageAlt: r.workspaceImageAlt,
    contactImage: r.contactImage, contactImageAlt: r.contactImageAlt,
    values: parseJson<{ title: string; description: string }>(r.values),
    whyChooseUs: parseJson<string>(r.whyChooseUs),
  };
}

// ---------------------------------------------------------------------------
// Legal
// ---------------------------------------------------------------------------

export type LegalSection = { heading: string; body: string };
export type LegalPageShape = { title: string; updated: string; sections: LegalSection[] };

export function mapLegalPage(r: {
  title: string; updated: Date | string; sections: unknown;
}): LegalPageShape {
  return {
    title: r.title,
    updated: r.updated instanceof Date
      ? r.updated.toISOString().split("T")[0]
      : String(r.updated),
    sections: parseJson<LegalSection>(r.sections),
  };
}

// ---------------------------------------------------------------------------
// Homepage section (admin type)
// ---------------------------------------------------------------------------

export function mapHomepageSection(r: DbHomepageSection) {
  return { id: r.id, key: r.key, name: r.name, enabled: r.enabled, order: r.order };
}
