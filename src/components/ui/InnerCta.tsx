import Link from "next/link";
import { Container } from "@/components/ui/Container";

type InnerCtaProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  label?: string;
};

export function InnerCta({
  eyebrow = "Next step",
  title,
  description,
  href = "/contact",
  label = "Hire Now",
}: InnerCtaProps) {
  return (
    <section className="section-space pt-0">
      <Container>
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[var(--brand)] px-6 py-10 text-white md:px-10">
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {eyebrow}
              </p>
              <h2 className="mt-2 display-font text-2xl md:text-3xl">{title}</h2>
              {description ? (
                <p className="mt-3 text-sm leading-relaxed text-white md:text-base">
                  {description}
                </p>
              ) : null}
            </div>
            <Link href={href} className="btn btn-ghost shrink-0 self-start md:self-auto">
              {label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
