import { certifications, sections, type ResolvedAssets } from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { CertificateCard } from "@/components/ui/CertificateCard";

const meta = sections[6];

export function Certifications({ assets }: { assets: ResolvedAssets }) {
  return (
    <Section meta={meta}>
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />
        <Heading size="lg" className="mb-16">
          Certifications
        </Heading>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {certifications.map((c) => (
            <CertificateCard
              key={c.id}
              cert={c}
              image={assets.certificates[c.id] ?? null}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
