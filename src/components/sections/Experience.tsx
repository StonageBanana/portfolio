import { experience, sections } from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { MonoChip } from "@/components/ui/MonoChip";
import { Metric } from "@/components/ui/Metric";

const meta = sections[2];

export function Experience() {
  return (
    <Section meta={meta}>
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />
        <Heading size="lg" className="mb-16">
          Work Experience
        </Heading>

        {/* Timeline rail. The fill height is scrubbed by scroll in phase 6. */}
        <div className="relative pl-8 sm:pl-12">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-0 left-0 w-px bg-line"
          >
            <div
              data-timeline-fill
              className="h-full w-full origin-top bg-marker"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {experience.map((e) => (
            <article key={e.id} data-timeline-entry className="relative">
              <span
                aria-hidden="true"
                data-timeline-node
                className="absolute top-2 -left-8 h-2 w-2 -translate-x-1/2 rounded-full border border-marker bg-ink sm:-left-12"
              />

              <div
                data-exp-card
                className="group rounded-[4px] border border-line bg-panel/60 transition-all duration-500 hover:border-marker/40 hover:bg-panel"
              >
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
                  {/* Dark side rail — expands from zero width in phase 6. */}
                  <div
                    data-card-rail
                    className="hidden w-1 shrink-0 rounded-[2px] bg-marker/30 sm:block"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <MonoChip tone="marker">{e.badge}</MonoChip>
                      <MonoChip>{e.location}</MonoChip>
                      <MonoChip>{e.period}</MonoChip>
                    </div>

                    <h3 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] leading-tight tracking-[-0.02em] text-bone">
                      {e.role}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{e.org}</p>
                    {e.programme ? (
                      <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-muted">
                        Programme: {e.programme}
                      </p>
                    ) : null}

                    <BulletGroup
                      title="Key responsibilities"
                      items={e.responsibilities}
                    />
                    <BulletGroup
                      title="Key achievements"
                      items={e.achievements}
                      emphasis
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function BulletGroup({
  title,
  items,
  emphasis = false,
}: {
  title: string;
  items: string[];
  emphasis?: boolean;
}) {
  return (
    <div className="mt-7">
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-3">
        {items.map((text, i) => (
          <li key={i} data-bullet className="flex gap-3">
            <span
              aria-hidden="true"
              data-bullet-dash
              className="mt-2.5 h-px w-4 shrink-0 bg-line"
            />
            <p
              className={
                emphasis
                  ? "text-sm leading-[1.68] text-bone/90"
                  : "text-sm leading-[1.68] text-bone/75"
              }
            >
              <Metric>{text}</Metric>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
