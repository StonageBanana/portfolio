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
      "Benchmarked eight regression algorithms and justified the final model choice from the structure of the data, not just the leaderboard.",
      "Completed supporting coursework in data preparation, feature engineering and model evaluation across additional applied datasets.",
    ],
    achievements: [
      "Selected CatBoost at ~96% R² across 10,000+ flight records — chosen because ordered target statistics handle high-cardinality categoricals natively, avoiding both one-hot dimensionality explosion and false ordinality.",
      "Deployed the model publicly as an interactive Streamlit app on Hugging Face Spaces with a recorded walkthrough — still live.",
    ],
  },
];
