import Image from "next/image";
import type { Certification } from "@/content";
import { MonoChip } from "./MonoChip";
import { CertificateLightbox } from "./CertificateLightbox";

/**
 * Issuer, title and date are always real selectable text — a scan would only
 * duplicate them, and worse for SEO and screen readers. The image, when it
 * exists, sits inside the identical corner-ticked frame; when it doesn't, a
 * diagonal hatch fills the same box. Nothing structural changes either way.
 */
export function CertificateCard({
  cert,
  image,
}: {
  cert: Certification;
  image: string | null;
}) {
  if (cert.inProgress) return <InProgressCard cert={cert} />;

  const card = <Card cert={cert} image={image} />;

  // Only scans that exist are clickable — a lightbox over a hatch pattern
  // would be a dead interaction, and this keeps the Framer chunk out of the
  // page entirely until a real certificate is added.
  return image ? (
    <CertificateLightbox cert={cert} image={image}>
      {card}
    </CertificateLightbox>
  ) : (
    card
  );
}

function Card({
  cert,
  image,
}: {
  cert: Certification;
  image: string | null;
}) {
  return (
    <article
      data-cert-card
      data-cert-id={cert.id}
      className="group relative flex flex-col overflow-hidden rounded-[4px] border border-line bg-panel transition-colors duration-500 hover:border-marker/40"
    >
      <div className="relative aspect-16/11 overflow-hidden border-b border-line bg-ink">
        {image ? (
          <Image
            src={image}
            alt={`${cert.title} certificate, issued by ${cert.issuer}`}
            fill
            sizes="(min-width: 1024px) 30vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <NoScanFill />
        )}
        <CornerTicks />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <MonoChip tone="marker" className="self-start">
          {cert.issuer}
        </MonoChip>
        <h3 className="text-sm leading-snug font-medium text-balance text-bone">
          {cert.title}
        </h3>
        <p className="tabular mt-auto font-mono text-[11px] tracking-[0.12em] text-muted">
          {cert.date}
        </p>
      </div>
    </article>
  );
}

function NoScanFill() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-70"
      >
        <defs>
          <pattern
            id="cert-hatch"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="var(--line)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cert-hatch)" />
      </svg>
      <span className="relative rounded-[4px] border border-line bg-ink/80 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-muted">
        no scan on file
      </span>
    </div>
  );
}

function InProgressCard({ cert }: { cert: Certification }) {
  return (
    <article
      data-cert-card
      data-cert-progress
      className="relative flex flex-col gap-3 rounded-[4px] border border-dashed border-line p-5"
    >
      <MonoChip dashed className="self-start">
        In progress
      </MonoChip>
      <h3 className="text-sm leading-snug text-balance text-muted">
        {cert.title}
      </h3>
      <p className="mt-auto font-mono text-[11px] tracking-[0.12em] text-muted">
        {cert.issuer} — <em className="not-italic">{cert.date}</em>
      </p>
    </article>
  );
}

const TICK = "pointer-events-none absolute h-3.5 w-3.5 border-marker";

function CornerTicks() {
  return (
    <div aria-hidden="true">
      <span className={`${TICK} top-1.5 left-1.5 border-t border-l`} />
      <span className={`${TICK} top-1.5 right-1.5 border-t border-r`} />
      <span className={`${TICK} bottom-1.5 left-1.5 border-b border-l`} />
      <span className={`${TICK} right-1.5 bottom-1.5 border-r border-b`} />
    </div>
  );
}
