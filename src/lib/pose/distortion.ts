import { J, JOINT_COUNT, LEFT_LEG, RIGHT_LEG } from "./poseData";

/**
 * The actual research finding, as a single scalar morph.
 *
 * SAM 3D Body's hip keypoints are a fixed, activity-independent distortion of
 * true pelvis geometry: hip width compressed to ~44% of anatomical width, and
 * the mediolateral axis misoriented by ~106°. Because every hip/knee/ankle
 * flexion angle is projected onto a frame built from that hip-to-hip vector,
 * this one defect corrupted all of them while the joint positions themselves
 * were largely fine.
 */
export const DISTORTED_HIP_SCALE = 0.44;
export const PELVIS_ML_YAW = (106 * Math.PI) / 180;

/**
 * Applies the distortion in place. `d` is 0 (Vicon reference) → 1 (raw
 * markerless estimate).
 *
 * The hips carry their descendant leg chains. Moving the hip joints alone
 * detaches the legs and reads as a rendering bug rather than as a finding.
 */
export function applyDistortion(pose: Float32Array, d: number, timeSec = 0) {
  if (d <= 0) return;

  const cx = (pose[J.leftHip * 3] + pose[J.rightHip * 3]) / 2;
  const cz = (pose[J.leftHip * 3 + 2] + pose[J.rightHip * 3 + 2]) / 2;

  const scale = 1 + (DISTORTED_HIP_SCALE - 1) * d;
  const yaw = PELVIS_ML_YAW * d;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);

  const chains = [
    [J.leftHip, LEFT_LEG],
    [J.rightHip, RIGHT_LEG],
  ] as const;

  for (const [hip, chain] of chains) {
    const dx = (pose[hip * 3] - cx) * scale;
    const dz = (pose[hip * 3 + 2] - cz) * scale;
    const nx = cx + dx * c - dz * s;
    const nz = cz + dx * s + dz * c;

    const shiftX = nx - pose[hip * 3];
    const shiftZ = nz - pose[hip * 3 + 2];

    for (const j of chain) {
      pose[j * 3] += shiftX;
      pose[j * 3 + 2] += shiftZ;
    }
  }

  // Markerless output is noisy. The jitter sells the story more than the
  // geometry does, and it scales with d so the clean pose stays perfectly still.
  if (d > 0.02) {
    for (let i = 0; i < JOINT_COUNT; i++) {
      const n = Math.sin(timeSec * 7.3 + i * 12.9898) * 0.005 * d;
      const m = Math.cos(timeSec * 6.1 + i * 78.233) * 0.005 * d;
      pose[i * 3] += n;
      pose[i * 3 + 1] += m * 0.6;
    }
  }
}

/** Current hip width as a fraction of anatomical width, for the live caption. */
export function hipWidthFraction(d: number): number {
  return 1 + (DISTORTED_HIP_SCALE - 1) * Math.min(Math.max(d, 0), 1);
}
