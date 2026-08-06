# Simhadri Mohana Kushal — Portfolio

Single-page, motion-driven portfolio. Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis · Framer Motion · Three.js.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (Turbopack)
npm start
npm run lint
npm run audit:copy   # asserts every visitor-facing string is verbatim
```

Node ≥ 20.9 (developed on 26.5.1, npm 11.12.1).

If a terminal reports `node is not recognized`, that terminal was started before Node was added to PATH — environment variables are copied into a process at launch, so a long-running shell never picks up later changes. Open a new terminal rather than editing PATH.

---

## The one thing to understand first

`src/lib/pose/` is the spine. It contains **no React and no framework coupling**, and only `PoseRenderer.ts` imports three.js. One 17-joint COCO keypoint set feeds four different surfaces:

| Surface | Rendered as | Where |
|---|---|---|
| Hero signature element | WebGL | `components/three/HeroPoseClient.tsx` |
| Preloader skeleton | server-rendered SVG + CSS | `components/ui/Preloader.tsx` |
| Reduced-motion / low-end hero | static SVG | `components/three/PosePoster.tsx` |
| Headshot fallback silhouette | static SVG | `components/ui/AnnotatedPortrait.tsx` |

Because the SVG and WebGL paths are built from the **same camera spec** (`lib/pose/camera.ts`) and the same pure-TypeScript projection (`lib/pose/projectPose.ts`), they land on identical screen pixels by construction — no measuring, and the preloader can draw before three.js has finished downloading.

`lib/pose/distortion.ts` encodes the actual research finding as a single `0 → 1` scalar: hips compressed to 44% of true width, pelvis mediolateral axis rotated 106°. GSAP scrubs that scalar; the render loop reads it. It is never React state.

---

## Content

**No visitor-readable string may live inside `src/components/`.** Everything is in `src/content/`, typed by `content/types.ts`, and components are dumb renderers. `content/site.ts` exports one ordered `sections` array that drives page composition, anchor ids, the nav and the rail — so they cannot desync.

`npm run audit:copy` fetches the rendered page and asserts 35 copy blocks and 9 links match the source brief exactly. Run it after touching anything under `src/content/`.

---

## Motion

- **One library per DOM node.** GSAP owns everything scroll-driven (`components/motion/PageMotion.tsx`). Framer Motion owns component-local enter/exit/layout — currently only the rail pill and the certificate lightbox. Both writing `transform` to one node produces bugs that look random.
- **Lenis drives ScrollTrigger** (`app/providers.tsx`). `autoRaf: false` is mandatory, and GSAP's ticker passes seconds while Lenis wants milliseconds.
- **All GSAP lives inside `gsap.matchMedia()`.** When the reduced-motion query starts matching, GSAP reverts every tween and trigger it created. A manual `if (reduced)` leaves orphaned triggers and half-applied inline styles when the user toggles the OS setting mid-session.
- Section headings split with `type: "words,chars"`, never `"chars"` alone — bare characters let a line break fall mid-word.
- The hero's CTAs, social icons and permit line animate **on load, not on a ScrollTrigger**. They sit below the `top 75%` line on a laptop viewport, so a scroll trigger would leave them invisible exactly when they matter most.

### Reduced motion — one source of truth, five consumers

`lib/motionPreference.ts` is a non-React `matchMedia` store (GSAP and `PoseRenderer` both live outside React). `hooks/useReducedMotion.ts` reads it via `useSyncExternalStore`, which gives a correct SSR snapshot and propagates runtime OS changes for free.

Consumers: Framer (`MotionConfig reducedMotion="user"`), GSAP (`matchMedia`), `PoseRenderer` (stops the RAF loop outright), Lenis (`lerp: 1`), and a CSS `@media` block for everything else. The preloader is skipped entirely.

---

## Performance

The lever is not shrinking three.js — it's not shipping it. Three device tiers (`hooks/useDeviceTier.ts`):

- **A** — full WebGL: glow, idle, pointer tracking, DPR 2
- **B** — WebGL survives but stripped: DPR 1, no halo, no pointer, half amplitude. The scrub morph is kept; it's the narrative, not decoration.
- **C** — static SVG poster. The three.js chunk is never requested.

Measured on the production build:

```
initial JS (gzip)                             ~254 KB
three.js       (lazy; tier C never fetches)    130 KB
framer-motion  (lazy; < md never fetches)       41 KB
```

The hero renders in **4 draw calls** — InstancedMesh markers, an additive `Points` halo (glow without bloom, its texture generated on a canvas at runtime so it costs zero network bytes), `LineSegments` bones, and a static grid. `UnrealBloomPass` for 17 points would mean a mip chain of full-screen passes for no visible gain.

Preloader: server-rendered SVG driven by CSS keyframes, so it is in the **first paint** rather than waiting on hydration. An earlier client-component version could not mount until ~1.34s on a production build — over a second of black screen against a 1.2s budget. Measured now: visible at ~2ms, cleared at ~1.2s.

---

## Assets — none are required

No headshot, certificate scans or CV are checked in, and nothing renders broken without them. `lib/assets.server.ts` (`import "server-only"`) checks existence on the **build machine**; only booleans cross into the client payload.

Drop a file into `public/` and redeploy — **no code change**:

```
public/headshot.jpg
public/cv.pdf
public/certificates/aws_cloud_practitioner.jpg
public/certificates/smartbridge_externship.jpg
public/certificates/leaps_analyttica.jpg
public/certificates/nasscom_futureskills.jpg
public/certificates/kaggle_python.jpg
```

Until then: the portrait frame holds a pose-skeleton silhouette under the same corner ticks and `conf 0.98` chip; certificates show a hatch pattern and a `no scan on file` chip; the CV button becomes "Request CV" opening a prefilled mailto rather than a dead disabled button. Adding a certificate scan also activates its lightbox, which is otherwise never instantiated.

---

## Contact form

Web3Forms. The access key is **public by design** — an alias for the destination address, not a credential — so the site stays fully static, needs no route handler, and has no code path that can fail the build when the key is absent.

```bash
cp .env.example .env.local
# NEXT_PUBLIC_WEB3FORMS_KEY=...   free key from https://web3forms.com
```

Without a key the form still renders and validates; it reports the `unconfigured` state and the permanent "email me directly" link carries the visitor through.

---

## Deploying

Push to a repo and import into Vercel. Set `NEXT_PUBLIC_SITE_URL` to the real domain (metadata, `robots.txt` and `sitemap.xml` derive from it) and `NEXT_PUBLIC_WEB3FORMS_KEY`.

Do not add a custom webpack config — Turbopack is the default builder in Next 16 and will hard-fail. `@tailwindcss/oxide` is a native binary resolved through `optionalDependencies`, so never install with `--no-optional` and never commit a lockfile generated on a different OS.
