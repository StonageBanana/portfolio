import type { Site, SectionMeta } from "./types";

export const site: Site = {
  name: "Simhadri Mohana Kushal",
  designations: [
    "Data Scientist",
    "Computer Vision & 3D Pose Estimation",
    "Applied Machine Learning",
  ],
  logo: { text: "MK", bracketed: "[ MK ]" },
  email: "mohanakushal.de2024@gmail.com",
  phone: "+49 1551 0425067",
  location: "Erlangen, Germany",
  workAuthorisation:
    "German student residence permit · eligible for the 18-month post-study job-seeker permit and the EU Blue Card on graduation",
  workAuthorisationShort:
    "German student residence permit · EU Blue Card eligible on graduation",
  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/StonageBanana" },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mohana-kuhsal-simhadri-177205200/",
    },
    { id: "email", label: "Email", href: "mailto:mohanakushal.de2024@gmail.com" },
  ],
  footerTagline: "Measure it, then prove the measurement.",
};

/** The single ordered array driving page composition, the rail and anchor ids. */
export const sections: SectionMeta[] = [
  { id: "landing", index: "01", label: "Landing", eyebrow: "LANDING" },
  { id: "about", index: "02", label: "About", eyebrow: "ABOUT" },
  { id: "experience", index: "03", label: "Experience", eyebrow: "EXPERIENCE" },
  { id: "education", index: "04", label: "Education", eyebrow: "EDUCATION" },
  { id: "projects", index: "05", label: "Projects", eyebrow: "PROJECTS" },
  { id: "skills", index: "06", label: "Skills", eyebrow: "SKILLS" },
  {
    id: "certifications",
    index: "07",
    label: "Certifications",
    eyebrow: "CERTIFICATIONS",
  },
  {
    id: "achievements",
    index: "08",
    label: "Achievements",
    eyebrow: "ACHIEVEMENTS",
  },
  { id: "contact", index: "09", label: "Contact", eyebrow: "CONTACT" },
];

export const sectionIds = sections.map((s) => s.id);
