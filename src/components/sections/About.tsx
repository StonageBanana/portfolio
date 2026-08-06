import { about, sections } from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Heading";
import { AnnotatedPortrait } from "@/components/ui/AnnotatedPortrait";
import { Icon } from "@/components/ui/Icon";

const meta = sections[1];

export function About({ headshot }: { headshot: string | null }) {
  return (
    <Section meta={meta}>
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />

        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div data-parallax className="lg:col-span-4">
            <AnnotatedPortrait src={headshot} />
          </div>

          <div className="lg:col-span-8">
            <Heading size="lg" className="mb-8">
              {about.heading}
            </Heading>

            <Body className="mb-12 max-w-[72ch]">{about.paragraph}</Body>

            <div className="mb-12 grid gap-4 sm:grid-cols-2">
              <MissionCard
                title={about.mission.title}
                body={about.mission.body}
              />
              <MissionCard
                title={about.vision.title}
                body={about.vision.body}
              />
            </div>

            <p className="eyebrow mb-4">View My Work</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {about.workLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    data-cursor="invert"
                    data-magnetic
                    className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] text-bone uppercase transition-colors duration-300 hover:text-marker"
                  >
                    <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-marker after:transition-[width] after:duration-300 group-hover:after:w-full">
                      {l.label}
                    </span>
                    <Icon
                      name="ArrowUpRight"
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function MissionCard({ title, body }: { title: string; body: string }) {
  return (
    <article
      data-flip-card
      className="group relative rounded-[4px] border border-line bg-panel p-6 transition-colors duration-500 hover:border-marker/40"
    >
      <h3 className="eyebrow mb-3 text-marker">{title}</h3>
      <p className="text-sm leading-[1.68] text-bone/80">{body}</p>
    </article>
  );
}
