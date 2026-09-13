export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "archived";
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  mainLogo: string;
  footerLogo: string;
  favicon: string;
  mainLogoHeight: number;
  footerLogoHeight: number;
};

export type SeoSettings = {
  siteTitle: string;
  defaultDescription: string;
  ogImageLabel: string;
  twitterHandle: string;
  robotsIndex: boolean;
  canonicalBase: string;
};

export type PageSeoRow = {
  id: string;
  page: string;
  path: string;
  title: string;
  description: string;
};

export type AdminAccount = {
  name: string;
  email: string;
  role: string;
};

export type HomepageSection = {
  id: number;
  key: string;
  name: string;
  enabled: boolean;
  order: number;
};

export type AdminNavItem = {
  label: string;
  href: string;
  /** Hidden from editors. */
  ownerOnly?: boolean;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer" | string;
  createdAt: Date;
};
