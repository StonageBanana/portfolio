"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { getReducedMotion } from "@/lib/motionPreference";

const RADIUS = 60;
const PULL = 8;

/**
 * Magnetic CTAs. Every `[data-magnetic]` element pulls ~8px toward the cursor
 * within a 60px radius and springs back on leave.
 *
 * One document-level pointermove rather than a listener per button, and
 * quickTo setters rather than fresh tweens per frame — a new gsap.to() on every
 * mousemove would allocate constantly.
 */
export function Magnetic() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (getReducedMotion()) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]"),
    );
    if (els.length === 0) return;

    const setters = els.map((el) => ({
      el,
      x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
      active: false,
    }));

    const onMove = (e: PointerEvent) => {
      for (const s of setters) {
        const r = s.el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < RADIUS + Math.max(r.width, r.height) / 2) {
          const f = PULL / Math.max(dist, 1);
          s.x(dx * f);
          s.y(dy * f);
          s.active = true;
        } else if (s.active) {
          s.x(0);
          s.y(0);
          s.active = false;
        }
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.set(els, { x: 0, y: 0 });
    };
  }, []);

  return null;
}
