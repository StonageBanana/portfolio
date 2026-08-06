import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * Anchor-styled CTA. `data-magnetic` marks it for the pointer-attraction
 * behaviour added in phase 7; `data-cursor="invert"` drives the custom cursor.
 * Both are inert until those layers exist.
 */
export function ButtonLink({
  href,
  children,
  kind = "primary",
  icon,
  external = false,
  className,
  download = false,
}: {
  href: string;
  children: ReactNode;
  kind?: "primary" | "secondary" | "ghost";
  icon?: string;
  external?: boolean;
  className?: string;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      data-magnetic
      data-cursor="invert"
      download={download || undefined}
      {...(external
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
      className={cn(
        "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[4px]",
        "px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase",
        "transition-colors duration-300",
        kind === "primary" &&
          "bg-marker text-ink hover:bg-marker/90",
        kind === "secondary" &&
          "border border-line text-bone hover:border-marker/60 hover:text-marker",
        kind === "ghost" && "text-muted hover:text-marker",
        className,
      )}
    >
      {/* Diagonal shimmer sweep — pure transform, so it composites. */}
      {kind === "primary" ? (
        <span
          aria-hidden="true"
          data-shimmer
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
        />
      ) : null}
      <span className="relative">{children}</span>
      {icon ? (
        <Icon
          name={icon}
          className="relative transition-transform duration-300 group-hover:translate-x-0.5"
        />
      ) : null}
    </a>
  );
}
