import { z } from "zod";

/**
 * An image reference: either an absolute URL (an externally hosted image) or a
 * site-relative path such as `/uploads/2026/09/photo.png` written by the admin
 * upload endpoint. Empty means "no image".
 */
export const imageSource = z
  .union([
    z.string().url(),
    z.string().regex(/^\/[^\s]*$/, "Use a full URL or a path starting with /"),
    z.literal(""),
  ])
  .default("");
