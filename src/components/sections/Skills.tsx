import { skills, sections } from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

const meta = sections[5];

export function Skills() {
  return (
    <Section meta={meta}>
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />
        <Heading size="lg" className="mb-16">
          Skills
        </Heading>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((cat) => (
            <section
              key={cat.id}
              data-skill-card
              className="group rounded-[4px] border border-line bg-panel/50 p-6 transition-colors duration-500 hover:bg-panel"
            >
              <header className="mb-6 flex items-center gap-3">
                <span
                  data-skill-icon
                  className="text-marker transition-transform duration-[1200ms] ease-out group-hover:rotate-[360deg]"
                >
                  <Icon name={cat.icon} size={18} />
                </span>
                <h3 className="font-mono text-[11px] tracking-[0.14em] text-bone uppercase">
                  {cat.title}
                </h3>
              </header>

              <ul className="space-y-4">
                {cat.skills.map((s) => (
                  <li key={s.name}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <span className="text-[0.8125rem] text-bone/80">
                        {s.name}
                      </span>
                      <span
                        data-skill-value={s.level}
                        className="tabular shrink-0 font-mono text-[11px] text-muted"
                      >
                        {s.level}%
                      </span>
                    </div>
                    <div
                      className="relative h-px w-full bg-line"
                      role="meter"
                      aria-valuenow={s.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={s.name}
                    >
                      <span
                        data-skill-bar
                        style={{ transform: `scaleX(${s.level / 100})` }}
                        className="absolute inset-0 origin-left bg-marker"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
