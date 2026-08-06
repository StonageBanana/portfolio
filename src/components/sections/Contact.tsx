import { contact, site, sections } from "@/content";
import { Container, Section, Eyebrow, Rule } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { ContactForm } from "@/components/ui/ContactForm";
import { Icon, socialIcon } from "@/components/ui/Icon";
import { mailtoHref } from "@/lib/web3forms";

const meta = sections[8];

export function Contact({ cv }: { cv: string | null }) {
  return (
    <Section meta={meta}>
      <Container>
        <Rule className="mb-12" />
        <Eyebrow meta={meta} className="mb-10" />
        <Heading size="lg" className="mb-16 max-w-[18ch]">
          {contact.heading}
        </Heading>

        <div className="grid gap-4 lg:grid-cols-2">
          <div data-contact-form>
            <ContactForm />
          </div>

          <aside
            data-contact-info
            className="flex flex-col gap-8 rounded-[4px] border border-line bg-ink p-7 sm:p-9"
          >
            <h3 className="eyebrow">{contact.infoTitle}</h3>

            <ul className="space-y-1">
              <InfoRow
                icon="Mail"
                label={site.email}
                href={mailtoHref(site.email)}
              />
              <InfoRow
                icon="Phone"
                label={site.phone}
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
              />
              <InfoRow icon="MapPin" label={site.location} />
              <InfoRow
                icon="ShieldCheck"
                label={site.workAuthorisationShort}
                wrap
              />
            </ul>

            <ul className="flex items-center gap-2">
              {site.socials
                .filter((s) => s.id !== "email")
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={s.label}
                      data-cursor="invert"
                      data-magnetic
                      className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-line text-muted transition-colors duration-300 hover:border-marker/60 hover:text-marker"
                    >
                      <Icon name={socialIcon[s.id]} size={17} />
                    </a>
                  </li>
                ))}
            </ul>

            <div className="mt-auto">
              <CvButton cv={cv} />
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Never disabled. With no PDF on file it becomes "Request CV" and opens a
 * prefilled mailto — a dead grey button is worse than a working alternative,
 * and this can never 404.
 */
function CvButton({ cv }: { cv: string | null }) {
  const available = Boolean(cv);
  return (
    <a
      href={
        cv ??
        mailtoHref(
          site.email,
          "CV request",
          `Hi Kushal,\n\nCould you send over your CV?\n\nThanks,\n`,
        )
      }
      download={available || undefined}
      data-cursor="invert"
      data-magnetic
      className="group inline-flex items-center gap-2.5 rounded-[4px] border border-line px-5 py-3 font-mono text-[11px] tracking-[0.14em] text-bone uppercase transition-colors duration-300 hover:border-marker/60 hover:text-marker"
    >
      {available ? contact.cvLabel : contact.cvUnavailableLabel}
      <Icon
        name={available ? "Download" : "ArrowUpRight"}
        size={14}
        className="transition-transform duration-300 group-hover:translate-y-0.5 group-hover:group-data-[unavailable]:translate-y-0"
      />
    </a>
  );
}

function InfoRow({
  icon,
  label,
  href,
  wrap = false,
}: {
  icon: string;
  label: string;
  href?: string;
  wrap?: boolean;
}) {
  const inner = (
    <>
      <span className="mt-0.5 shrink-0 text-muted transition-colors duration-300 group-hover:text-marker">
        <Icon name={icon} size={15} />
      </span>
      <span className={wrap ? "text-xs leading-relaxed" : "text-sm"}>
        {label}
      </span>
    </>
  );

  const cls =
    "group flex items-start gap-3 py-2.5 text-bone/85 transition-transform duration-300 hover:translate-x-1.5";

  return (
    <li>
      {href ? (
        <a href={href} data-cursor="invert" className={cls}>
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </li>
  );
}
