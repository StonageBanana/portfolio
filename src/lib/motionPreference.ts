/**
 * Non-React source of truth for `prefers-reduced-motion`.
 *
 * It has to live outside React because GSAP and PoseRenderer both need to read
 * and subscribe to it, and neither is inside the component tree.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

const mql =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(QUERY)
    : null;

export const getReducedMotion = () => mql?.matches ?? false;

/** SSR snapshot. Must be a stable value or useSyncExternalStore will loop. */
export const getServerReducedMotion = () => false;

export function subscribeReducedMotion(cb: () => void) {
  if (!mql) return () => {};
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}
