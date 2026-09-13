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
import { listHeroSlides } from "@/lib/repository/hero";
import { listServices } from "@/lib/repository/services";
import { listStatistics } from "@/lib/repository/statistics";
import { listTestimonials } from "@/lib/repository/testimonials";
import { listGalleryImages, listGalleryVideos } from "@/lib/repository/gallery";
import { getConcernContent } from "@/lib/repository/concern";
import { listBlogPosts } from "@/lib/repository/blog";
import { listClients } from "@/lib/repository/clients";

export default async function HomePage() {
  const [
    siteInfo,
    heroSlides,
    services,
    statistics,
    testimonials,
    galleryImages,
    galleryVideos,
    concernContent,
    blogPosts,
    clients,
  ] = await Promise.all([
    getSiteInfo(),
    listHeroSlides(),
    listServices(),
    listStatistics(),
    listTestimonials(),
    listGalleryImages(),
    listGalleryVideos(),
    getConcernContent(),
    listBlogPosts({ featured: true }),
    listClients(),
  ]);

  return (
    <>
      <HeroSpotlight
        slides={heroSlides}
        services={services}
        statistics={statistics}
        siteInfo={siteInfo}
      />
      <ServicesOverview services={services} siteInfo={siteInfo} />
      <FeaturedServices services={services} siteInfo={siteInfo} />
      <StatisticsSection statistics={statistics} />
      <PopularServices services={services} />
      <JoinCta />
      <TestimonialsSection items={testimonials} />
      <GalleryPreview images={galleryImages} />
      <VideoShowcase videos={galleryVideos} />
      <ConcernPreview content={concernContent} />
      <LatestBlogs posts={blogPosts} />
      <ClientLogos clients={clients} brandName={siteInfo.brandName} />
    </>
  );
}
