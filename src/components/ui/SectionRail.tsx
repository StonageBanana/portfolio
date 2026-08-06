"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { sections } from "@/content";
import { useLenisScrollTo } from "@/hooks/useLenisScrollTo";
import { SPRING } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Fixed right-edge rail, 01 → 09. The active dot expands into a labelled pill.
 *
 * The pill background is a single shared element with `layoutId`, so it moves
 * and resizes between entries rather than cross-fading — which is exactly the
 * "expands into a pill" motion. Under reduced motion, `MotionConfig
 * reducedMotion="user"` makes the layout animation instant for free.
 */
export function SectionRail({ active }: { active: string }) {
  const scrollTo = useLenisScrollTo();

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 md:block"
    >
      <LayoutGroup id="rail">
        <ul className="pointer-events-auto flex flex-col items-end gap-1">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${s.index} — ${s.label}`}
                  data-cursor="invert"
                  className={cn(
                    "group relative flex items-center gap-2 rounded-full px-2.5 py-1.5",
                    "font-mono text-[10px] tracking-[0.14em] transition-colors duration-300",
                    isActive ? "text-ink" : "text-muted hover:text-bone",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="railPill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-marker"
                      transition={{ type: "spring", ...SPRING }}
                    />
                  ) : null}

                  <span className="tabular relative">{s.index}</span>

                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="relative overflow-hidden whitespace-nowrap uppercase"
                      >
                        {s.label}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
