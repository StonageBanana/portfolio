"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { getInlineCamera } from "@/lib/pose/camera";
import { landing } from "@/content";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { gsap, useGSAP } from "@/lib/gsap";
import { PosePoster } from "./PosePoster";

const PoseCanvas = dynamic(
  () => import("./PoseCanvas").then((m) => m.PoseCanvas),
  { ssr: false },
);

/**
 * The inline instance inside project card 01 — the same renderer as the hero,
 * different options.
 *
 * The card pins for one extra viewport while the skeleton scrubs distorted →
 * corrected, which is the project's headline result stated as motion rather
 * than as a sentence.
 *
 * On Tier B/C this cross-fades two static SVG renders instead of standing up a
 * second WebGL context. Two live contexts double init cost and GPU memory, and
 * at this size the 3D detail is imperceptible anyway.
 */
export function InlinePose() {
  const tier = useDeviceTier();
  const scope = useRef<HTMLDivElement>(null);
  const params = useRef({ distortion: 1 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const card = scope.current?.closest("[data-project]") as HTMLElement | null;

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () => {
          if (!card) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "center center",
              end: "+=100%",
              pin: true,
              pinSpacing: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          tl.to(params.current, { distortion: 0, ease: "power2.inOut" });

          // Static-render fallback cross-fade rides the same timeline.
          tl.to("[data-inline-distorted]", { autoAlpha: 0, ease: "none" }, 0);

          tl.fromTo(
            "[data-inline-caption]",
            { autoAlpha: 0.35 },
            { autoAlpha: 1, ease: "none" },
            0,
          );
        },
      );

      // Narrow or reduced motion: show the corrected state, no pin, no scrub.
      mm.add(
        "(prefers-reduced-motion: reduce), (max-width: 1023px)",
        () => {
          params.current.distortion = 0;
          gsap.set("[data-inline-distorted]", { autoAlpha: 0 });
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="absolute inset-0">
      {tier === "C" ? (
        <>
          <PosePoster
            camera={getInlineCamera()}
            width={480}
            height={360}
            showGrid={false}
            markerRadius={3.4}
            dimmed
          />
          <div data-inline-distorted className="absolute inset-0">
            <PosePoster
              camera={getInlineCamera()}
              width={480}
              height={360}
              showGrid={false}
              markerRadius={3.4}
              distortion={1}
              dimmed
            />
          </div>
        </>
      ) : (
        <PoseCanvas
          camera={getInlineCamera}
          tier={tier}
          distortionRef={params}
          grid={false}
          markerScale={0.75}
          className="h-full w-full"
        />
      )}

      <p
        data-inline-caption
        className="absolute inset-x-2 bottom-2 text-center font-mono text-[9px] leading-relaxed tracking-[0.1em] text-signal"
      >
        {landing.captions.corrected}
      </p>
    </div>
  );
}
