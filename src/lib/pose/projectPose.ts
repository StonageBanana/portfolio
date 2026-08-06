import type { CameraSpec } from "./camera";
import { JOINT_COUNT } from "./poseData";

/**
 * Perspective projection in pure TypeScript — deliberately NO three.js import,
 * so the SVG preloader can draw on the very first frame while the WebGL chunk
 * is still downloading.
 *
 * Mirrors three.js PerspectiveCamera exactly: `fov` is vertical, in degrees,
 * and the view is right-handed looking down -Z.
 */

export interface Projected {
  /** Screen-space x,y in CSS pixels, 2 floats per joint. */
  xy: Float32Array;
  /** View-space depth in metres, 1 per joint. Useful for size attenuation. */
  depth: Float32Array;
}

export function createProjected(count: number = JOINT_COUNT): Projected {
  return { xy: new Float32Array(count * 2), depth: new Float32Array(count) };
}

export function projectPose(
  pose: Float32Array,
  cam: CameraSpec,
  width: number,
  height: number,
  out: Projected = createProjected(pose.length / 3),
): Projected {
  const [ex, ey, ez] = cam.eye;
  const [tx, ty, tz] = cam.target;

  // Basis: forward = normalize(target - eye); right = normalize(forward x up).
  let fx = tx - ex;
  let fy = ty - ey;
  let fz = tz - ez;
  const fl = Math.hypot(fx, fy, fz) || 1;
  fx /= fl;
  fy /= fl;
  fz /= fl;

  // up = (0,1,0)  =>  right = forward x up
  let rx = fy * 0 - fz * 1;
  let ry = fz * 0 - fx * 0;
  let rz = fx * 1 - fy * 0;
  const rl = Math.hypot(rx, ry, rz) || 1;
  rx /= rl;
  ry /= rl;
  rz /= rl;

  // trueUp = right x forward
  const ux = ry * fz - rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy - ry * fx;

  const tanHalf = Math.tan(((cam.fov * Math.PI) / 180) / 2);
  const aspect = width / Math.max(height, 1);
  const n = pose.length / 3;

  for (let i = 0; i < n; i++) {
    const px = pose[i * 3] - ex;
    const py = pose[i * 3 + 1] - ey;
    const pz = pose[i * 3 + 2] - ez;

    const vx = px * rx + py * ry + pz * rz;
    const vy = px * ux + py * uy + pz * uz;
    const d = px * fx + py * fy + pz * fz; // positive in front of the camera

    const safe = d > 1e-4 ? d : 1e-4;
    const ndcX = vx / (safe * tanHalf * aspect);
    const ndcY = vy / (safe * tanHalf);

    out.xy[i * 2] = (ndcX * 0.5 + 0.5) * width;
    out.xy[i * 2 + 1] = (0.5 - ndcY * 0.5) * height;
    out.depth[i] = safe;
  }

  return out;
}
