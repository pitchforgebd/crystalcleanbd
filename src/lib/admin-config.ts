// Static admin configuration (nav, role labels). Not a CMS module.
import type { AdminNavItem } from "@/lib/admin-types";

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Website Settings", href: "/admin/settings" },
  { label: "Homepage", href: "/admin/homepage" },
  { label: "About Page", href: "/admin/about" },
  { label: "Hero Slides", href: "/admin/hero-slides" },
  { label: "Services", href: "/admin/services" },
  { label: "Statistics", href: "/admin/statistics" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Gallery Images", href: "/admin/gallery/images" },
  { label: "Gallery Videos", href: "/admin/gallery/videos" },
  { label: "Blog Categories", href: "/admin/blog/categories" },
  { label: "Blog Posts", href: "/admin/blog/posts" },
  { label: "FAQ", href: "/admin/faq" },
  { label: "Contact Messages", href: "/admin/messages" },
  { label: "SEO", href: "/admin/seo" },
  { label: "Our Concern", href: "/admin/concern" },
  { label: "Legal Pages", href: "/admin/legal" },
  { label: "Admin Users", href: "/admin/users", ownerOnly: true },
  { label: "Storage", href: "/admin/storage", ownerOnly: true },
  { label: "Account", href: "/admin/account" },
];

export const roleLabels: Record<string, string> = {
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer",
};
