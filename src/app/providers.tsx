"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { MotionConfig } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Lenis ⇄ ScrollTrigger sync. Everything scroll-driven on this site sits on it.
 *
 * Lenis rewrites the real window scroll position (unlike transform-wrapper
 * approaches), so ScrollTrigger needs no scrollerProxy and pinning works
 * natively. Three details matter and all three are easy to get wrong:
 *
 *  1. `autoRaf: false` — otherwise Lenis runs its own RAF alongside GSAP's
 *     ticker and you have two scroll loops fighting.
 *  2. GSAP's ticker passes SECONDS; Lenis.raf() wants MILLISECONDS.
 *  3. Reduced motion changes Lenis *options* rather than swapping the wrapper.
 *     Swapping would remount the subtree and destroy every ScrollTrigger.
 */
export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Fonts swap in after the first measure; without this every trigger that
    // depends on text height is offset.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    // reducedMotion="user" strips transform and layout animations app-wide
    // while keeping opacity and colour — exactly "transforms become fades".
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        ref={lenisRef}
        options={{
          autoRaf: false,
          lerp: reduced ? 1 : 0.1,
          duration: reduced ? 0 : 1.2,
          smoothWheel: !reduced,
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
