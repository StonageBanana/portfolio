"use client";

import { useEffect, useRef } from "react";
import { getReducedMotion } from "@/lib/motionPreference";

/**
 * Custom cursor: a ring that scales and inverts over interactive elements, and
 * snaps into a crosshair with a live x,y readout over the hero and project
 * panels — a nod to keypoint annotation.
 *
 * Never re-renders. Two nested nodes so JS and CSS don't fight over `transform`:
 * the outer node is translated by the rAF lerp, the inner handles scale/invert
 * via a CSS transition. Putting both in one transform string means the JS write
 * clobbers the CSS transition every frame.
 */
export function Cursor() {
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const mode = useRef("default");
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const lastReadout = useRef("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Applied from JS only — if JS fails, the native cursor survives.
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      // closest(), not matches(): a click on an icon *inside* a button still
      // resolves. A flat selector list fails on nested children constantly.
      const el = e.target as Element | null;
      const next = el?.closest?.("[data-cursor]")?.getAttribute("data-cursor");
      const resolved = next ?? "default";
      if (resolved !== mode.current) {
        mode.current = resolved;
        if (inner.current) inner.current.dataset.mode = resolved;
      }
    };

    const onLeave = () => {
      if (outer.current) outer.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (outer.current) outer.current.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    let raf = 0;
    const loop = () => {
      const k = getReducedMotion() ? 1 : 0.18;
      pos.current.x += (target.current.x - pos.current.x) * k;
      pos.current.y += (target.current.y - pos.current.y) * k;

      if (outer.current) {
        outer.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Written only in crosshair mode, and only when it changes — 60 needless
      // DOM writes a second otherwise.
      if (mode.current === "crosshair" && readout.current) {
        const s = `${Math.round(target.current.x)}, ${Math.round(target.current.y)}`;
        if (s !== lastReadout.current) {
          lastReadout.current = s;
          readout.current.textContent = s;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={outer}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[65] hidden opacity-0 transition-opacity duration-300 [@media(pointer:fine)]:block"
    >
      <div ref={inner} data-mode="default" className="group relative">
        {/* Ring */}
        <span className="block h-7 w-7 rounded-full border border-bone/70 transition-[transform,background-color,border-color] duration-300 ease-out group-data-[mode=invert]:scale-[1.9] group-data-[mode=invert]:border-transparent group-data-[mode=invert]:bg-bone group-data-[mode=crosshair]:scale-0" />

        {/* Crosshair */}
        <span className="absolute inset-0 grid scale-0 place-items-center transition-transform duration-300 ease-out group-data-[mode=crosshair]:scale-100">
          <span className="absolute h-px w-6 bg-marker" />
          <span className="absolute h-6 w-px bg-marker" />
        </span>

        <span
          ref={readout}
          className="tabular absolute top-4 left-5 font-mono text-[10px] whitespace-nowrap text-marker opacity-0 transition-opacity duration-300 group-data-[mode=crosshair]:opacity-100"
        />
      </div>
    </div>
  );
}
