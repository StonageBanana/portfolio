import { HeroPoseClient } from "./HeroPoseClient";

/**
 * Hero signature element.
 *
 * The client component picks a device tier and either mounts the WebGL
 * renderer (Tier A/B) or renders the static SVG poster (Tier C), then scrubs
 * the distortion morph from the hero's scroll position.
 */
export function HeroPose() {
  return <HeroPoseClient />;
}
