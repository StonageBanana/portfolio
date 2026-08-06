import type { Achievement, StatCounter } from "./types";

export const achievementsHeading = "Achievements & Recognition";
export const achievementsSubheading =
  "Results I can point to, including the ones that came from finding what was broken.";

/** All four are verifiable. No vanity metrics, no awards counter. */
export const statCounters: StatCounter[] = [
  { id: "projects", value: "6", label: "Featured Projects" },
  { id: "certifications", value: "5", label: "Certifications" },
  { id: "images", value: "25,000", label: "Images Classified" },
  { id: "accuracy", value: "97.2%", label: "Peak Model Accuracy" },
];

export const achievements: Achievement[] = [
  {
    id: "distortion",
    category: "Academic",
    year: "2026",
    title: "Systematic distortion root-caused across an entire study",
    org: "FAU Erlangen-Nürnberg",
    detail:
      "Identified a geometric error affecting all 10 trials of a markerless motion capture benchmark; correcting it cut hip and knee flexion RMSE by 66–75% and reversed the sign of correlation with ground truth.",
    figure: "66–75%",
  },
  {
    id: "thesis",
    category: "Academic",
    year: "2024",
    title: "Thesis and conference poster published",
    org: "VIT Chennai",
    detail:
      "Custom CNN architectures reaching 97.2% accuracy on 25,000-image lung and colon histopathology classification, with Grad-CAM interpretability for clinical review. Both thesis and poster published in the project repository.",
    figure: "97.2%",
  },
  {
    id: "deployed",
    category: "Professional",
    year: "2023",
    title: "Model deployed and publicly live",
    org: "SmartBridge / Hugging Face",
    detail:
      "Took a flight-price model from raw records to a live Hugging Face Space, still running today — serialised to JavaScript and run in the browser, so there is no backend and no cold start.",
    figure: "0.784 R²",
  },
  {
    id: "aws",
    category: "Professional",
    year: "2023",
    title: "AWS Certified Cloud Practitioner",
    org: "Amazon Web Services",
    detail:
      "Foundational cloud certification; I'm now working toward the AWS Certified Machine Learning Engineer – Associate.",
    figure: "CLF-C02",
  },
];
