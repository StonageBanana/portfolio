"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Three tiers. The point of tiering is not to shrink three.js — it's to avoid
 * shipping it at all on the devices whose Lighthouse score we're defending.
 *
 *  A — full WebGL: glow, idle, pointer tracking, DPR 2
 *  B — WebGL survives, but stripped: DPR 1, no halo, no pointer, half amplitude.
 *      The scrub morph is KEPT — it's the narrative, not decoration.
 *  C — static SVG poster. The three.js chunk is never requested.
 */
export type DeviceTier = "A" | "B" | "C";

interface NavigatorExt extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

let cached: DeviceTier | null = null;

function detect(): DeviceTier {
  if (typeof window === "undefined") return "C";
  if (cached) return cached;

  const nav = navigator as NavigatorExt;
  let tier: DeviceTier;

  if (nav.connection?.saveData || !hasWebGL()) {
    tier = "C";
  } else {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const memory = nav.deviceMemory ?? 8;
    tier = fine && memory >= 4 ? "A" : "B";
  }

  cached = tier;
  return tier;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Device capability doesn't change within a session, so there is nothing to
// subscribe to. useSyncExternalStore is still the right primitive: it reads the
// client value on mount without a setState-in-effect cascade, and gives a
// stable SSR snapshot so hydration matches.
const subscribe = () => () => {};
const getSnapshot = () => detect();
const getServerSnapshot = (): DeviceTier => "C";

export function useDeviceTier(): DeviceTier {
  const reduced = useReducedMotion();
  const tier = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return reduced ? "C" : tier;
}
