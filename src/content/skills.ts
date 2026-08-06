import type { SkillCategory } from "./types";

export const skills: SkillCategory[] = [
  {
    id: "programming",
    title: "Programming & Data",
    icon: "Terminal",
    skills: [
      { name: "Python", level: 95 },
      { name: "SQL", level: 72 },
      { name: "JavaScript", level: 68 },
      { name: "Pandas/NumPy", level: 93 },
      { name: "Git", level: 85 },
    ],
  },
  {
    id: "ml",
    title: "Machine Learning & Deep Learning",
    icon: "BrainCircuit",
    skills: [
      { name: "Deep Learning", level: 90 },
      { name: "Computer Vision", level: 92 },
      { name: "3D Pose Estimation", level: 90 },
      { name: "CNN Architecture Design", level: 90 },
      { name: "Transfer Learning & Attention", level: 87 },
      { name: "Reinforcement Learning", level: 82 },
      { name: "Ensemble Methods", level: 88 },
      { name: "Unsupervised Learning", level: 83 },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks & Libraries",
    icon: "Layers",
    skills: [
      { name: "PyTorch", level: 92 },
      { name: "TensorFlow/Keras", level: 85 },
      { name: "scikit-learn", level: 90 },
      { name: "OpenCV", level: 87 },
      // Named by library rather than "Ensemble Methods" alone, which already
      // appears as a concept under Machine Learning & Deep Learning.
      { name: "Ensemble Methods (sklearn)", level: 88 },
      { name: "Streamlit", level: 85 },
      { name: "Matplotlib/Seaborn", level: 88 },
    ],
  },
  {
    id: "maths",
    title: "Applied Mathematics & Statistics",
    icon: "Sigma",
    skills: [
      { name: "3D Geometry (Procrustes/Umeyama/GPA)", level: 90 },
      { name: "Error Metrics (MPJPE, RMSE, MAE, R²)", level: 92 },
      { name: "Correlation & Significance Testing", level: 85 },
      { name: "Bland-Altman Agreement Analysis", level: 82 },
    ],
  },
  {
    id: "engineering",
    title: "Engineering Practice",
    icon: "Wrench",
    skills: [
      { name: "Reproducible Pipeline Design", level: 90 },
      { name: "Regression & Invariant Auditing", level: 88 },
      { name: "Root-Cause Debugging", level: 92 },
      { name: "Config-Driven Experimentation", level: 85 },
      { name: "Model Deployment", level: 80 },
    ],
  },
  {
    id: "domain",
    title: "Domain & Formats",
    icon: "Activity",
    skills: [
      { name: "C3D Mocap I/O (ezc3d)", level: 85 },
      { name: ".trc Export (Vicon Nexus / Visual3D / OpenSim)", level: 82 },
      { name: "Histopathology Imaging", level: 85 },
      { name: "Biomechanics Evaluation", level: 84 },
    ],
  },
];
