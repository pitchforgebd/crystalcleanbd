import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        light ? "text-white" : "text-[var(--ink)]",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.18em]",
            light ? "text-white/85" : "text-[var(--accent)]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="display-font text-3xl leading-tight md:text-4xl">{title}</h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            light ? "text-white/80" : "text-[var(--ink-muted)]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
