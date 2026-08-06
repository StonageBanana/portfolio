/**
 * COCO-17 keypoints — deliberately not an arbitrary skeleton. COCO-17 is the
 * output topology of markerless pose estimators (OpenPose, MediaPipe, MMPose),
 * which is what makes the Vicon-vs-markerless narrative on this page literally
 * true rather than decorative.
 *
 * No three.js import. Nothing in this directory except PoseRenderer.ts touches
 * three, which is what lets the SVG poster, the preloader and the portrait
 * fallback all derive from this one source.
 */

export const JOINTS = [
  "nose",
  "leftEye",
  "rightEye",
  "leftEar",
  "rightEar",
  "leftShoulder",
  "rightShoulder",
  "leftElbow",
  "rightElbow",
  "leftWrist",
  "rightWrist",
  "leftHip",
  "rightHip",
  "leftKnee",
  "rightKnee",
  "leftAnkle",
  "rightAnkle",
] as const;

export type JointName = (typeof JOINTS)[number];
export const JOINT_COUNT = JOINTS.length;

export const J = Object.fromEntries(
  JOINTS.map((n, i) => [n, i]),
) as Record<JointName, number>;

/** Bone edges as [a, b] index pairs. */
export const EDGES: ReadonlyArray<readonly [number, number]> = [
  [J.leftShoulder, J.rightShoulder], // clavicle bar
  [J.leftShoulder, J.leftElbow],
  [J.leftElbow, J.leftWrist],
  [J.rightShoulder, J.rightElbow],
  [J.rightElbow, J.rightWrist],
  [J.leftShoulder, J.leftHip], // torso sides
  [J.rightShoulder, J.rightHip],
  [J.leftHip, J.rightHip], // pelvis bar — the one that gets distorted
  [J.leftHip, J.leftKnee],
  [J.leftKnee, J.leftAnkle],
  [J.rightHip, J.rightKnee],
  [J.rightKnee, J.rightAnkle],
  [J.nose, J.leftEye],
  [J.nose, J.rightEye],
  [J.leftEye, J.leftEar],
  [J.rightEye, J.rightEar],
  [J.leftEar, J.leftShoulder], // neck proxy
  [J.rightEar, J.rightShoulder],
];

/**
 * Draw order for the preloader — the skeleton assembles outward from the
 * pelvis along the kinematic chain rather than in arbitrary array order.
 */
export const DRAW_ORDER: number[] = [
  7, // pelvis bar
  5,
  6, // torso sides
  0, // clavicle bar
  8,
  10, // thighs
  9,
  11, // shanks
  16,
  17, // neck proxy
  1,
  3, // upper arms
  2,
  4, // forearms
  12,
  13, // nose → eyes
  14,
  15, // eyes → ears
];

/** Leg chains, used by the distortion so hips carry their descendants. */
export const LEFT_LEG = [J.leftHip, J.leftKnee, J.leftAnkle] as const;
export const RIGHT_LEG = [J.rightHip, J.rightKnee, J.rightAnkle] as const;

/**
 * Rest pose in metres. Y-up, origin at pelvis centre, +X = subject's left,
 * +Z = forward (toward camera). Roughly a 1.75 m standing adult.
 */
// prettier-ignore
export const REST_POSE = new Float32Array([
   0.000, 0.735, 0.075, // nose
   0.033, 0.766, 0.055, // leftEye
  -0.033, 0.766, 0.055, // rightEye
   0.072, 0.757, 0.008, // leftEar
  -0.072, 0.757, 0.008, // rightEar
   0.185, 0.585, 0.000, // leftShoulder
  -0.185, 0.585, 0.000, // rightShoulder
   0.225, 0.330, 0.010, // leftElbow
  -0.225, 0.330, 0.010, // rightElbow
   0.240, 0.080, 0.030, // leftWrist
  -0.240, 0.080, 0.030, // rightWrist
   0.090, 0.000, 0.000, // leftHip
  -0.090, 0.000, 0.000, // rightHip
   0.098,-0.430, 0.010, // leftKnee
  -0.098,-0.430, 0.010, // rightKnee
   0.100,-0.845, 0.000, // leftAnkle
  -0.100,-0.845, 0.000, // rightAnkle
]);

/** Ground-truth half hip width. The 44% figure is measured against this. */
export const HIP_HALF_WIDTH = 0.09;

/** Approximate standing height, used to frame the camera. */
export const POSE_HEIGHT = 1.75;
