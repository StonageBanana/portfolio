import Image from "next/image";
import { AnnotatedFrame } from "./AnnotatedFrame";
import { PosePoster } from "@/components/three/PosePoster";
import { getPortraitCamera } from "@/lib/pose/camera";
import { about } from "@/content";

/**
 * The headshot, framed as a detection: hairline bounding box, corner ticks and
 * a confidence chip.
 *
 * With no image on file the interior holds a skeleton silhouette derived from
 * the same pose data the hero uses — an on-theme detection visualisation rather
 * than a placeholder. Dropping `public/headshot.jpg` swaps the fill; the frame,
 * ticks and chip are identical either way, so nothing structural changes.
 */
export function AnnotatedPortrait({ src }: { src: string | null }) {
  return (
    <AnnotatedFrame
      label={about.portrait.confidenceLabel}
      labelTone="signal"
      className="w-full"
      innerClassName="aspect-4/5"
    >
      {src ? (
        <Image
          src={src}
          alt={about.portrait.alt}
          fill
          sizes="(min-width: 1024px) 34vw, 90vw"
          className="object-cover"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0">
          <PosePoster
            camera={getPortraitCamera()}
            width={640}
            height={800}
            showGrid={false}
            markerRadius={6}
            className="opacity-80"
          />
          {/* Scanline wash — reads as sensor output, not as a missing image. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.16] [background-image:repeating-linear-gradient(0deg,transparent_0_3px,var(--bone)_3px_4px)]"
          />
        </div>
      )}
    </AnnotatedFrame>
  );
}
