import {
  achievements,
  achievementsHeading,
  achievementsSubheading,
  statCounters,
  sections,
} from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { MonoChip } from "@/components/ui/MonoChip";

const meta = sections[7];

export function Achievements() {
  return (
    <Section meta={meta}>
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />

        <Heading size="lg" className="mb-4">
          {achievementsHeading}
        </Heading>
        <p className="mb-14 max-w-[56ch] text-[0.95rem] leading-[1.7] text-muted italic">
          {achievementsSubheading}
        </p>

        {/* Stat counters — tabular figures so widths don't jitter counting up. */}
        <dl className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line lg:grid-cols-4">
          {statCounters.map((s) => (
            <div key={s.id} className="bg-panel/60 p-6">
              <dt className="eyebrow mb-3">{s.label}</dt>
              <dd
                data-count={s.value}
                className="tabular font-mono text-[clamp(1.6rem,3vw,2.5rem)] leading-none text-signal"
              >
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((a) => (
            <article
              key={a.id}
              data-achievement
              className="group relative overflow-hidden rounded-[4px] border border-line bg-panel/50 transition-colors duration-500 hover:bg-panel"
            >
              <div className="flex gap-5 p-6 sm:p-7">
                {/* Data-card fallback: a plot-axis frame with the figure large
                    in --signal. Used wherever no image exists. */}
                <DataCard figure={a.figure} />

                <div className="min-w-0 flex-1">
                  <MonoChip
                    tone="marker"
                    className="mb-4"
                  >{`${a.category} · ${a.year}`}</MonoChip>

                  <h3 className="font-display text-[1.0625rem] leading-snug tracking-[-0.01em] text-bone">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">{a.org}</p>
                  <p className="mt-4 text-sm leading-[1.68] text-bone/75">
                    {a.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Plot-axis frame — L-shaped axes with the key figure sitting on them. */
function DataCard({ figure }: { figure: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative hidden h-24 w-24 shrink-0 border-b border-l border-line sm:block"
    >
      <span className="tabular absolute inset-0 flex items-center justify-center px-1 text-center font-mono text-[0.8125rem] leading-tight text-signal">
        {figure}
      </span>
      {/* Tick marks along the axes. */}
      {[25, 50, 75].map((p) => (
        <span
          key={`x${p}`}
          className="absolute -bottom-1 h-1.5 w-px bg-line"
          style={{ left: `${p}%` }}
        />
      ))}
      {[25, 50, 75].map((p) => (
        <span
          key={`y${p}`}
          className="absolute -left-1 h-px w-1.5 bg-line"
          style={{ bottom: `${p}%` }}
        />
      ))}
    </div>
  );
}
