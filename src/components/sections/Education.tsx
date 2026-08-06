import { education, sections } from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { MonoChip } from "@/components/ui/MonoChip";
import { Icon } from "@/components/ui/Icon";

const meta = sections[3];

export function Education() {
  return (
    <Section meta={meta}>
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />
        <Heading size="lg" className="mb-16">
          Education
        </Heading>

        <div className="grid gap-6 lg:grid-cols-2">
          {education.map((e, i) => (
            <article
              key={e.id}
              data-edu-card
              data-edu-index={i}
              className="group relative overflow-hidden rounded-[4px] border border-line bg-panel/60 p-7 transition-colors duration-500 hover:bg-panel sm:p-9"
            >
              {/* Traced border on hover — a stroke, not a colour swap. */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                <rect
                  data-trace
                  x="0.5"
                  y="0.5"
                  width="99.5%"
                  height="99.5%"
                  rx="3"
                  fill="none"
                  stroke="var(--marker)"
                  strokeWidth="1"
                  pathLength={100}
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  className="opacity-0 transition-[stroke-dashoffset,opacity] duration-700 ease-out group-hover:opacity-70 group-hover:[stroke-dashoffset:0]"
                />
              </svg>

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <MonoChip tone="marker">{e.period}</MonoChip>
                    <MonoChip>{e.mode}</MonoChip>
                    <MonoChip>{e.location}</MonoChip>
                  </div>
                  <span
                    data-cap
                    className="shrink-0 text-muted transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-12"
                  >
                    <Icon name="GraduationCap" size={20} />
                  </span>
                </div>

                <h3 className="font-display text-[clamp(1.15rem,1.7vw,1.5rem)] leading-tight tracking-[-0.02em] text-bone">
                  {e.degree}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{e.institution}</p>

                <ul className="mt-6 space-y-3">
                  {e.highlights.map((h, hi) => (
                    <li key={hi} data-edu-bullet className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-4 shrink-0 bg-line"
                      />
                      <p className="text-sm leading-[1.68] text-bone/75">{h}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
