function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-3.5 w-3.5 ${filled ? "fill-amber-400 text-amber-400" : "fill-none text-amber-400"}`}
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeWidth="1.4"
        d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z"
      />
    </svg>
  );
}

export function StarRating({
  rating,
  reviewCount,
  showCount = true,
}: {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={
        showCount && typeof reviewCount === "number"
          ? `Rating ${rating} from ${reviewCount} reviews`
          : `Rating ${rating} of 5`
      }
    >
      <span className="inline-flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon key={index} filled={index < Math.round(rating)} />
        ))}
      </span>
      {showCount && typeof reviewCount === "number" ? (
        <span className="text-xs text-[var(--ink-muted)]">({reviewCount})</span>
      ) : null}
    </div>
  );
}
