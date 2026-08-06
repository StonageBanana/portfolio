"use client";

import { useSyncExternalStore } from "react";

const stores = new Map<
  string,
  { subscribe: (cb: () => void) => () => void; get: () => boolean }
>();

function storeFor(query: string) {
  let s = stores.get(query);
  if (s) return s;

  const mql =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query)
      : null;

  s = {
    subscribe: (cb) => {
      if (!mql) return () => {};
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    get: () => mql?.matches ?? false,
  };
  stores.set(query, s);
  return s;
}

/** Cached per query so repeated calls share one MediaQueryList. */
export function useMediaQuery(query: string): boolean {
  const s = storeFor(query);
  // Server snapshot is always false — the rail mounts after hydration.
  return useSyncExternalStore(s.subscribe, s.get, () => false);
}
