import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import {
  getServiceBySlug,
  listServiceReviews,
  listServiceSlugs,
} from "@/lib/repository/services";
import { getSiteInfo } from "@/lib/repository/site";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.name,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [service, reviews, siteInfo] = await Promise.all([
    getServiceBySlug(slug),
    listServiceReviews(slug),
    getSiteInfo(),
  ]);
  if (!service) notFound();

  return <ServiceDetailView service={service} reviews={reviews} siteInfo={siteInfo} />;
}
