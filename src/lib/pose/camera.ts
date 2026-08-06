/**
 * One camera definition, consumed by BOTH renderers:
 *   - `projectPose.ts` (pure TS, drives the SVG preloader / poster / fallback)
 *   - `PoseRenderer.ts` (three.js PerspectiveCamera)
 *
 * Because both are constructed from this same spec, the SVG joints and the
 * WebGL joints land on identical screen pixels *by construction* — no
 * measuring, no getBoundingClientRect, and no need for three.js to have loaded
 * before the preloader can draw. That is what makes the preloader handoff work.
 */

export interface CameraSpec {
  /** Camera position in world metres. */
  eye: [number, number, number];
  /** Look-at target in world metres. */
  target: [number, number, number];
  /** Vertical field of view in DEGREES — matches three.js PerspectiveCamera. */
  fov: number;
}

/**
 * Panning eye and target together shifts the subject on screen without any
 * change of perspective, so responsive framing stays a pure camera concern
 * rather than something each renderer re-implements.
 */
function pan(spec: CameraSpec, dx: number, dy: number): CameraSpec {
  return {
    ...spec,
    eye: [spec.eye[0] + dx, spec.eye[1] + dy, spec.eye[2]],
    target: [spec.target[0] + dx, spec.target[1] + dy, spec.target[2]],
  };
}

const BASE: CameraSpec = {
  eye: [0, 0.02, 4.0],
  target: [0, -0.02, 0],
  fov: 32,
};

/**
 * Hero framing. On wide viewports the copy occupies the left columns, so the
 * subject is panned right; on narrow ones it centres and sits behind the text.
 *
 * Panning is expressed in world metres and scales with distance, so the
 * on-screen offset stays constant as the camera pulls back for taller viewports.
 */
export function getHeroCamera(width: number, height: number): CameraSpec {
  const aspect = width / Math.max(height, 1);

  if (width >= 1024) {
    // Subject sits right of centre; the copy owns the left columns. The pan
    // coefficient is tied to BASE's distance — pulling the camera in magnifies
    // a world-space pan on screen, so the two must move together.
    return pan(BASE, -0.58 * Math.min(aspect / 1.78, 1.15), 0.04);
  }
  if (width >= 640) {
    return pan(BASE, -0.24, 0.03);
  }
  // Portrait: centred and pulled back so the full figure sits behind the copy
  // without crowding it.
  return { eye: [0, 0.02, 5.9], target: [0, -0.02, 0], fov: 32 };
}

/** Tighter, centred framing for the inline instance in project card 01. */
export function getInlineCamera(): CameraSpec {
  return { eye: [0, -0.02, 2.75], target: [0, -0.02, 0], fov: 34 };
}

/** Centred portrait framing for the headshot fallback silhouette. */
export function getPortraitCamera(): CameraSpec {
  // Far enough back that the figure clears the frame edge — at 2.55 the feet
  // and head touched the bounding box and it read as a crop, not a detection.
  return { eye: [0, -0.02, 3.25], target: [0, -0.02, 0], fov: 38 };
}
