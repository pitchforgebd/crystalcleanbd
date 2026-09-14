import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { InnerCta } from "@/components/ui/InnerCta";
import { PageHero } from "@/components/ui/PageHero";
import { listGalleryImages, listGalleryVideos } from "@/lib/repository/gallery";
import { getPageSeoByPath } from "@/lib/repository/seo";

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath("/gallery");
  return {
    title: pageSeo?.title || "Gallery",
    description: pageSeo?.description || "Image and video gallery for Crystal Clean Service.",
    alternates: pageSeo?.canonical ? { canonical: pageSeo.canonical } : undefined,
    openGraph: pageSeo?.ogImage ? { images: [{ url: pageSeo.ogImage }] } : undefined,
  };
}

export default async function GalleryPage() {
  const [images, videos] = await Promise.all([
    listGalleryImages(),
    listGalleryVideos(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Images and videos from finished work"
        description="Photos and footage from completed jobs across offices, homes, and shared spaces."
        image={images[0]?.src}
        imageAlt={images[0]?.alt}
        actions={<ButtonLink href="/contact" variant="ghost">Request a similar finish</ButtonLink>}
      />

      <section className="section-space">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="page-kicker">Photography</p>
              <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
                Finished spaces
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--ink-muted)]">
              {images.length} images showing offices, homes, glass, and hygiene zones.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <figure
                key={image.id}
                className="group overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-white shadow-[0_12px_30px_rgba(1,87,189,0.06)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02152c]/70 via-transparent to-transparent opacity-80" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-semibold">{image.title}</p>
                    {image.description ? (
                      <p className="mt-1 text-sm text-white/80">{image.description}</p>
                    ) : null}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space surface-panel">
        <Container>
          <div className="max-w-2xl">
            <p className="page-kicker">Video</p>
            <h2 className="mt-3 display-font text-3xl text-[var(--brand-deep)] md:text-4xl">
              Process and walkthrough clips
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {videos.map((video, index) => (
              <article key={video.id} className="page-panel overflow-hidden p-0">
                <div className="relative aspect-video bg-black/10">
                  <iframe
                    title={video.title}
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                    Clip {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 display-font text-xl text-[var(--brand-deep)]">
                    {video.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--ink-muted)]">{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <InnerCta
        title="Want results like these at your site?"
        description="Share a few details and we will recommend the right cleaning path."
      />
    </>
  );
}
