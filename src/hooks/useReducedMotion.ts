"use client";

import { useSyncExternalStore } from "react";
import {
  subscribeReducedMotion,
  getReducedMotion,
  getServerReducedMotion,
} from "@/lib/motionPreference";

/**
 * `useSyncExternalStore` rather than useState + useEffect: it gives a correct
 * SSR snapshot with no hydration mismatch, and toggling the OS setting at
 * runtime propagates with no extra wiring.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
}
