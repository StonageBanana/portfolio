import { cn } from "@/lib/cn";

/**
 * The MK monogram tile — the same artwork as the browser-tab favicon, inlined
 * as SVG so it scales crisply at any size and costs no extra request.
 *
 * Kept byte-identical in shape to `src/app/icon.svg`. If one changes, change
 * both, or the tab and the page stop agreeing.
 *
 * Letters are stroked paths rather than <text>: the favicon renders with no
 * access to the page's webfonts, so type would fall back per-machine, and the
 * two would drift apart.
 */
export function MarkIcon({
  size = 32,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect width="64" height="64" rx="6" fill="var(--marker)" />
      <g
        fill="none"
        stroke="var(--ink)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 46 V20 L22 33 L30 20 V46" />
        <path d="M38 20 V46" />
        <path d="M50 20 L38 33 L50 46" />
      </g>
    </svg>
  );
}
