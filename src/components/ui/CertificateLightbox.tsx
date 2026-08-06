"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Certification } from "@/content";

/**
 * Opens the full certificate. The image scales up from the card's exact
 * position via a shared `layoutId`, and the backdrop blurs in behind it.
 *
 * Only rendered for certificates that actually have a scan on file, so with no
 * assets present this component — and the Framer chunk it needs — is never
 * instantiated. It starts working the moment a file is dropped into
 * public/certificates/, with no code change.
 */
export function CertificateLightbox({
  cert,
  image,
  children,
}: {
  cert: Certification;
  image: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="invert"
        aria-label={`View ${cert.title} certificate`}
        className="block w-full cursor-pointer text-left"
      >
        <motion.div layoutId={`cert-${cert.id}`}>{children}</motion.div>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center p-6"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            style={{ backgroundColor: "rgba(8,9,12,0.82)" }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={cert.title}
          >
            <motion.figure
              layoutId={`cert-${cert.id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[86vh] w-full max-w-4xl overflow-hidden rounded-[4px] border border-line bg-panel"
            >
              <div className="relative aspect-16/11">
                <Image
                  src={image}
                  alt={`${cert.title} certificate, issued by ${cert.issuer}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line p-4">
                <span className="text-sm text-bone">{cert.title}</span>
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">
                  {cert.issuer} · {cert.date}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
