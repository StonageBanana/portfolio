import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import type { CameraSpec } from "./camera";
import { EDGES, JOINT_COUNT, REST_POSE } from "./poseData";
import { applyIdle } from "./walkCycle";
import { applyDistortion } from "./distortion";
import { buildWorldGrid } from "./poseToSvg";
import {
  getReducedMotion,
  subscribeReducedMotion,
} from "@/lib/motionPreference";

/**
 * The only file in the project that imports three.js.
 *
 * That containment is deliberate: it keeps three out of every other module's
 * graph, and it means swapping to a lighter WebGL library later touches exactly
 * one file.
 *
 * Draw calls, total four — no render targets, no EffectComposer, no
 * postprocessing import:
 *   1. InstancedMesh  — 17 marker spheres
 *   2. Points         — additive halo sprites (glow without bloom)
 *   3. LineSegments   — bones, rewritten each frame
 *   4. LineSegments   — calibration grid, built once and never touched
 *
 * UnrealBloomPass for 17 points would mean a mip chain of full-screen passes —
 * pure fill-rate cost on a mobile GPU for something an additive sprite does
 * better and cheaper.
 */

export interface PoseRendererOptions {
  camera: CameraSpec;
  idle: boolean;
  pointer: boolean;
  glow: boolean;
  grid: boolean;
  /** Device-pixel-ratio ceiling. 2 desktop · 1.5 mid · 1 low. */
  dprCap: number;
  sphereSegments: number;
  /** Idle amplitude multiplier — 0.5 on constrained devices. */
  amplitude: number;
  markerScale: number;
}

const MAX_YAW = 0.38; // ~22°
const MAX_PITCH = 0.2;

export class PoseRenderer {
  private canvas: HTMLCanvasElement;
  private opts: PoseRendererOptions;

  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private root: Group;

  private markers: InstancedMesh;
  private halo: Points | null = null;
  private bones: LineSegments;
  private grid: LineSegments | null = null;

  private pose = new Float32Array(JOINT_COUNT * 3);
  private bonePositions: Float32Array;
  private haloPositions: Float32Array | null = null;
  private matrix = new Matrix4();

  private distortion = 0;
  private pointerTarget = { x: 0, y: 0 };
  private pointerCurrent = { x: 0, y: 0 };

  private raf = 0;
  private running = false;
  private startTime = 0;
  private disposed = false;
  private unsubscribeMotion: () => void;

  constructor(canvas: HTMLCanvasElement, opts: PoseRendererOptions) {
    this.canvas = canvas;
    this.opts = opts;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: opts.dprCap > 1,
      alpha: true,
      powerPreference: "low-power",
    });
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new Scene();
    this.root = new Group();
    this.scene.add(this.root);

    this.camera = new PerspectiveCamera(opts.camera.fov, 1, 0.1, 100);
    this.applyCamera(opts.camera);

    const marker = readCssColor("--marker", 0x3ce0d0);
    const line = readCssColor("--line", 0x232833);

    // 1 — marker spheres, one draw call for all 17.
    this.markers = new InstancedMesh(
      new SphereGeometry(0.022, opts.sphereSegments, opts.sphereSegments),
      new MeshBasicMaterial({ color: marker }),
      JOINT_COUNT,
    );
    this.markers.frustumCulled = false;
    this.root.add(this.markers);

    // 2 — additive halo. Texture generated on a canvas: zero network bytes.
    if (opts.glow) {
      this.haloPositions = new Float32Array(JOINT_COUNT * 3);
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(this.haloPositions, 3));
      this.halo = new Points(
        g,
        new PointsMaterial({
          size: 0.19 * opts.markerScale,
          map: radialSprite(),
          color: marker,
          transparent: true,
          opacity: 0.5,
          blending: AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      );
      this.halo.frustumCulled = false;
      this.root.add(this.halo);
    }

    // 3 — bones.
    this.bonePositions = new Float32Array(EDGES.length * 2 * 3);
    const boneGeo = new BufferGeometry();
    boneGeo.setAttribute("position", new BufferAttribute(this.bonePositions, 3));
    this.bones = new LineSegments(
      boneGeo,
      new LineBasicMaterial({ color: marker, transparent: true, opacity: 0.65 }),
    );
    this.bones.frustumCulled = false;
    this.root.add(this.bones);

    // 4 — grid. Static geometry, written once.
    if (opts.grid) {
      const gridGeo = new BufferGeometry();
      gridGeo.setAttribute(
        "position",
        new BufferAttribute(buildWorldGrid().slice(), 3),
      );
      this.grid = new LineSegments(
        gridGeo,
        new LineBasicMaterial({ color: line, transparent: true, opacity: 0.5 }),
      );
      this.grid.frustumCulled = false;
      this.scene.add(this.grid);
    }

    this.resize();
    this.writeFrame(0);

    // The renderer owns its own reduced-motion response — it lives outside
    // React, so it subscribes to the same non-React store the hooks read.
    this.unsubscribeMotion = subscribeReducedMotion(() =>
      this.applyMotionPreference(),
    );
    this.applyMotionPreference();
  }

  // ---- public API -------------------------------------------------------

  setCamera(spec: CameraSpec) {
    this.opts.camera = spec;
    this.applyCamera(spec);
    if (!this.running) this.renderOnce();
  }

  setDistortion(v: number) {
    this.distortion = Math.min(Math.max(v, 0), 1);
    if (!this.running) this.renderOnce();
  }

  /** Normalised −1..1. Damped internally; never routed through React state. */
  setPointer(nx: number, ny: number) {
    if (!this.opts.pointer) return;
    this.pointerTarget.x = Math.max(-1, Math.min(1, nx));
    this.pointerTarget.y = Math.max(-1, Math.min(1, ny));
  }

  start() {
    if (this.running || this.disposed || getReducedMotion()) return;
    this.running = true;
    this.startTime = performance.now();
    const loop = () => {
      if (!this.running) return;
      this.writeFrame((performance.now() - this.startTime) / 1000);
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /** Single frame, then nothing. Used for the reduced-motion static render. */
  renderOnce() {
    if (this.disposed) return;
    this.writeFrame(0);
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.dprCap);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.renderOnce();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.unsubscribeMotion();

    this.markers.geometry.dispose();
    (this.markers.material as MeshBasicMaterial).dispose();
    this.bones.geometry.dispose();
    (this.bones.material as LineBasicMaterial).dispose();
    if (this.halo) {
      this.halo.geometry.dispose();
      const m = this.halo.material as PointsMaterial;
      m.map?.dispose();
      m.dispose();
    }
    if (this.grid) {
      this.grid.geometry.dispose();
      (this.grid.material as LineBasicMaterial).dispose();
    }
    this.renderer.dispose();
  }

  // ---- internals --------------------------------------------------------

  private applyCamera(spec: CameraSpec) {
    this.camera.fov = spec.fov;
    this.camera.position.set(...spec.eye);
    this.camera.lookAt(...spec.target);
    this.camera.updateProjectionMatrix();
  }

  private applyMotionPreference() {
    if (getReducedMotion()) {
      this.stop();
      this.distortion = 0;
      this.pointerTarget = { x: 0, y: 0 };
      this.pointerCurrent = { x: 0, y: 0 };
      this.root.rotation.set(0, 0, 0);
      this.renderOnce();
    } else {
      this.start();
    }
  }

  private writeFrame(t: number) {
    const amp = this.opts.idle ? this.opts.amplitude : 0;
    applyIdle(this.pose, REST_POSE, t, amp);
    applyDistortion(this.pose, this.distortion, t);

    // Damped pointer follow — reads as attention, not as spinning.
    if (this.opts.pointer) {
      const k = 0.06;
      this.pointerCurrent.x +=
        (this.pointerTarget.x - this.pointerCurrent.x) * k;
      this.pointerCurrent.y +=
        (this.pointerTarget.y - this.pointerCurrent.y) * k;
      this.root.rotation.y = this.pointerCurrent.x * MAX_YAW;
      this.root.rotation.x = -this.pointerCurrent.y * MAX_PITCH;
    }

    // Markers: write 17 matrices into the instance buffer. makeScale then
    // setPosition avoids allocating a Vector3 per joint per frame.
    const s = this.opts.markerScale;
    for (let i = 0; i < JOINT_COUNT; i++) {
      this.matrix.makeScale(s, s, s);
      this.matrix.setPosition(
        this.pose[i * 3],
        this.pose[i * 3 + 1],
        this.pose[i * 3 + 2],
      );
      this.markers.setMatrixAt(i, this.matrix);
    }
    this.markers.instanceMatrix.needsUpdate = true;

    if (this.haloPositions && this.halo) {
      this.haloPositions.set(this.pose);
      (
        this.halo.geometry.getAttribute("position") as BufferAttribute
      ).needsUpdate = true;
    }

    // Bones: two endpoints per edge.
    for (let e = 0; e < EDGES.length; e++) {
      const [a, b] = EDGES[e];
      const o = e * 6;
      this.bonePositions[o] = this.pose[a * 3];
      this.bonePositions[o + 1] = this.pose[a * 3 + 1];
      this.bonePositions[o + 2] = this.pose[a * 3 + 2];
      this.bonePositions[o + 3] = this.pose[b * 3];
      this.bonePositions[o + 4] = this.pose[b * 3 + 1];
      this.bonePositions[o + 5] = this.pose[b * 3 + 2];
    }
    (
      this.bones.geometry.getAttribute("position") as BufferAttribute
    ).needsUpdate = true;
  }
}

/** Reads a palette value out of CSS so three and Tailwind share one source. */
function readCssColor(varName: string, fallback: number): Color {
  if (typeof window === "undefined") return new Color(fallback);
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return v ? new Color(v) : new Color(fallback);
}

/** 64x64 radial gradient built at runtime — no network request, no asset. */
function radialSprite(): CanvasTexture {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(c);
}
