"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * 2px progress line pinned to the top of the viewport.
 *
 * Driven by ScrollTrigger, never React state — state would re-render on every
 * scroll frame for a value only CSS needs.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // Under reduced motion the bar is simply absent rather than jumping.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { scaleX: 0 });
      });

      return () => {
        mm.revert();
        ScrollTrigger.refresh();
      };
    },
    { dependencies: [] },
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
    >
      <div
        ref={ref}
        className="h-full w-full origin-left bg-marker"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
