/**
 * Animated grain + vignette.
 *
 * An inline SVG feTurbulence tile as a data URI — no JS canvas loop, no network
 * request. The overlay is oversized by one tile and shifted with translate3d in
 * discrete steps(), so it is transform-only and GPU-composited with zero repaint.
 *
 * Deliberately NO mix-blend-mode: a full-screen blend layer is one of the most
 * reliable ways to lose 5–10 points of mobile Lighthouse, and at 3–4% opacity
 * it buys almost nothing visually.
 */
const NOISE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="140" height="140" filter="url(#n)" opacity="0.55"/></svg>`,
)}`;

export function Grain() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55] opacity-[0.035] motion-safe:animate-[grain_1.2s_steps(8)_infinite]"
        style={{
          backgroundImage: `url("${NOISE}")`,
          backgroundRepeat: "repeat",
          width: "calc(100% + 140px)",
          height: "calc(100% + 140px)",
          left: "-70px",
          top: "-70px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[54]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  );
}
