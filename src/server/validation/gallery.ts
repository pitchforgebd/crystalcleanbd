import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const galleryImageInputSchema = z.object({
  title:       z.string().min(1).max(160),
  alt:         z.string().max(255).default(""),
  description: z.string().default(""),
  src:         imageSource,
  order:       z.number().int().min(0).default(0),
  active:      z.boolean().default(true),
});

export const galleryVideoInputSchema = z.object({
  title:       z.string().min(1).max(160),
  description: z.string().default(""),
  youtubeId:   z.string().min(1).max(64),
  order:       z.number().int().min(0).default(0),
  active:      z.boolean().default(true),
});

export const deleteGalleryImageSchema = z.object({ id: z.string().min(1) });
export const deleteGalleryVideoSchema = z.object({ id: z.string().min(1) });

export type GalleryImageInput = z.infer<typeof galleryImageInputSchema>;
export type GalleryVideoInput = z.infer<typeof galleryVideoInputSchema>;
