"use client";

import { useEffect, useState } from "react";

/**
 * One IntersectionObserver rather than nine ScrollTriggers.
 *
 * This is the one piece of scroll state that genuinely belongs in React —
 * it drives a Framer `layoutId` morph in the rail. IO also fires only on
 * threshold crossings, where nine ScrollTriggers would each do work every tick.
 *
 * The rootMargin collapses the viewport to a narrow band at its centre, so
 * exactly one section is active; ties break on intersection ratio.
 */
export function useActiveSection(ids: readonly string[], fallback: string) {
  const [active, setActive] = useState(fallback);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [ids]);

  return active;
}
