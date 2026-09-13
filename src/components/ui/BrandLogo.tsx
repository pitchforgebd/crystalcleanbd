import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DEFAULT_LOGO = "/brand/crystal-clean-logo.jpg";

type BrandLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showWordmark?: boolean;
  /** CMS-managed logo; falls back to the bundled file when empty. */
  src?: string;
  alt?: string;
  /** Rendered height in px. Width follows the image ratio. */
  height?: number;
};

export function BrandLogo({
  href = "/",
  className,
  imageClassName,
  priority = false,
  src,
  alt,
  height,
}: BrandLogoProps) {
  // A CMS height wins over the default responsive sizing; width stays automatic
  // so the logo keeps its proportions at any size.
  const sized = typeof height === "number" && height > 0;

  const image = (
    <Image
      src={src?.trim() || DEFAULT_LOGO}
      alt={alt ?? "Crystal Clean Service logo"}
      width={512}
      height={224}
      priority={priority}
      sizes="(max-width: 768px) 50vw, 320px"
      style={sized ? { height: `${height}px`, width: "auto" } : undefined}
      className={cn(
        "block object-contain",
        sized
          ? "max-w-[min(60vw,320px)]"
          : "!h-7 !w-auto !max-h-7 !max-w-[110px] md:!h-8 md:!max-h-8 md:!max-w-[128px]",
        imageClassName,
      )}
    />
  );

  if (!href) {
    return <div className={cn("inline-flex shrink-0 items-center", className)}>{image}</div>;
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label={alt ?? "Crystal Clean Service home"}
    >
      {image}
    </Link>
  );
}
