"use client";

import { useEffect, useRef, type RefObject } from "react";
import { PoseRenderer } from "@/lib/pose/PoseRenderer";
import type { CameraSpec } from "@/lib/pose/camera";
import type { DeviceTier } from "@/hooks/useDeviceTier";

/**
 * Thin React wrapper over the imperative renderer. Owns mounting, resizing and
 * RAF gating; knows nothing about what the skeleton is doing.
 *
 * `distortionRef` is a mutable ref that GSAP tweens directly. Routing that
 * value through React state would re-render on every scroll frame for a number
 * only the WebGL loop reads.
 */
export function PoseCanvas({
  camera,
  tier,
  distortionRef,
  pointer = false,
  idle = true,
  grid = true,
  markerScale = 1,
  className,
  onReady,
}: {
  camera: (w: number, h: number) => CameraSpec;
  tier: Exclude<DeviceTier, "C">;
  distortionRef: RefObject<{ distortion: number }>;
  pointer?: boolean;
  idle?: boolean;
  grid?: boolean;
  markerScale?: number;
  className?: string;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PoseRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tierA = tier === "A";
    const renderer = new PoseRenderer(canvas, {
      camera: camera(canvas.clientWidth || 1, canvas.clientHeight || 1),
      idle,
      pointer: pointer && tierA,
      glow: tierA,
      grid,
      dprCap: tierA ? 2 : 1,
      sphereSegments: tierA ? 10 : 6,
      amplitude: tierA ? 1 : 0.5,
      markerScale,
    });
    rendererRef.current = renderer;
    onReady?.();

    // Push the GSAP-tweened value into the renderer once per frame.
    let syncRaf = 0;
    const sync = () => {
      renderer.setDistortion(distortionRef.current.distortion);
      syncRaf = requestAnimationFrame(sync);
    };

    // A hero still rendering while the user is at section 07 is wasted battery
    // and pure TBT. Gate on visibility, both kinds.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          renderer.start();
          if (!syncRaf) syncRaf = requestAnimationFrame(sync);
        } else {
          renderer.stop();
          if (syncRaf) cancelAnimationFrame(syncRaf);
          syncRaf = 0;
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        renderer.stop();
      } else {
        renderer.start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      renderer.setCamera(
        camera(canvas.clientWidth || 1, canvas.clientHeight || 1),
      );
      renderer.resize();
    });
    ro.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      renderer.setPointer(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        ((e.clientY - r.top) / r.height) * 2 - 1,
      );
    };
    if (pointer && tierA) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      if (syncRaf) cancelAnimationFrame(syncRaf);
      renderer.dispose();
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
