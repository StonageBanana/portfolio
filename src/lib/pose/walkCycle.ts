import { J, JOINT_COUNT } from "./poseData";

/**
 * Procedural idle, not baked keyframes. ~40 lines instead of 3,060 authored
 * floats, it loops with no seam, and — the reason that matters — amplitude is a
 * single scalar, so reduced motion is `amp = 0` and mobile is `amp *= 0.5`.
 *
 * This is a weight-shift-and-breathe idle rather than a full gait cycle. It
 * reads as "live capture" and avoids the uncanny valley a half-tuned walk lands
 * in. The signature moment on this page is the distortion morph, not the walk.
 */
export const GAIT_HZ = 0.28;

export function applyIdle(
  out: Float32Array,
  rest: Float32Array,
  t: number,
  amp = 1,
) {
  out.set(rest);
  if (amp <= 0) return;

  const p = t * Math.PI * 2 * GAIT_HZ;

  // Weight shifts side to side; the pelvis leads and the torso counter-rotates.
  const shift = Math.sin(p) * 0.028 * amp;
  const counter = Math.sin(p) * 0.014 * amp;

  for (let i = 0; i < JOINT_COUNT; i++) {
    // Higher joints lag the pelvis slightly — that delay is what reads as mass.
    const h = (rest[i * 3 + 1] + 0.9) / 1.7;
    out[i * 3] += shift * (1 - h * 0.45);
  }

  offsetX(out, J.leftShoulder, -counter);
  offsetX(out, J.rightShoulder, -counter);
  offsetX(out, J.nose, -counter * 1.3);
  offsetX(out, J.leftEye, -counter * 1.3);
  offsetX(out, J.rightEye, -counter * 1.3);
  offsetX(out, J.leftEar, -counter * 1.3);
  offsetX(out, J.rightEar, -counter * 1.3);

  // Arms swing gently out of phase with the weight shift.
  const swing = Math.sin(p - 0.6) * 0.022 * amp;
  offsetZ(out, J.leftWrist, swing);
  offsetZ(out, J.rightWrist, -swing);
  offsetZ(out, J.leftElbow, swing * 0.5);
  offsetZ(out, J.rightElbow, -swing * 0.5);

  // Vertical bob at 2x the base frequency — one rise per weight transfer.
  const bob = Math.sin(p * 2) * 0.012 * amp;
  for (let i = 0; i < JOINT_COUNT; i++) out[i * 3 + 1] += bob;

  // Breathing, chest only.
  const breath = Math.sin(t * 1.15) * 0.006 * amp;
  offsetY(out, J.leftShoulder, breath);
  offsetY(out, J.rightShoulder, breath);
}

function offsetX(a: Float32Array, j: number, v: number) {
  a[j * 3] += v;
}
function offsetY(a: Float32Array, j: number, v: number) {
  a[j * 3 + 1] += v;
}
function offsetZ(a: Float32Array, j: number, v: number) {
  a[j * 3 + 2] += v;
}
