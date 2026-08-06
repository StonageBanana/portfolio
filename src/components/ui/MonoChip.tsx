import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Small mono label. `tone` picks the accent — never pass "signal" to something
 * interactive, and never "marker" to a quantified result. That split is the
 * whole colour rule.
 */
export function MonoChip({
  children,
  tone = "muted",
  className,
  dashed = false,
}: {
  children: ReactNode;
  tone?: "muted" | "marker" | "signal";
  className?: string;
  dashed?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-1",
        "font-mono text-[10px] leading-none tracking-[0.14em] uppercase",
        dashed ? "border-dashed" : "border-solid",
        tone === "muted" && "border-line text-muted",
        tone === "marker" && "border-marker/40 text-marker",
        tone === "signal" && "border-signal/40 text-signal",
        className,
      )}
    >
      {children}
    </span>
  );
}
