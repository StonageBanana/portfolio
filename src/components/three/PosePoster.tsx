import { buildSkeleton, projectGrid } from "@/lib/pose/poseToSvg";
import type { CameraSpec } from "@/lib/pose/camera";
import { cn } from "@/lib/cn";

/**
 * Static SVG skeleton. No WebGL, no three.js chunk, server-renderable.
 *
 * Serves as: the loading fallback for the dynamic WebGL import, the Tier-C
 * render on low-end/reduced-motion clients, and the silhouette inside the
 * headshot fallback frame. Uses a fixed logical viewBox so it can be rendered
 * on the server without knowing the viewport, then scales with CSS.
 */
export function PosePoster({
  camera,
  distortion = 0,
  width = 1200,
  height = 800,
  className,
  showGrid = true,
  markerRadius = 5.2,
  dimmed = false,
}: {
  camera: CameraSpec;
  distortion?: number;
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  markerRadius?: number;
  dimmed?: boolean;
}) {
  const skeleton = buildSkeleton(camera, width, height, {
    distortion,
    markerRadius,
  });
  const grid = showGrid ? projectGrid(camera, width, height) : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {grid ? (
        <g stroke="var(--line)" strokeWidth={1}>
          {grid.map((l, i) =>
            l.fade > 0.01 ? (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                opacity={l.fade * (dimmed ? 0.35 : 0.6)}
              />
            ) : null,
          )}
        </g>
      ) : null}

      <g
        stroke="var(--marker)"
        strokeWidth={1.25}
        strokeLinecap="round"
        opacity={dimmed ? 0.5 : 0.75}
      >
        {skeleton.bones.map((b, i) => (
          <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} />
        ))}
      </g>

      <g fill="var(--marker)">
        {skeleton.joints.map((j, i) => (
          <circle key={i} cx={j.x} cy={j.y} r={j.r} opacity={0.9} />
        ))}
      </g>
    </svg>
  );
}
