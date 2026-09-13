"use client";

import Image from "next/image";
import { useState } from "react";
import { FiExternalLink, FiPlay } from "react-icons/fi";
import { CleanSparkles } from "@/components/motion/CleanEffects";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryVideo } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  videos: GalleryVideo[];
};

const clipLabel = (index: number) => `Clip ${String(index + 1).padStart(2, "0")}`;

/**
 * YouTube poster frame. `maxresdefault` only exists for HD sources, so fall
 * back to `hqdefault` — its 4:3 letterbox crops cleanly to 16:9 with object-cover.
 */
function PosterFrame({
  youtubeId,
  alt,
  sizes,
  priority = false,
}: {
  youtubeId: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">("maxresdefault");

  return (
    <Image
      key={`${youtubeId}-${quality}`}
      src={`https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      onError={() => setQuality("hqdefault")}
    />
  );
}

/** Three animated bars — marks the clip that is currently playing. */
function NowPlayingBars() {
  return (
    <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="eq-bar w-[3px] rounded-full bg-[var(--accent)]"
          style={{ height: "100%", animationDelay: `${bar * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export function VideoShowcase({ videos }: Props) {
  const sorted = [...videos].sort((a, b) => a.order - b.order).slice(0, 5);
  const [activeId, setActiveId] = useState(sorted[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);

  const activeIndex = Math.max(
    0,
    sorted.findIndex((video) => video.id === activeId),
  );
  const active = sorted[activeIndex];

  if (!active) return null;

  function select(id: string) {
    setActiveId(id);
    setPlaying(true);
  }

  return (
    <section className="section-space relative overflow-hidden bg-[var(--brand-deep)] text-white">
      <CleanSparkles />

      <Container className="relative">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              light
              eyebrow="Video"
              title="See the finish before you book"
              description="Walkthroughs and process highlights from our team."
            />
            <ButtonLink
              href="/gallery"
              variant="ghost"
              className="shrink-0 self-start md:self-auto"
            >
              Open full gallery
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.62fr_1fr] lg:gap-6">
            {/* ---------- Featured player ---------- */}
            <article className="overflow-hidden rounded-[1.6rem] border border-white/25 bg-white/10 p-2 shadow-[0_34px_80px_rgba(2,21,44,0.5)] backdrop-blur-sm">
              <div className="relative aspect-video overflow-hidden rounded-[1.15rem] bg-black">
                {playing ? (
                  <iframe
                    key={active.id}
                    title={active.title}
                    src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play ${active.title}`}
                    className="group absolute inset-0 block w-full cursor-pointer"
                  >
                    <PosterFrame
                      youtubeId={active.youtubeId}
                      alt={active.title}
                      sizes="(max-width: 1024px) 100vw, 62vw"
                      priority
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,21,44,0.35)_0%,rgba(2,21,44,0.1)_45%,rgba(2,21,44,0.75)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(2,21,44,0.25)_0%,rgba(2,21,44,0.05)_45%,rgba(2,21,44,0.7)_100%)]" />

                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
                      {clipLabel(activeIndex)}
                    </span>

                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="relative inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-white text-[var(--brand-deep)] shadow-[0_20px_50px_rgba(2,21,44,0.55)] transition duration-300 group-hover:scale-105 md:h-20 md:w-20">
                        <span className="video-pulse absolute inset-0 rounded-full bg-white/45" aria-hidden />
                        <FiPlay className="relative ml-1 h-7 w-7 fill-current" aria-hidden />
                      </span>
                    </span>

                    <span className="absolute inset-x-0 bottom-0 p-4 text-left md:p-5">
                      <span className="block display-font text-lg leading-snug text-white md:text-xl">
                        {active.title}
                      </span>
                    </span>
                  </button>
                )}
              </div>

              <div className="px-3 pb-3 pt-4 md:px-5 md:pb-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-soft)]">
                    {playing ? <NowPlayingBars /> : null}
                    {playing ? "Now playing" : clipLabel(activeIndex)}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                    {activeIndex + 1} of {sorted.length}
                  </span>
                </div>

                <h3 className="mt-3 display-font text-xl leading-snug text-white md:text-2xl">
                  {active.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">
                  {active.description}
                </p>

                <a
                  href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-soft)] transition hover:text-white"
                >
                  Watch on YouTube
                  <FiExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </article>

            {/* ---------- Playlist ---------- */}
            <aside className="flex flex-col rounded-[1.6rem] border border-white/25 bg-white/10 p-3 shadow-[0_24px_60px_rgba(2,21,44,0.35)] backdrop-blur-sm">
              <div className="flex items-center justify-between px-2 pb-3 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                  Playlist
                </p>
                <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                  {sorted.length} clips
                </span>
              </div>

              <ul className="flex flex-col gap-2">
                {sorted.map((video, index) => {
                  const isActive = video.id === active.id;
                  return (
                    <li key={video.id}>
                      <button
                        type="button"
                        onClick={() => select(video.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "group flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-2 text-left transition duration-300",
                          isActive
                            ? "border-[var(--accent)]/55 bg-white/20 shadow-[0_12px_30px_rgba(2,21,44,0.3)]"
                            : "border-transparent hover:border-white/30 hover:bg-white/[0.14]",
                        )}
                      >
                        <span className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl bg-black/50 sm:w-28">
                          <PosterFrame
                            youtubeId={video.youtubeId}
                            alt={video.title}
                            sizes="112px"
                          />
                          <span
                            className={cn(
                              "absolute inset-0 flex items-center justify-center transition",
                              isActive ? "bg-black/25" : "bg-black/45 group-hover:bg-black/25",
                            )}
                          >
                            {isActive && playing ? (
                              <NowPlayingBars />
                            ) : (
                              <FiPlay
                                className="h-4 w-4 fill-current text-white drop-shadow"
                                aria-hidden
                              />
                            )}
                          </span>
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-[10.5px] font-semibold uppercase tracking-[0.14em]",
                              isActive ? "text-[var(--accent-soft)]" : "text-white/75",
                            )}
                          >
                            {clipLabel(index)}
                          </span>
                          <span className="mt-0.5 block truncate text-sm font-bold text-white">
                            {video.title}
                          </span>
                          <span className="mt-0.5 block line-clamp-1 text-xs text-white/80">
                            {video.description}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-auto px-2 pb-1 pt-4 text-xs leading-relaxed text-white/75">
                Clips load only when you press play, so the page stays fast.
              </p>
            </aside>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
