export type NavLink = {
  label: string;
  href: string;
};

export type HeroSlide = {
  id: string;
  image: string;
  imageAlt: string;
  heading: string;
  subheading: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: "spark" | "building" | "home" | "window" | "carpet" | "sanitize";
  featuredImage: string;
  imageAlt: string;
  shortDescription: string;
  fullDescription: string;
  workScope: string[];
  outcomes: string[];
  features: string[];
  availability: string;
  packageTags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  popular: boolean;
  order: number;
};

export type ServiceReview = {
  id: string;
  serviceSlug: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Statistic = {
  id: string;
  label: string;
  value: number;
  suffix: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarSrc: string;
  avatarAlt: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  logoSrc: string;
  logoAlt: string;
};

export type GalleryImage = {
  id: string;
  title: string;
  alt: string;
  description: string;
  src: string;
  order: number;
};

export type GalleryVideo = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  order: number;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  featuredImage: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  categorySlug: string;
  featured: boolean;
  tags: string[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type SocialLink = {
  id: string;
  platform: "facebook" | "instagram" | "youtube" | "linkedin" | "tiktok" | "whatsapp";
  label: string;
  href: string;
};

export type ConcernContent = {
  name: string;
  tagline: string;
  introduction: string;
  brandingNote: string;
  image: string;
  imageAlt: string;
  features: { title: string; description: string }[];
  ctaLabel: string;
  ctaHref: string;
};

export type AboutContent = {
  introduction: string;
  mission: string;
  vision: string;
  proprietorMessage: string;
  teamImage: string;
  teamImageAlt: string;
  workspaceImage: string;
  workspaceImageAlt: string;
  contactImage: string;
  contactImageAlt: string;
  values: { title: string; description: string }[];
  whyChooseUs: string[];
};

export type ServiceIcon =
  | "building" | "home" | "spark"
  | "window" | "carpet" | "sanitize";

export type SiteInfo = {
  brandName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  /** CMS-managed branding images; empty means "use the bundled default". */
  mainLogo: string;
  footerLogo: string;
  favicon: string;
  /** Rendered logo height in px; the width follows the image ratio. */
  mainLogoHeight: number;
  footerLogoHeight: number;
  mockNotice: string;
};
