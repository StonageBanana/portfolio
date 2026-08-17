import type { EducationEntry } from "./types";

export const education: EducationEntry[] = [
  {
    id: "fau",
    degree: "M.Sc. Data Science (AI & ML)",
    institution: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
    period: "Oct 2024 – Jun 2027 (expected)",
    mode: "Full-time",
    location: "Erlangen, Germany",
    highlights: [
      "Specialising in computer vision, 3D pose estimation and deep learning for medical imaging.",
      "Coursework: Artificial Intelligence · Pattern Recognition and Analysis · Machine Learning: Mathematics and Coding.",
      "Seminar research benchmarking markerless motion capture against clinical-grade marker-based systems.",
    ],
  },
  {
    id: "vit",
    degree: "B.Tech Computer Science",
    institution: "Vellore Institute of Technology (VIT), Chennai",
    period: "Aug 2020 – Jul 2024",
    mode: "Full-time",
    location: "Chennai, India",
    highlights: [
      "Thesis and conference poster on custom CNN architectures for histopathological cancer classification.",
      "Coursework: Data Structures & Algorithms · Design and Analysis of Algorithms · Database Management Systems · Data Visualization · Statistics for Engineers.",
      "Built the software-engineering foundation — OOP, algorithms, databases — that the ML work sits on.",
    ],
  },
];
