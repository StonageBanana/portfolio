import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    id: "smartbridge",
    role: "Applied Data Scientist (Externship)",
    org: "SmartBridge / SmartInternz",
    badge: "Externship",
    location: "Remote / India",
    period: "May 2023 – Jul 2023",
    programme: "Applied Data Science, powered by Google",
    responsibilities: [
      "Built an end-to-end flight price prediction system as the programme capstone, from raw records through to a live user-facing application.",
      "Engineered temporal features by decomposing departure and arrival timestamps, and encoded high-cardinality categoricals (airline, route, class, stops).",
      "Benchmarked six regression algorithms and justified the final model choice from the structure of the data and the deployment constraint, not just the leaderboard.",
      "Completed supporting coursework in data preparation, feature engineering and model evaluation across additional applied datasets.",
    ],
    achievements: [
      "Trained a Random Forest to 0.833 R² (MAE ₹1,101) across 10,682 flight records, then deployed Gradient Boosting instead at 0.784 R² — because the forest serialised to 16.2 MB and the free hosting tier has no backend, while boosting held most of the accuracy in 0.03 MB.",
      "Shipped it as a static Hugging Face Space with the model serialised to JavaScript and evaluated in the browser: no backend, no cold start, and predictions verified identical to scikit-learn to 8.2e-9 — still live.",
    ],
  },
];
