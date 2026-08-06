import { site } from "@/content";
import { Container } from "./Section";
import { Icon, socialIcon } from "./Icon";

export function Footer() {
  return (
    <footer className="relative pb-14">
      <Container>
        {/* A --marker hairline draws across the full width as it enters view. */}
        <div className="relative mb-10 h-px w-full bg-line">
          <span
            data-footer-line
            className="absolute inset-y-0 left-0 w-full origin-left bg-marker"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-lg tracking-[-0.02em] text-bone">
              {site.name}
            </p>
            <p className="mt-1.5 text-sm text-muted italic">
              &ldquo;{site.footerTagline}&rdquo;
            </p>
          </div>

          <ul className="flex items-center gap-2">
            {site.socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  data-cursor="invert"
                  {...(s.id === "email"
                    ? {}
                    : { target: "_blank", rel: "noreferrer noopener" })}
                  className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-line text-muted transition-colors duration-300 hover:border-marker/60 hover:text-marker"
                >
                  <Icon name={socialIcon[s.id]} size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
