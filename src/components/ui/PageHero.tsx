"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { CleanSparkles } from "@/components/motion/CleanEffects";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
};

export function PageHero({
  title,
  description,
  eyebrow,
  image,
  imageAlt,
  actions,
}: PageHeroProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--brand-deep)] text-white">
      <CleanSparkles />

      <Container
        className={cn(
          "relative py-16 md:py-20",
          image && "grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]",
        )}
      >
        <motion.div
          className="max-w-3xl"
          initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow ? (
            <p className="mb-3 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="display-font text-4xl leading-[1.1] md:text-5xl lg:text-[3.35rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {description}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </motion.div>

        {image ? (
          <motion.div
            className="relative aspect-[16/11] overflow-hidden rounded-[1.35rem] border border-white/25 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            initial={reduce ? false : { opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02152c]/45 via-transparent to-transparent" />
          </motion.div>
        ) : (
          <div
            className="pointer-events-none absolute -right-8 bottom-0 hidden h-48 w-48 rounded-full border border-white/30 lg:block"
            aria-hidden
          />
        )}
      </Container>
    </section>
  );
}
