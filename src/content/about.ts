import type { About } from "./types";

export const about: About = {
  heading: "About Me",
  paragraph:
    "I'm a data scientist finishing an M.Sc. in Data Science (AI & ML) at FAU Erlangen-Nürnberg, after a B.Tech in Computer Science at VIT Chennai. My work sits where computer vision meets measurement you can trust: benchmarking Meta's SAM 3D Body against a 10-camera Vicon rig for clinical gait analysis, designing custom ResNet and EfficientNet architectures for histopathology classification and later extending that work with a from-scratch Grad-CAM implementation for pathologist review, and implementing reinforcement learning agents from scratch rather than from a library. I work primarily in Python with PyTorch, scikit-learn, OpenCV and the gradient-boosting family, and I'm comfortable in the applied mathematics underneath — Procrustes and Umeyama alignment, Generalized Procrustes Analysis, agreement analysis, significance testing. What separates my projects is the auditing: reproducible, config-driven pipelines with regression suites that enforce mathematical invariants, so a silent failure gets caught by the pipeline instead of by a reader. I've taken models all the way to deployment, including a live application on Hugging Face Spaces that runs its model in the browser. And I'll tell you when something didn't work — I tested confidence-weighted sensor fusion, it failed, and that's in the writeup.",
  portrait: {
    alt: "Simhadri Mohana Kushal",
    // Shown over a real photograph — a detection readout.
    confidenceLabel: "conf 0.98",
    // Shown over the monogram, where a confidence score would be meaningless.
    markLabel: "logotype",
  },
  mission: {
    title: "Mission",
    body: "To build measurement systems that are honest about their own error, so the people relying on them — clinicians, researchers, engineers — know exactly how far to trust the number.",
  },
  vision: {
    title: "Vision",
    body: "To help make markerless, camera-only motion capture accurate enough to replace marker-based labs in clinical practice, putting gait and movement analysis within reach of any clinic with two cameras.",
  },
  workLinks: [
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Certifications", href: "#certifications" },
  ],
};
