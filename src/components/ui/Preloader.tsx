import { buildSkeleton } from "@/lib/pose/poseToSvg";
import { getHeroCamera } from "@/lib/pose/camera";
import { DRAW_ORDER, EDGES } from "@/lib/pose/poseData";

/**
 * A wireframe skeleton draws itself joint-by-joint, then the joints scatter
 * into the hero point cloud.
 *
 * This is a SERVER component animated entirely in CSS, deliberately. The first
 * version was a client component behind next/dynamic, and it could not mount
 * until hydration finished — measured at ~1.34s on a production build, i.e.
 * over a second of black screen before the skeleton even began drawing, when
 * the whole budget is 1.2s. Server-rendering the SVG and driving it with CSS
 * keyframes puts it in the very first paint and takes React off the critical
 * path completely. It also deletes a client chunk.
 *
 * Coordinates come from the same camera spec the WebGL hero is built from, so
 * the two renderings sit on top of each other and the cross-fade reads as one
 * continuous motion. Two framings are emitted and CSS-swapped, because the
 * server cannot know the viewport and a desktop pan would throw the figure off
 * screen on a phone.
 *
 * Visibility is owned by CSS: the pre-paint script in layout.tsx sets
 * data-preload to "run" or "skip", so a repeat visit or reduced-motion never
 * paints this at all.
 */
export function Preloader() {
  return (
    <div id="preloader" aria-hidden="true">
      <div className="preloader-frame preloader-wide">
        <Skeleton width={1600} height={900} />
      </div>
      <div className="preloader-frame preloader-narrow">
        <Skeleton width={420} height={900} />
      </div>
    </div>
  );
}

function Skeleton({ width, height }: { width: number; height: number }) {
  const camera = getHeroCamera(width, height);
  const { bones, joints } = buildSkeleton(camera, width, height, {
    markerRadius: 4.4,
  });

  // Bones animate in kinematic-chain order (pelvis outward), not array order.
  const drawIndex = new Map<number, number>();
  DRAW_ORDER.forEach((boneIdx, order) => drawIndex.set(boneIdx, order));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <g stroke="var(--marker)" strokeWidth={1.4} strokeLinecap="round">
        {bones.map((b, i) => (
          <line
            key={i}
            className="preloader-bone"
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            style={{
              strokeDasharray: b.length,
              strokeDashoffset: b.length,
              animationDelay: `${(drawIndex.get(i) ?? i) * 0.016}s`,
            }}
          />
        ))}
      </g>
      <g fill="var(--marker)">
        {joints.map((j, i) => (
          <circle
            key={i}
            className="preloader-joint"
            cx={j.x}
            cy={j.y}
            r={j.r}
            style={{
              transformOrigin: `${j.x}px ${j.y}px`,
              animationDelay: `${0.1 + i * 0.012}s`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}

/** Kept so the edge count stays in sync if EDGES ever changes. */
export const PRELOADER_BONE_COUNT = EDGES.length;
