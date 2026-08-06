"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  EASE,
  REVEAL_TRIGGER,
} from "@/lib/gsap";
import { countUp } from "@/lib/countUp";

/**
 * All scroll-driven motion, in one place.
 *
 * Sections stay server components; this operates on the data-attributes their
 * markup already carries. That also enforces the project rule that GSAP owns
 * scroll-driven motion and Framer owns component-local enter/exit — the two
 * never write transform to the same node.
 *
 * Everything lives inside `gsap.matchMedia()`. That is not a stylistic choice:
 * when the reduced-motion query starts matching, GSAP automatically reverts
 * every tween and ScrollTrigger created inside the block. A manual
 * `if (reduced)` leaves orphaned triggers and half-applied inline styles when
 * the user toggles the OS setting mid-session.
 */
export function PageMotion() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ---- text -----------------------------------------------------------
      // The hero's text is the Largest Contentful Paint element. Splitting it
      // and animating from opacity 0 means the biggest thing on the page stays
      // invisible until GSAP has downloaded, parsed, split it and started a
      // tween — measured at 4.06s LCP on a throttled phone. Below the fold that
      // cost is invisible; here it IS the metric. So on touch devices the hero
      // text paints immediately and only the rest of the page animates.
      const animateHeroText = window.matchMedia("(pointer: fine)").matches;
      const splitTargets = (selector: string) =>
        [...document.querySelectorAll<HTMLElement>(selector)].filter(
          (el) => animateHeroText || !el.closest("#landing"),
        );

      splitTargets('[data-split="chars"]').forEach(
        (el) => {
          const split = SplitText.create(el, {
            // "words,chars" — NOT "chars" alone. Splitting into bare characters
            // makes every letter its own inline box, so a line break can fall
            // mid-word ("Simhadri Mo / hana Kushal"). The word wrappers keep
            // words intact while still animating per character.
            type: "words,chars",
            mask: "chars",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 110,
                duration: 1,
                ease: EASE.entrance,
                stagger: 0.018,
                scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
              }),
          });
          splits.push(split);
        },
      );

      splitTargets('[data-split="words"]').forEach(
        (el) => {
          const split = SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                autoAlpha: 0,
                y: 12,
                duration: 0.7,
                ease: EASE.entrance,
                stagger: 0.008,
                scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
              }),
          });
          splits.push(split);
        },
      );

      // ---- counters -------------------------------------------------------
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const raw = el.dataset.count ?? el.textContent ?? "";
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => countUp(el, raw),
        });
      });

      // ---- landing --------------------------------------------------------
      // These run on load, NOT on a ScrollTrigger. They sit low in the hero,
      // below the "top 75%" line on a laptop viewport, so a scroll trigger
      // would never fire and they would stay at opacity 0 until the user
      // scrolled past them — i.e. invisible exactly when they matter most.
      const heroTl = gsap.timeline({ delay: 0.35 });

      const ctas = document.querySelectorAll("#landing [data-cta]");
      if (ctas.length)
        heroTl.from(ctas, {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: EASE.entrance,
          stagger: 0.08,
        });

      const socials = document.querySelectorAll("#landing [data-social]");
      if (socials.length)
        heroTl.from(
          socials,
          {
            scale: 0.4,
            autoAlpha: 0,
            duration: 0.6,
            ease: "back.out(2.2)",
            stagger: 0.08,
          },
          "-=0.35",
        );

      const permit = document.querySelector("#landing [data-permit]");
      if (permit)
        heroTl.from(
          permit,
          { autoAlpha: 0, y: 8, duration: 0.6, ease: EASE.entrance },
          "-=0.25",
        );

      const cue = document.querySelector<HTMLElement>("[data-scroll-cue]");
      if (cue) {
        const loop = gsap.to(cue, {
          y: 8,
          autoAlpha: 0.25,
          duration: 1.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        // Disappears permanently after the first scroll.
        ScrollTrigger.create({
          trigger: document.body,
          start: "top -80",
          once: true,
          onEnter: () => {
            loop.kill();
            gsap.to(cue, { autoAlpha: 0, duration: 0.4 });
          },
        });
      }

      // ---- about ----------------------------------------------------------
      batch("[data-parallax]", (el) => {
        gsap.from(el, {
          xPercent: -8,
          autoAlpha: 0,
          filter: "blur(14px)",
          duration: 1.1,
          ease: EASE.entrance,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        });
        // Slow parallax against the text column. This one scrubs continuously,
        // so it earns a promoted layer — but only while it is on screen.
        // A static will-change class would hold GPU memory for the whole page.
        gsap.fromTo(
          el,
          { y: 20 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onToggle: (self) =>
                gsap.set(el, {
                  willChange: self.isActive ? "transform" : "auto",
                }),
            },
          },
        );
        el.querySelectorAll("[data-ticks] span").forEach((tick, i) =>
          gsap.from(tick, {
            autoAlpha: 0,
            scale: 0.2,
            duration: 0.4,
            ease: "back.out(2)",
            delay: 0.55 + i * 0.06,
            scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
          }),
        );
      });

      batch("[data-flip-card]", (el, i) =>
        gsap.from(el, {
          rotationY: 32,
          autoAlpha: 0,
          transformPerspective: 900,
          duration: 0.9,
          ease: EASE.entrance,
          delay: i * 0.2,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        }),
      );

      // ---- experience -----------------------------------------------------
      const fill = document.querySelector<HTMLElement>("[data-timeline-fill]");
      const rail = fill?.parentElement;
      if (fill && rail) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rail,
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
              onToggle: (self) =>
                gsap.set(fill, {
                  willChange: self.isActive ? "transform" : "auto",
                }),
            },
          },
        );
      }

      batch("[data-timeline-node]", (el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              el,
              { scale: 1, boxShadow: "0 0 0 0 rgba(60,224,208,0.55)" },
              {
                scale: 1.15,
                boxShadow: "0 0 0 12px rgba(60,224,208,0)",
                duration: 0.9,
                ease: "expo.out",
              },
            ),
        }),
      );

      batch("[data-exp-card]", (el) => {
        gsap.from(el, {
          xPercent: -4,
          autoAlpha: 0,
          duration: 0.9,
          ease: EASE.entrance,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        });
        const cardRail = el.querySelector("[data-card-rail]");
        if (cardRail) {
          gsap.from(cardRail, {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.8,
            ease: EASE.entrance,
            delay: 0.2,
            scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
          });
        }
      });

      document.querySelectorAll<HTMLElement>("[data-bullet]").forEach((el) => {
        const dash = el.querySelector("[data-bullet-dash]");
        const text = el.querySelector("p");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        if (dash)
          tl.from(dash, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.35,
            ease: EASE.entrance,
          });
        if (text)
          tl.from(text, { autoAlpha: 0, y: 6, duration: 0.5 }, "-=0.15");
      });

      // ---- education ------------------------------------------------------
      batch("[data-edu-card]", (el, i) =>
        gsap.from(el, {
          y: i === 0 ? -48 : 48,
          rotation: i === 0 ? -1.6 : 0,
          autoAlpha: 0,
          duration: 1,
          ease: EASE.entrance,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        }),
      );

      batch("[data-edu-bullet] p", (el) =>
        gsap.from(el, {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
      );

      // ---- projects -------------------------------------------------------
      batch("[data-project]", (el) => {
        const panel = el.querySelector("[data-project-panel]");
        const body = el.querySelector("[data-project-body]");
        const flipped = panel?.classList.contains("lg:order-2");

        if (panel)
          gsap.from(panel, {
            xPercent: flipped ? 14 : -14,
            autoAlpha: 0,
            filter: "blur(12px)",
            duration: 1,
            ease: EASE.entrance,
            scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
          });

        if (body)
          gsap.from(body, {
            autoAlpha: 0,
            duration: 0.8,
            delay: 0.3,
            ease: EASE.entrance,
            scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
          });

        gsap.from(el.querySelectorAll("[data-outcome]"), {
          y: 26,
          rotation: 1.4,
          autoAlpha: 0,
          duration: 0.6,
          ease: EASE.entrance,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 68%", once: true },
        });

        gsap.from(el.querySelectorAll("[data-pill]"), {
          scale: 0.6,
          autoAlpha: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.6)",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 62%", once: true },
        });
      });

      // ---- skills ---------------------------------------------------------
      batch("[data-skill-card]", (el, i) =>
        gsap.from(el, {
          autoAlpha: 0,
          scale: 0.85,
          duration: 0.7,
          ease: EASE.entrance,
          delay: (i % 3) * 0.06 + Math.floor(i / 3) * 0.06,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        }),
      );

      batch("[data-skill-bar]", (el) => {
        const target = Number(
          el.parentElement?.parentElement?.querySelector("[data-skill-value]")
            ?.getAttribute("data-skill-value") ?? 0,
        );
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: target / 100,
            duration: 1,
            ease: EASE.entrance,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });

      // ---- certifications -------------------------------------------------
      batch("[data-cert-card]", (el, i) =>
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          rotation: gsap.utils.random(-2, 2),
          duration: 0.75,
          ease: EASE.entrance,
          delay: i * 0.08,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        }),
      );

      // ---- achievements ---------------------------------------------------
      batch("[data-achievement]", (el, i) =>
        gsap.from(el, {
          scale: 0.7,
          autoAlpha: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
          delay: i * 0.12,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        }),
      );

      // ---- contact --------------------------------------------------------
      batch("[data-contact-form]", (el) =>
        gsap.from(el, {
          y: 60,
          xPercent: -3,
          rotation: -1.2,
          autoAlpha: 0,
          duration: 1,
          ease: EASE.entrance,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        }),
      );

      batch("[data-contact-info]", (el) =>
        gsap.from(el, {
          y: 60,
          xPercent: 3,
          autoAlpha: 0,
          duration: 1,
          ease: EASE.entrance,
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
        }),
      );

      const footerLine = document.querySelector("[data-footer-line]");
      if (footerLine)
        gsap.fromTo(
          footerLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: EASE.entrance,
            scrollTrigger: { trigger: footerLine, start: "top 92%", once: true },
          },
        );

      return () => {
        splits.forEach((s) => s.revert());
        splits.length = 0;
      };
    });

    // Reduced motion: nothing animates, everything is simply present. GSAP
    // reverts the block above automatically when the query flips.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        "[data-skill-bar],[data-timeline-fill],[data-footer-line]",
        { clearProps: "transform" },
      );
      document
        .querySelectorAll<HTMLElement>("[data-skill-bar]")
        .forEach((el) => {
          const v = el.parentElement?.parentElement
            ?.querySelector("[data-skill-value]")
            ?.getAttribute("data-skill-value");
          if (v) el.style.transform = `scaleX(${Number(v) / 100})`;
        });
      gsap.set("[data-timeline-fill]", { scaleY: 1 });
      gsap.set("[data-footer-line]", { scaleX: 1 });
    });

    return () => mm.revert();
  }, []);

  return <div ref={scope} className="contents" />;
}

/** Applies `fn` to each match, with its index. */
function batch(
  selector: string,
  fn: (el: HTMLElement, index: number) => void,
) {
  document.querySelectorAll<HTMLElement>(selector).forEach(fn);
}

