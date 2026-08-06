import type { CameraSpec } from "./camera";
import { EDGES, JOINT_COUNT, REST_POSE } from "./poseData";
import { applyDistortion } from "./distortion";
import { applyIdle } from "./walkCycle";
import { projectPose, createProjected } from "./projectPose";

/**
 * Screen-space skeleton geometry. One function, four jobs: the preloader, the
 * reduced-motion static hero, the mobile/Tier-C poster, and the headshot
 * fallback silhouette. That reuse is why none of those needed a hand-drawn asset.
 */

export interface SvgBone {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Segment length, so the preloader can set stroke-dasharray/offset. */
  length: number;
}

export interface SvgSkeleton {
  width: number;
  height: number;
  joints: { x: number; y: number; r: number }[];
  bones: SvgBone[];
}

export interface SkeletonOptions {
  distortion?: number;
  /** Seconds — drives the idle. 0 gives a perfectly still pose. */
  time?: number;
  /** Idle amplitude. 0 for static renders. */
  amplitude?: number;
  /** Base marker radius in px at 1 m depth. */
  markerRadius?: number;
}

const scratchPose = new Float32Array(JOINT_COUNT * 3);
const scratchProjected = createProjected(JOINT_COUNT);

export function buildSkeleton(
  cam: CameraSpec,
  width: number,
  height: number,
  opts: SkeletonOptions = {},
): SvgSkeleton {
  const {
    distortion = 0,
    time = 0,
    amplitude = 0,
    markerRadius = 5.2,
  } = opts;

  applyIdle(scratchPose, REST_POSE, time, amplitude);
  applyDistortion(scratchPose, distortion, time);

  const p = projectPose(scratchPose, cam, width, height, scratchProjected);

  // Reference depth so marker size is stable across camera specs.
  const refDepth = cam.eye[2] - cam.target[2] || 3;

  const joints = [];
  for (let i = 0; i < JOINT_COUNT; i++) {
    joints.push({
      x: round(p.xy[i * 2]),
      y: round(p.xy[i * 2 + 1]),
      r: round(markerRadius * (refDepth / p.depth[i])),
    });
  }

  const bones: SvgBone[] = EDGES.map(([a, b]) => {
    const x1 = round(p.xy[a * 2]);
    const y1 = round(p.xy[a * 2 + 1]);
    const x2 = round(p.xy[b * 2]);
    const y2 = round(p.xy[b * 2 + 1]);
    return { x1, y1, x2, y2, length: round(Math.hypot(x2 - x1, y2 - y1)) };
  });

  return { width, height, joints, bones };
}

function round(v: number) {
  return Math.round(v * 100) / 100;
}

/** Ground plane, just below the ankles. */
export const GRID_Y = -0.9;
const GRID_HALF = 3.2;
const GRID_STEP = 0.4;

/**
 * Calibration grid as WORLD-space line segments, so the SVG poster and the
 * WebGL renderer draw the same grid through the same projection. A screen-space
 * grid would visibly jump at the moment the WebGL canvas replaces the poster.
 *
 * Built once and cached — the geometry never changes.
 */
let gridCache: Float32Array | null = null;

export function buildWorldGrid(): Float32Array {
  if (gridCache) return gridCache;

  const pts: number[] = [];
  for (let v = -GRID_HALF; v <= GRID_HALF + 1e-6; v += GRID_STEP) {
    // Lines parallel to Z
    pts.push(v, GRID_Y, -GRID_HALF, v, GRID_Y, GRID_HALF);
    // Lines parallel to X
    pts.push(-GRID_HALF, GRID_Y, v, GRID_HALF, GRID_Y, v);
  }
  gridCache = new Float32Array(pts);
  return gridCache;
}

export interface ProjectedGridLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** 0..1 — fades with distance so the grid recedes rather than ending hard. */
  fade: number;
}

export function projectGrid(
  cam: CameraSpec,
  width: number,
  height: number,
): ProjectedGridLine[] {
  const raw = buildWorldGrid();
  const p = projectPose(raw, cam, width, height, createProjected(raw.length / 3));

  const lines: ProjectedGridLine[] = [];
  for (let i = 0; i < raw.length / 3; i += 2) {
    const d = (p.depth[i] + p.depth[i + 1]) / 2;
    lines.push({
      x1: round(p.xy[i * 2]),
      y1: round(p.xy[i * 2 + 1]),
      x2: round(p.xy[(i + 1) * 2]),
      y2: round(p.xy[(i + 1) * 2 + 1]),
      fade: round(Math.max(0, Math.min(1, 1 - (d - 2) / 6))),
    });
  }
  return lines;
}
