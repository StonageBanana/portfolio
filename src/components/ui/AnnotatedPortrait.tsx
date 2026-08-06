import Image from "next/image";
import { AnnotatedFrame } from "./AnnotatedFrame";
import { MarkIcon } from "./MarkIcon";
import { about, site } from "@/content";

/**
 * The About-section portrait, framed as a detection: hairline bounding box,
 * corner ticks and a mono chip.
 *
 * With no photograph on file the interior holds the [ MK ] monogram rather than
 * a headshot. The frame, ticks and chip are identical either way, so dropping
 * `public/headshot.jpg` later swaps the fill and changes nothing structural.
 *
 * The chip label switches with the content: "conf 0.98" is a detection readout
 * and only makes sense over a photograph, so the monogram carries the logotype
 * name instead of claiming a confidence score for a piece of type.
 */
export function AnnotatedPortrait({ src }: { src: string | null }) {
  return (
    <AnnotatedFrame
      label={src ? about.portrait.confidenceLabel : about.portrait.markLabel}
      labelTone={src ? "signal" : "marker"}
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
        <div className="absolute inset-0 grid place-items-center">
          {/* Faint calibration grid, so the panel reads as an instrument
              surface rather than an empty box. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:32px_32px]"
          />
          <MarkIcon
            size={132}
            title={`${site.name} monogram`}
            className="relative"
          />
        </div>
      )}
    </AnnotatedFrame>
  );
}
