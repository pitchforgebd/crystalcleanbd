"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { StarRating } from "@/components/services/StarRating";
import type { Service, ServiceReview, SiteInfo } from "@/lib/types";
import { cn, formatDate, phoneHref } from "@/lib/utils";

type TabKey = "description" | "availability" | "reviews";

type ServiceDetailViewProps = {
  service: Service;
  reviews: ServiceReview[];
  siteInfo: SiteInfo;
};

export function ServiceDetailView({ service, reviews, siteInfo }: ServiceDetailViewProps) {
  const [tab, setTab] = useState<TabKey>("description");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewStatus, setReviewStatus] = useState<"idle" | "success">("idle");

  function onReviewSubmit(event: FormEvent) {
    event.preventDefault();
    setReviewStatus("success");
    setReviewNote("");
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "availability", label: "Availability" },
    { key: "reviews", label: "Client Reviews" },
  ];

  return (
    <div className="bg-[var(--bg)]">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="container-page py-6 md:py-8">
          <nav className="text-sm text-[var(--ink-muted)]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[var(--brand)]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:text-[var(--brand)]">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-[var(--ink)]">{service.name}</li>
            </ol>
          </nav>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            {service.category}
          </p>
          <h1 className="mt-2 display-font text-3xl text-[var(--brand-deep)] md:text-5xl">
            {service.name}
          </h1>
        </div>
      </section>

      <section className="container-page grid gap-8 py-8 lg:grid-cols-[1.45fr_0.75fr] lg:py-12">
        <div className="min-w-0">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
            <Image
              src={service.featuredImage}
              alt={service.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
            <div className="flex flex-wrap border-b border-[var(--line)]" role="tablist">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.key}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold transition md:px-5",
                    tab === item.key
                      ? "border-b-2 border-[var(--brand)] text-[var(--brand)]"
                      : "text-[var(--ink-muted)] hover:text-[var(--brand)]",
                  )}
                  onClick={() => setTab(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-7" role="tabpanel">
              {tab === "description" ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--ink)]">{service.name}</h2>
                    <p className="mt-4 leading-relaxed text-[var(--ink-muted)]">
                      {service.fullDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">Service scope</h3>
                    <ul className="mt-4 space-y-2">
                      {service.workScope.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[var(--ink-muted)] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--accent)] before:content-['']"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">What you will get</h3>
                    <ul className="mt-4 space-y-3">
                      {service.outcomes.map((item) => (
                        <li
                          key={item}
                          className="rounded-xl bg-[var(--accent-soft)]/50 px-4 py-3 text-sm leading-relaxed text-[var(--ink)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">Key features</h3>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-muted)]"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {tab === "availability" ? (
                <div>
                  <h2 className="text-xl font-semibold text-[var(--ink)]">Service availability</h2>
                  <p className="mt-4 leading-relaxed text-[var(--ink-muted)]">
                    {service.availability}
                  </p>
                  <Link
                    href="/contact"
                    className="btn btn-primary mt-6"
                  >
                    Request a schedule
                  </Link>
                </div>
              ) : null}

              {tab === "reviews" ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--ink)]">Client reviews</h2>
                    <div className="mt-3">
                      <StarRating rating={service.rating} reviewCount={service.reviewCount} />
                    </div>
                    {reviews.length === 0 ? (
                      <p className="mt-4 text-sm text-[var(--ink-muted)]">
                        No reviews yet for this service. Demo reviews will appear here once the CMS
                        review module is connected.
                      </p>
                    ) : (
                      <ul className="mt-6 space-y-4">
                        {reviews.map((review) => (
                          <li
                            key={review.id}
                            className="border border-[var(--line)] px-4 py-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-semibold">{review.name}</p>
                              <p className="text-xs text-[var(--ink-muted)]">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                            <div className="mt-2">
                              <StarRating rating={review.rating} showCount={false} />
                            </div>
                            <p className="mt-3 text-sm text-[var(--ink-muted)]">{review.comment}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <form
                    onSubmit={onReviewSubmit}
                    className="rounded-2xl border border-[var(--line)] bg-[#f7fbfc] p-5"
                  >
                    <h3 className="text-lg font-semibold text-[var(--ink)]">Write your review</h3>
                    <p className="mt-2 text-xs text-[var(--ink-muted)]">
                      Demo form only — reviews are not stored yet.
                    </p>
                    <label className="mt-4 block text-sm font-medium" htmlFor="review-comment">
                      Comment
                    </label>
                    <textarea
                      id="review-comment"
                      required
                      rows={4}
                      value={reviewNote}
                      onChange={(event) => setReviewNote(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary mt-4"
                    >
                      Submit review
                    </button>
                    {reviewStatus === "success" ? (
                      <p className="mt-3 text-sm font-medium text-[var(--success)]" role="status">
                        Demo success: review validation passed. Nothing was saved.
                      </p>
                    ) : null}
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              Service package
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {service.packageTags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <a
              href={phoneHref(siteInfo.phone)}
              className="btn btn-primary btn-block mt-5"
            >
              {siteInfo.phone}
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/crystal-clean-logo.jpg"
                alt=""
                width={48}
                height={48}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--line)]"
              />
              <div>
                <h2 className="font-semibold text-[var(--ink)]">{siteInfo.brandName}</h2>
                <p className="text-xs text-[var(--ink-muted)]">Professional cleaning provider</p>
              </div>
            </div>
            <div className="mt-4">
              <StarRating rating={service.rating} reviewCount={service.reviewCount} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-muted)]">
              {siteInfo.tagline}
            </p>
            <div className="mt-4 space-y-2 text-sm text-[var(--ink-muted)]">
              <p>{siteInfo.email}</p>
              <p>{siteInfo.phone}</p>
            </div>
            <Link
              href="/contact"
              className="btn btn-secondary btn-block mt-5"
            >
              Request this service
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
