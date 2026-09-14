// Testimonials repository.
import { prisma } from "@/lib/db";
import { mapTestimonial } from "@/lib/mappers";
import type { Testimonial } from "@/lib/types";

export async function listTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapTestimonial);
}

/** Admin listing — includes inactive testimonials so they can be reviewed and re-activated. */
export async function listAllTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapTestimonial);
}
