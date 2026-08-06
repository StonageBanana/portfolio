import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The annotation motif: a hairline bounding box with four L-shaped corner
 * ticks, as if something had been detected inside it. Used for the portrait,
 * certificate cards and achievement data-cards, so those three surfaces share
 * chrome whether or not an image asset exists.
 */
export function AnnotatedFrame({
  children,
  label,
  labelTone = "signal",
  className,
  innerClassName,
}: {
  children: ReactNode;
  /** e.g. `conf 0.98` — omit for no chip. */
  label?: string;
  labelTone?: "marker" | "signal" | "muted";
  className?: string;
  innerClassName?: string;
}) {
  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[4px] border border-line bg-panel",
          innerClassName,
        )}
      >
        {children}
      </div>

      {/* Corner ticks. Drawn outside the clip so they read as annotation
          overlaid on the frame, not decoration inside it. */}
      <CornerTicks />

      {label ? (
        <figcaption
          className={cn(
            "absolute -bottom-3 left-3 rounded-[4px] border px-2 py-1",
            "bg-ink font-mono text-[10px] leading-none tracking-[0.14em]",
            labelTone === "signal" && "border-signal/40 text-signal",
            labelTone === "marker" && "border-marker/40 text-marker",
            labelTone === "muted" && "border-line text-muted",
          )}
        >
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}

const TICK = "pointer-events-none absolute h-4 w-4 border-marker";

function CornerTicks() {
  return (
    <div aria-hidden="true" data-ticks>
      <span className={cn(TICK, "-top-px -left-px border-t border-l")} />
      <span className={cn(TICK, "-top-px -right-px border-t border-r")} />
      <span className={cn(TICK, "-bottom-px -left-px border-b border-l")} />
      <span className={cn(TICK, "-right-px -bottom-px border-r border-b")} />
    </div>
  );
}
