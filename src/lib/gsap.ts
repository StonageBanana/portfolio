"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * The single plugin-registration site. Everything else imports from here so
 * registration cannot happen twice or be missed.
 *
 * Client components are still server-rendered, so the window guard is required.
 * ScrollTrigger and SplitText both ship in the public gsap tarball (3.13+) —
 * no Club token, no private registry.
 */
if (typeof window !== "undefined") {
  // registerPlugin is idempotent, and this module is a singleton, so a plain
  // call is enough — no need to probe gsap.core.globals().
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

  // Mobile URL-bar show/hide fires resize constantly; without this every
  // trigger recalculates and the page thrashes.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing set. Do not introduce ad-hoc cubic-beziers alongside these. */
export const EASE = {
  entrance: "expo.out",
  scrub: "power2.inOut",
} as const;

export const SPRING = { stiffness: 120, damping: 18 } as const;

/** Standard reveal trigger: fires once, never re-animates on scroll up. */
export const REVEAL_TRIGGER = {
  start: "top 75%",
  toggleActions: "play none none none",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
