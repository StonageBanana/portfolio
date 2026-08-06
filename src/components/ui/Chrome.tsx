"use client";

import dynamic from "next/dynamic";
import { sectionIds, sections } from "@/content";
import { Nav } from "./Nav";
import { ScrollProgress } from "./ScrollProgress";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Cursor } from "./Cursor";
import { Magnetic } from "./Magnetic";
import { Grain } from "./Grain";
import { PageMotion } from "@/components/motion/PageMotion";
import { useActiveSection } from "@/hooks/useActiveSection";

/**
 * The section rail is the only consumer of Framer Motion on this site, and it
 * is hidden below `md`. Loading it behind both a dynamic import and a media
 * query means phones never download that chunk at all — the same "don't ship
 * it rather than shrink it" reasoning applied to the WebGL hero.
 */
const SectionRail = dynamic(
  () => import("./SectionRail").then((m) => m.SectionRail),
  { ssr: false },
);


/**
 * Owns the single active-section subscription and feeds both consumers of it.
 * Keeping it here means the nav underline and the rail pill can never disagree.
 */
export function Chrome() {
  const active = useActiveSection(sectionIds, sections[0].id);
  const wide = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Grain />
      <ScrollProgress />
      <Nav active={active} />
      {wide ? <SectionRail active={active} /> : null}
      <Cursor />
      <Magnetic />
      <PageMotion />
    </>
  );
}
