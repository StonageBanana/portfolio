import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Display heading. `data-split` marks it for character-level splitting in
 * phase 6 — the markup shape stays identical either way, so the static and
 * animated versions never diverge.
 */
export function Heading({
  children,
  as: Tag = "h2",
  size = "lg",
  className,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  size?: "xl" | "lg" | "md";
  className?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      data-split="chars"
      className={cn(
        "font-display text-bone",
        "[text-wrap:balance] tracking-[-0.03em]",
        size === "xl" &&
          "text-[clamp(2.4rem,6.6vw,6.25rem)] leading-[0.94] tracking-[-0.045em]",
        size === "lg" && "text-[clamp(2rem,4.6vw,4rem)] leading-[0.98]",
        size === "md" && "text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Body copy. `data-split="words"` marks it for word-level reveal. */
export function Body({
  children,
  className,
  muted = false,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <p
      data-split="words"
      className={cn(
        "text-[clamp(0.875rem,0.98vw,1rem)] leading-[1.7]",
        muted ? "text-muted" : "text-bone/85",
        className,
      )}
    >
      {children}
    </p>
  );
}
