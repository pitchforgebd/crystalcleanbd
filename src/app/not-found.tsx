import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="section-space">
      <Container className="max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          404
        </p>
        <h1 className="mt-3 display-font text-4xl text-[var(--brand)]">Page not found</h1>
        <p className="mt-4 text-[var(--ink-muted)]">
          The page you requested is unavailable. Return home or browse services.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/services" className="btn btn-secondary">
            Services
          </Link>
        </div>
      </Container>
    </section>
  );
}
