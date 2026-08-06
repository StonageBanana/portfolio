/**
 * Every visitor-readable string in this site lives under `src/content/`.
 * Components are dumb renderers that receive these as typed props — that is
 * what keeps "all copy verbatim" a solved problem rather than an ongoing audit.
 */

export type SectionId =
  | "landing"
  | "about"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "achievements"
  | "contact";

/** Drives page composition, the section rail, and anchor ids — one source, so
 *  the rail cannot desync from the page. */
export interface SectionMeta {
  id: SectionId;
  /** Zero-padded sequence shown in the mono eyebrow and the rail: "01".."09" */
  index: string;
  /** Short label for the rail pill and top nav. */
  label: string;
  /** Eyebrow text, e.g. "LANDING" */
  eyebrow: string;
}

export interface SocialLink {
  id: "github" | "linkedin" | "email";
  label: string;
  href: string;
}

export interface Site {
  name: string;
  designations: string[];
  logo: { text: string; bracketed: string };
  email: string;
  phone: string;
  location: string;
  workAuthorisation: string;
  workAuthorisationShort: string;
  socials: SocialLink[];
  footerTagline: string;
}

export interface Landing {
  heading: string;
  designationLine: string;
  intro: string;
  ctas: { label: string; href: string; kind: "primary" | "secondary" }[];
  scrollCue: string;
  /** Mono caption that scrubs with the hero skeleton morph. */
  captions: { clean: string; distorted: string; corrected: string };
}

export interface About {
  heading: string;
  paragraph: string;
  portrait: { alt: string; confidenceLabel: string; markLabel: string };
  mission: { title: string; body: string };
  vision: { title: string; body: string };
  workLinks: { label: string; href: string }[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  org: string;
  badge: string;
  location: string;
  period: string;
  programme?: string;
  responsibilities: string[];
  achievements: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  period: string;
  mode: string;
  location: string;
  highlights: string[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  /** e.g. "Seminar Research" */
  kind: string;
  period: string;
  summary?: string;
  outcomes: ProjectOutcome[];
  tech: string[];
  links: { label: string; href: string; kind: "repo" | "live" }[];
  /** Project 01 pins for an extra viewport and runs an inline pose skeleton. */
  featured?: boolean;
  /** Renders a live-status dot with a mono `live` label. */
  liveStatus?: boolean;
}

/**
 * Outcome text is stored pre-split so metrics can be rendered in --signal and
 * counted up, without any component parsing prose at runtime.
 */
export interface ProjectOutcome {
  /** Rich text segments; `metric` segments render in --signal and count up. */
  segments: TextSegment[];
}

export type TextSegment =
  | { t: "text"; v: string }
  | { t: "strong"; v: string }
  | { t: "metric"; v: string };

export interface SkillCategory {
  id: string;
  title: string;
  /** lucide-react icon name */
  icon: string;
  skills: { name: string; level: number }[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  /** Filename under public/certificates/ — may not exist yet. */
  image?: string;
  inProgress?: boolean;
}

export interface StatCounter {
  id: string;
  value: string;
  label: string;
}

export interface Achievement {
  id: string;
  category: "Academic" | "Professional";
  year: string;
  title: string;
  org: string;
  detail: string;
  /** The figure shown large in --signal on the data-card fallback. */
  figure: string;
  image?: string;
}

export interface Contact {
  heading: string;
  formTitle: string;
  fields: { id: "name" | "email" | "subject" | "message"; label: string; type: "text" | "email" | "textarea" }[];
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  errors: {
    unconfigured: string;
    network: string;
    timeout: string;
    rejected: string;
  };
  validation: { required: string; email: string };
  infoTitle: string;
  cvLabel: string;
  cvUnavailableLabel: string;
  mailtoLabel: string;
}
