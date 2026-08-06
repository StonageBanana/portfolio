"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/**
 * Navigation must go through Lenis. Calling scrollIntoView() while Lenis is
 * running produces a visible double-scroll fight.
 */
export function useLenisScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (id: string) => {
      const target = `#${id}`;
      if (lenis) lenis.scrollTo(target, { offset: -8 });
      else document.getElementById(id)?.scrollIntoView();
    },
    [lenis],
  );
}
