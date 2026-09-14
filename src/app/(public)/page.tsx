import { Fragment, type ReactNode } from "react";
import {
  ClientLogos,
  ConcernPreview,
  GalleryPreview,
  JoinCta,
  LatestBlogs,
  TestimonialsSection,
} from "@/components/home/ContentSections";
import { HeroSpotlight } from "@/components/home/HeroSpotlight";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import {
  FeaturedServices,
  PopularServices,
  ServicesOverview,
} from "@/components/home/ServicesSections";
import { StatisticsSection } from "@/components/home/StatisticsSection";
import { getSiteInfo } from "@/lib/repository/site";
import { getHeroContent } from "@/lib/repository/hero";
import { listServices } from "@/lib/repository/services";
import { listStatistics } from "@/lib/repository/statistics";
import { listTestimonials } from "@/lib/repository/testimonials";
import { listGalleryImages, listGalleryVideos } from "@/lib/repository/gallery";
import { getConcernContent } from "@/lib/repository/concern";
import { listBlogPosts } from "@/lib/repository/blog";
import { listClients } from "@/lib/repository/clients";
import { listHomepageSections } from "@/lib/repository/homepage";

export default async function HomePage() {
  const [
    siteInfo,
    hero,
    services,
    statistics,
    testimonials,
    galleryImages,
    galleryVideos,
    concernContent,
    blogPosts,
    clients,
    sections,
  ] = await Promise.all([
    getSiteInfo(),
    getHeroContent(),
    listServices(),
    listStatistics(),
    listTestimonials(),
    listGalleryImages(),
    listGalleryVideos(),
    getConcernContent(),
    listBlogPosts({ featured: true }),
    listClients(),
    listHomepageSections(),
  ]);

  const sectionsByKey: Record<string, ReactNode> = {
    hero: (
      <HeroSpotlight
        hero={hero}
        services={services}
        statistics={statistics}
        siteInfo={siteInfo}
      />
    ),
    services: <ServicesOverview services={services} siteInfo={siteInfo} />,
    featured: <FeaturedServices services={services} siteInfo={siteInfo} />,
    stats: <StatisticsSection statistics={statistics} />,
    popular: <PopularServices services={services} />,
    join: <JoinCta />,
    testimonials: <TestimonialsSection items={testimonials} />,
    gallery: <GalleryPreview images={galleryImages} />,
    video: <VideoShowcase videos={galleryVideos} />,
    concern: <ConcernPreview content={concernContent} />,
    blog: <LatestBlogs posts={blogPosts} />,
    clients: <ClientLogos clients={clients} brandName={siteInfo.brandName} />,
  };

  const ordered = [...sections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {ordered.map((section) => (
        <Fragment key={section.key}>{sectionsByKey[section.key]}</Fragment>
      ))}
    </>
  );
}
