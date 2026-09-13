import type { Metadata } from "next";
import Link from "next/link";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUi";
import { adminNav } from "@/lib/admin-config";
import { listServices } from "@/lib/repository/services";
import { listBlogPosts } from "@/lib/repository/blog";
import { listGalleryImages } from "@/lib/repository/gallery";
import { listContactMessages } from "@/lib/repository/contact";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const [services, blogPosts, galleryImages, messages] = await Promise.all([
    listServices(),
    listBlogPosts(),
    listGalleryImages(),
    listContactMessages(),
  ]);

  const stats = [
    { label: "Services", value: services.length },
    { label: "Blog posts", value: blogPosts.length },
    { label: "New messages", value: messages.filter((m) => m.status === "new").length },
    { label: "Gallery images", value: galleryImages.length },
  ];

  const recent = messages.slice(0, 3);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of the content managed in this dashboard."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              {stat.label}
            </p>
            <p className="mt-3 display-font text-4xl text-[var(--brand)]">{stat.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AdminCard>
          <h2 className="text-lg font-semibold text-[var(--brand)]">Recent messages</h2>
          <ul className="mt-4 space-y-3">
            {recent.map((message) => (
              <li key={message.id} className="border-b border-[var(--line)] pb-3 last:border-0">
                <p className="font-medium">{message.subject}</p>
                <p className="text-sm text-[var(--ink-muted)]">
                  {message.name} · {message.status}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/messages"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            View all messages
          </Link>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-semibold text-[var(--brand)]">Quick links</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {adminNav.slice(1, 9).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[#f7fbfc]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}
