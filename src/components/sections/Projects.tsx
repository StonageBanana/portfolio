import { projects, sections } from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { ProjectCard } from "./ProjectCard";

const meta = sections[4];

export function Projects() {
  return (
    <Section meta={meta} cursor="crosshair">
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />
        <Heading size="lg" className="mb-16">
          Projects
        </Heading>

        <div className="space-y-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} flipped={i % 2 === 1} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
