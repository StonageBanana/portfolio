import type { ReactNode } from "react";
import type { SectionMeta } from "@/content";
import { cn } from "@/lib/cn";

/** Page container: 12-column grid at lg+, generous gutters below. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-[var(--gutter)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section shell — owns the vertical rhythm, the hairline divider and the mono
 * eyebrow. Numbering comes from `sections` in content, so it is earned rather
 * than hand-typed per section.
 */
export function Section({
  meta,
  children,
  className,
  bare = false,
  cursor,
}: {
  meta: SectionMeta;
  children: ReactNode;
  className?: string;
  /** Landing manages its own full-height layout. */
  bare?: boolean;
  cursor?: "crosshair" | "invert";
}) {
  return (
    <section
      id={meta.id}
      data-section={meta.id}
      data-cursor={cursor}
      aria-labelledby={`${meta.id}-eyebrow`}
      className={cn(
        "relative scroll-mt-24",
        !bare && "py-[var(--section-rhythm)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  meta,
  className,
}: {
  meta: SectionMeta;
  className?: string;
}) {
  return (
    <p
      id={`${meta.id}-eyebrow`}
      className={cn("eyebrow flex items-center gap-3", className)}
    >
      <span className="tabular text-marker">{meta.index}</span>
      <span aria-hidden="true" className="text-line">
        /
      </span>
      <span>{meta.eyebrow}</span>
    </p>
  );
}

/** Structural hairline used as a section divider. */
export function Rule({ className }: { className?: string }) {
  return (
    <hr
      className={cn("border-0 border-t border-line", className)}
      aria-hidden="true"
    />
  );
}
