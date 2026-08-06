import type { Project, TextSegment } from "@/content";
import { MonoChip } from "@/components/ui/MonoChip";
import { Icon } from "@/components/ui/Icon";
import { InlinePose } from "@/components/three/InlinePose";
import { cn } from "@/lib/cn";

/**
 * Full-width project row: dark --panel column carrying identity and links,
 * plus a content column. The panel side alternates per project.
 */
export function ProjectCard({
  project,
  flipped,
}: {
  project: Project;
  flipped: boolean;
}) {
  return (
    <article
      data-project
      data-project-id={project.id}
      data-featured={project.featured ? "" : undefined}
      className="group grid items-stretch gap-px overflow-hidden rounded-[4px] border border-line bg-line lg:grid-cols-12"
    >
      {/* ---- Identity panel ---- */}
      <div
        data-project-panel
        className={cn(
          "relative flex flex-col justify-between gap-8 bg-panel p-7 sm:p-9 lg:col-span-4",
          flipped && "lg:order-2",
        )}
      >
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="tabular font-mono text-[11px] tracking-[0.16em] text-marker">
              {project.index}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            {project.liveStatus ? <LiveDot /> : null}
          </div>

          <h3
            data-project-title
            className="font-display text-[clamp(1.2rem,1.9vw,1.65rem)] leading-[1.15] tracking-[-0.02em] text-bone transition-[letter-spacing] duration-500 group-hover:tracking-[0em]"
          >
            {project.title}
          </h3>

          <div className="mt-5 flex flex-wrap gap-2">
            <MonoChip>{project.kind}</MonoChip>
            <MonoChip>{project.period}</MonoChip>
          </div>
        </div>

        {/* The featured project carries the inline skeleton, scrubbed
            distorted → corrected while the card is pinned. */}
        {project.featured ? (
          <div
            data-inline-pose
            className="relative -mx-2 aspect-4/3 overflow-hidden rounded-[4px] border border-line/60 bg-ink"
          >
            <InlinePose />
          </div>
        ) : null}

        <ul className="space-y-2">
          {project.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="invert"
                className="group/link inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase transition-colors duration-300 hover:text-marker"
              >
                {l.label}
                <Icon
                  name="ArrowUpRight"
                  size={13}
                  className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- Content column ---- */}
      <div
        data-project-body
        className={cn(
          "bg-ink p-7 sm:p-9 lg:col-span-8",
          flipped && "lg:order-1",
        )}
      >
        {project.summary ? (
          <p
            data-split="words"
            className="mb-8 max-w-[76ch] text-[0.95rem] leading-[1.72] text-bone/80"
          >
            {project.summary}
          </p>
        ) : null}

        <p className="eyebrow mb-4">Key outcomes</p>
        <ol className="mb-8 grid gap-3 sm:grid-cols-2">
          {project.outcomes.map((o, i) => (
            <li
              key={i}
              data-outcome
              className="rounded-[4px] border border-line bg-panel/40 p-5"
            >
              <span className="tabular mb-2 block font-mono text-[10px] tracking-[0.16em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-[1.68] text-bone/80">
                {o.segments.map((s, si) => (
                  <Segment key={si} segment={s} />
                ))}
              </p>
            </li>
          ))}
        </ol>

        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t}>
              <span
                data-pill
                className="inline-block rounded-[4px] border border-line px-2.5 py-1.5 font-mono text-[10px] tracking-[0.1em] text-muted transition-colors duration-300 hover:border-marker/40 hover:text-marker"
              >
                {t}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Segment({ segment }: { segment: TextSegment }) {
  if (segment.t === "metric") {
    return (
      <span data-count={segment.v} className="tabular font-mono text-signal">
        {segment.v}
      </span>
    );
  }
  if (segment.t === "strong") {
    return <strong className="font-semibold text-bone">{segment.v}</strong>;
  }
  return <>{segment.v}</>;
}

function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-marker lowercase">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marker opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-marker" />
      </span>
      live
    </span>
  );
}
