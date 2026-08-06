import { landing, site, sections } from "@/content";
import { Container, Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, socialIcon } from "@/components/ui/Icon";
import { HeroPose } from "@/components/three/HeroPose";

const meta = sections[0];

export function Landing() {
  return (
    <Section meta={meta} bare cursor="crosshair" className="relative min-h-svh">
      {/* The skeleton sits behind the copy and bleeds to the viewport edge. */}
      <HeroPose />

      <Container className="relative z-10 flex min-h-svh flex-col justify-center pt-28 pb-20">
        <div className="grid gap-x-8 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-6">
            <p className="eyebrow mb-8 flex items-center gap-3">
              <span className="tabular text-marker">{meta.index}</span>
              <span aria-hidden="true" className="text-line">
                /
              </span>
              <span>{meta.eyebrow}</span>
            </p>

            <Heading as="h1" size="xl" className="mb-6">
              {landing.heading}
            </Heading>

            <p className="mb-8 font-mono text-[11px] leading-relaxed tracking-[0.16em] text-muted uppercase sm:text-xs">
              {landing.designationLine}
            </p>

            <Body className="mb-8 max-w-[64ch]">{landing.intro}</Body>

            <div className="mb-7 flex flex-wrap gap-3">
              {landing.ctas.map((cta) => (
                <span key={cta.href} data-cta className="inline-flex">
                  <ButtonLink href={cta.href} kind={cta.kind} icon="ArrowRight">
                    {cta.label}
                  </ButtonLink>
                </span>
              ))}
            </div>

            <ul className="mb-5 flex items-center gap-2">
              {site.socials.map((s) => (
                <li key={s.id} data-social>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    data-cursor="invert"
                    data-magnetic
                    {...(s.id === "email"
                      ? {}
                      : { target: "_blank", rel: "noreferrer noopener" })}
                    className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-line text-muted transition-colors duration-300 hover:border-marker/60 hover:text-marker"
                  >
                    <Icon name={socialIcon[s.id]} size={17} />
                  </a>
                </li>
              ))}
            </ul>

            <p
              data-permit
              className="max-w-[72ch] font-mono text-[10px] leading-relaxed tracking-[0.1em] text-muted"
            >
              {site.workAuthorisation}
            </p>
          </div>
        </div>
      </Container>

      <div
        data-scroll-cue
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] tracking-[0.24em] text-muted uppercase"
      >
        {landing.scrollCue}
      </div>
    </Section>
  );
}
