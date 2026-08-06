import type { Landing } from "./types";

export const landing: Landing = {
  heading: "Simhadri Mohana Kushal",
  designationLine:
    "Data Scientist · Computer Vision & 3D Pose Estimation · Applied Machine Learning",
  intro:
    "I build computer vision and machine learning systems end to end — from raw sensor data through the debugging nobody sees to a working, interpretable result. I'm completing an M.Sc. in Data Science (AI & ML) at FAU Erlangen-Nürnberg, with work spanning 3D human pose estimation, deep learning for medical imaging, reinforcement learning, and deployed predictive models. My strongest instinct is for the errors that quietly invalidate results: on a markerless motion capture study I traced a geometric distortion that had corrupted every trial, and correcting it cut joint-angle RMSE by 66–75% and flipped correlation with ground truth from strongly negative to strongly positive. I design pipelines that audit themselves, and I report negative results as readily as positive ones. If you need someone who will find the problem before the reviewer does — let's talk.",
  ctas: [
    { label: "Learn More About Me", href: "#about", kind: "primary" },
    { label: "Get In Touch", href: "#contact", kind: "secondary" },
  ],
  scrollCue: "↓ scroll",
  captions: {
    clean: "vicon reference · hip width 100%",
    distorted: "markerless estimate · hip width 44%   ·   pelvis axis +106°",
    corrected: "hip width 44% → 100%   ·   knee RMSE 84° → 21°",
  },
};
