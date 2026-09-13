import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"a"> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  block?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  outline: "btn-outline",
};

export function ButtonLink({
  className,
  variant = "primary",
  block = false,
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn("btn", variants[variant], block && "btn-block", className)}
      {...props}
    />
  );
}
