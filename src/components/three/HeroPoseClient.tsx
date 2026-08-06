"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { getHeroCamera } from "@/lib/pose/camera";
import { landing } from "@/content";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { gsap, useGSAP } from "@/lib/gsap";
import { PosePoster } from "./PosePoster";

// ssr:false is mandatory — three touches `window` at module scope. On Tier C
// this import is never evaluated, so the chunk is never requested.
const PoseCanvas = dynamic(
  () => import("./PoseCanvas").then((m) => m.PoseCanvas),
  { ssr: false },
);

export function HeroPoseClient() {
  const tier = useDeviceTier();
  const scopeRef = useRef<HTMLDivElement>(null);
  // GSAP tweens this plain object; the WebGL loop reads it. Zero re-renders.
  const params = useRef({ distortion: 0 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scopeRef.current,
            start: "top top",
            // Scrubbed over the hero's natural scroll distance rather than a
            // pin. Pinning a resizing WebGL canvas under Lenis is the classic
            // source of jump/flicker bugs, and this reads nearly the same.
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Three beats: degrade → hold so the caption can be read → correct.
        tl.to(params.current, {
          distortion: 1,
          ease: "power2.in",
          duration: 0.45,
        })
          .to(params.current, { distortion: 1, duration: 0.25 })
          .to(params.current, {
            distortion: 0,
            ease: "power3.out",
            duration: 0.3,
          });

        // Captions ride the SAME timeline, so they cannot desync from the morph.
        tl.to('[data-caption="clean"]', { autoAlpha: 0, duration: 0.1 }, 0.08)
          .fromTo(
            '[data-caption="distorted"]',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.12 },
            0.2,
          )
          .to('[data-caption="distorted"]', { autoAlpha: 0, duration: 0.1 }, 0.7)
          .fromTo(
            '[data-caption="corrected"]',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.12 },
            0.78,
          );
      });

      // Reduced motion: the clean caption is simply the one that shows.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set('[data-caption="clean"]', { autoAlpha: 1 });
        gsap.set('[data-caption="distorted"],[data-caption="corrected"]', {
          autoAlpha: 0,
        });
        params.current.distortion = 0;
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <div
      ref={scopeRef}
      aria-hidden="true"
      // h-svh, not inset-0: the landing section grows taller than the viewport
      // once the copy stacks, and `inset-0` would centre the figure on the
      // section — pushing it below the fold on narrow screens.
      className="pointer-events-none absolute inset-x-0 top-0 h-svh overflow-hidden"
    >
      {/* On narrow screens the figure sits directly behind the intro copy, so
          it is dimmed hard and the mask is pulled up to the heading band.
          At lg the copy occupies the left columns and the figure can carry
          its full weight. */}
      <div className="absolute inset-0 opacity-25 [mask-image:radial-gradient(95%_55%_at_50%_28%,black,transparent_75%)] sm:opacity-45 lg:opacity-70 lg:[mask-image:radial-gradient(120%_90%_at_70%_45%,black,transparent_72%)]">
        {tier === "C" ? (
          // Two framings, CSS-swapped. The poster is server-rendered, so it
          // cannot read the viewport; picking the camera in JS would flash the
          // wrong framing on first paint. Both are pure SVG and cheap, and only
          // one is ever painted. (The WebGL path needs none of this — it reads
          // the real canvas size on mount.)
          <>
            <div className="h-full w-full sm:hidden">
              <PosePoster
                camera={getHeroCamera(420, 900)}
                width={420}
                height={900}
              />
            </div>
            <div className="hidden h-full w-full sm:block">
              <PosePoster
                camera={getHeroCamera(1600, 900)}
                width={1600}
                height={900}
              />
            </div>
          </>
        ) : (
          <PoseCanvas
            camera={getHeroCamera}
            tier={tier}
            distortionRef={params}
            pointer
            className="h-full w-full"
          />
        )}
      </div>

      {/* Hidden below lg — it would land on top of the intro paragraph. The
          same finding is stated in project 01's caption and first outcome. */}
      <div className="absolute right-[var(--gutter)] bottom-8 hidden max-w-[min(90vw,32rem)] text-right lg:block">
        <Caption id="clean" text={landing.captions.clean} visible />
        <Caption id="distorted" text={landing.captions.distorted} />
        <Caption id="corrected" text={landing.captions.corrected} signal />
      </div>
    </div>
  );
}

function Caption({
  id,
  text,
  visible = false,
  signal = false,
}: {
  id: string;
  text: string;
  visible?: boolean;
  signal?: boolean;
}) {
  return (
    <p
      data-caption={id}
      style={{ opacity: visible ? 1 : 0 }}
      className={`${
        visible ? "relative" : "absolute inset-x-0 bottom-0"
      } font-mono text-[10px] leading-relaxed tracking-[0.12em] ${
        signal ? "text-signal" : "text-muted"
      }`}
    >
      {text}
    </p>
  );
}
