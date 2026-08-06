import type { Project } from "./types";

/**
 * Outcome copy is stored pre-segmented. `metric` segments render in --signal
 * and count up on entry; `strong` segments are emphasised but not coloured.
 * Nothing here is parsed at runtime.
 */
export const projects: Project[] = [
  {
    id: "sam3d-vs-vicon",
    index: "01",
    title: "Markerless vs. Marker-Based Motion Capture: SAM 3D Body vs. Vicon",
    kind: "Seminar Research",
    period: "2026",
    featured: true,
    summary:
      "A seminar research study testing whether a two-camera markerless setup using Meta's SAM 3D Body can substitute for a 10-camera marker-based Vicon rig in clinical gait and movement analysis, across 10 trials spanning walking, running, squats and dance. The benchmark numbers came second. First I had to find a systematic geometric distortion sitting in all 10 trials, which had been quietly corrupting every joint angle the pipeline produced.",
    outcomes: [
      {
        segments: [
          {
            t: "strong",
            v: "Root-caused and corrected a geometric distortion in all trials",
          },
          {
            t: "text",
            v: " — hip keypoints compressed to ~44% of true hip width, pelvis axis ~106° misaligned — cutting hip and knee flexion RMSE by ",
          },
          { t: "metric", v: "66–75%" },
          {
            t: "text",
            v: " (knee: 84° → 21°) and flipping correlation with ground truth from strongly negative to strongly positive.",
          },
        ],
      },
      {
        segments: [
          { t: "text", v: "Designed a " },
          { t: "strong", v: "9-stage reproducible pipeline" },
          {
            t: "text",
            v: " — C3D parsing, per-view inference, Umeyama/Procrustes alignment, accuracy metrics, GPA-based two-view fusion requiring ",
          },
          { t: "strong", v: "zero camera calibration" },
          {
            t: "text",
            v: ", and literature-benchmarked synthesis among them. A regression-audit suite enforces invariants such as PA-MPJPE ≤ MPJPE and GPA non-collapse.",
          },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Solved a size-collapse degeneracy in two-shape Generalized Procrustes Analysis via per-iteration RMS re-anchoring, and eliminated cycle-slips in periodic-gait synchronisation using multi-candidate cross-correlation lag selection.",
          },
        ],
      },
      {
        segments: [
          { t: "text", v: "Quantified two-view fusion at " },
          { t: "strong", v: "+3.7% MPJPE (up to +17% on distal joints)" },
          {
            t: "text",
            v: ", showed it averages independent per-camera noise rather than correcting systematic bias, ",
          },
          { t: "strong", v: "tested and rejected" },
          {
            t: "text",
            v: " confidence-weighted fusion (r = −0.13, p = 0.07), and benchmarked the residual gap against published markerless literature (~78 mm vs ~24 mm MPJPE).",
          },
        ],
      },
    ],
    tech: [
      "Python",
      "PyTorch",
      "SAM 3D Body",
      "OpenCV",
      "NumPy",
      "SciPy",
      "ezc3d",
      "Procrustes/Umeyama",
      "GPA",
      "Matplotlib",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/StonageBanana/Movement-Analyses-sam3d-vs-mocap",
        kind: "repo",
      },
    ],
  },
  {
    id: "histopathology-cnn",
    index: "02",
    title: "Custom CNN Architectures for Histopathological Cancer Classification",
    kind: "Thesis + Conference Poster",
    period: "May 2024",
    summary:
      "Designed, trained and benchmarked three CNN architectures — a from-scratch baseline, a Custom ResNet with attention and ImageNet transfer learning, and a Custom EfficientNet using compound scaling — for 5-class classification on the 25,000-image LC25000 lung and colon histopathology dataset. Grad-CAM and the confusion matrices went in with the first training run, so a pathologist could check the model's reasoning from day one.",
    outcomes: [
      {
        segments: [
          { t: "metric", v: "97.2%" },
          {
            t: "text",
            v: " accuracy (97.1% precision, 97.0% recall, 97.0% F1) with the Custom EfficientNet, ahead of the Custom ResNet (96.8%) and the baseline CNN (94.2%).",
          },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Retained both colon classes alongside the three lung classes to test whether the network learns tissue-type-specific malignancy features rather than a generic texture prior.",
          },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Built a preprocessing and augmentation pipeline to counter overfitting on limited underlying slide diversity.",
          },
        ],
      },
      {
        segments: [
          { t: "text", v: "Added " },
          { t: "strong", v: "Grad-CAM heatmaps" },
          {
            t: "text",
            v: ", confusion matrices and convergence curves, so a pathologist can check what the network actually looked at before trusting a call.",
          },
        ],
      },
    ],
    // TensorFlow and Keras were listed here but the notebook imports neither —
    // it is torch/torchvision throughout, with cv2 and scikit-learn alongside.
    tech: [
      "PyTorch",
      "torchvision",
      "EfficientNet",
      "ResNet",
      "Attention",
      "Transfer Learning",
      "Grad-CAM",
      "OpenCV",
      "scikit-learn",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/StonageBanana/Customized-CNNs-for-Precise-Lung-Cancer-Classification",
        kind: "repo",
      },
    ],
  },
  {
    id: "pathfinding",
    index: "03",
    title:
      "Pathfinding: Classical Search vs. Reinforcement Learning vs. Sampling Planners",
    kind: "Personal Project",
    period: "Jan 2025",
    summary:
      "Implemented and benchmarked 12 planners across three algorithmic families behind a single abstract base class, so a search algorithm, an RL agent and a sampling planner are all driven identically by the visualiser and the benchmarking harness.",
    outcomes: [
      {
        segments: [
          { t: "metric", v: "12" },
          { t: "strong", v: " planners, one interface" },
          {
            t: "text",
            v: " — classical search (A*, Dijkstra, BFS, DFS, Greedy Best-First, Bidirectional, Jump Point Search), RL (Q-Learning, SARSA, DQN) and sampling (RRT, RRT*) sharing a run() / extract_path() contract.",
          },
        ],
      },
      {
        segments: [
          { t: "text", v: "Built a " },
          { t: "strong", v: "Deep Q-Network from scratch in PyTorch" },
          {
            t: "text",
            v: ": experience replay, periodically synced target network, ε-greedy decay, MSE Bellman loss, CUDA handling.",
          },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Real-time Pygame visualiser (click-to-place start/goal/obstacles, adjustable speed, random maze generation) that makes off-policy vs. on-policy divergence directly observable.",
          },
        ],
      },
      {
        segments: [
          { t: "text", v: "Type-hinted and Doxygen-documented throughout." },
        ],
      },
    ],
    tech: [
      "Python",
      "PyTorch",
      "Pygame",
      "DQN",
      "Q-Learning",
      "SARSA",
      "RRT*",
      "OOP Design",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/StonageBanana/Pathfinding-Algorithms",
        kind: "repo",
      },
    ],
  },
  {
    id: "flight-price",
    index: "04",
    title: "Flight Price Prediction — Deployed ML Web Application",
    kind: "Externship Capstone",
    period: "Jul 2023",
    liveStatus: true,
    summary:
      "End-to-end ML pipeline on 10,682 Indian domestic flight records, taken from raw data to a public application. The free hosting tier has no backend, so the model had to fit inside a browser — and that constraint is what decided which model shipped.",
    outcomes: [
      {
        segments: [
          {
            t: "text",
            v: "Decomposed journey, departure and arrival timestamps into day/month/hour/minute components and encoded airline, source and destination, yielding a ",
          },
          { t: "strong", v: "29-feature design matrix" },
          {
            t: "text",
            v: " — with stop count mapped ordinally, since it genuinely is ordered.",
          },
        ],
      },
      {
        segments: [
          { t: "text", v: "Benchmarked " },
          { t: "strong", v: "six models" },
          {
            t: "text",
            v: " on one 80/20 split (Random Forest, Gradient Boosting, Decision Tree, KNN, SVR, Logistic Regression). Random Forest was the most accurate at ",
          },
          { t: "metric", v: "0.833" },
          { t: "text", v: " R², MAE ₹1,101." },
        ],
      },
      {
        segments: [
          { t: "strong", v: "Deployed Gradient Boosting instead, and documented why" },
          {
            t: "text",
            v: ": the free static tier has no Python backend, so the model is serialised to JavaScript and run in the browser. Random Forest needed 706,126 nodes and ",
          },
          { t: "metric", v: "16.2" },
          { t: "text", v: " MB; boosting holds " },
          { t: "metric", v: "0.784" },
          { t: "text", v: " R² in " },
          { t: "metric", v: "0.03" },
          { t: "text", v: " MB — 0.2% of the bytes for most of the accuracy." },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Proved the browser port computes the same function: across 5,000 randomised feature vectors the JavaScript and scikit-learn predictions differ by at most ",
          },
          { t: "strong", v: "8.2e-9" },
          {
            t: "text",
            v: " rupees — nine orders of magnitude below a single paisa.",
          },
        ],
      },
    ],
    tech: [
      "Python",
      "scikit-learn",
      "Gradient Boosting",
      "Pandas",
      "NumPy",
      "JavaScript",
      "Streamlit",
      "Docker",
      "Hugging Face Spaces",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/StonageBanana/Flight-Price-Prediction-SmartBridge-Internship---Applied-Data-Science",
        kind: "repo",
      },
      {
        label: "Live app",
        href: "https://stonagebanana04-flight-price-prediction.static.hf.space",
        kind: "live",
      },
    ],
  },
  {
    id: "crop-yield",
    index: "05",
    title: "Crop Yield Prediction from Climate and Agronomic Data",
    kind: "Personal Project",
    period: "Jan 2024",
    outcomes: [
      {
        segments: [
          { t: "text", v: "Merged " },
          { t: "strong", v: "four independently sourced agricultural datasets" },
          {
            t: "text",
            v: " (yield, rainfall, temperature, pesticide usage) into one modelling table, reconciling inconsistent country naming, misaligned year coverage, differing units and join-induced missingness.",
          },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Benchmarked five regressors (Linear, Decision Tree, Random Forest, Gradient Boosting, SVR) on R², MAE and RMSE; ",
          },
          { t: "strong", v: "Random Forest selected" },
          {
            t: "text",
            v: ", with the gap to the linear baseline quantifying the system's non-linearity.",
          },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Produced a companion statistical analysis (distribution diagnostics, climate–yield relationships) that drove model selection from data properties rather than post-hoc metric comparison.",
          },
        ],
      },
    ],
    tech: ["Python", "scikit-learn", "Pandas", "NumPy", "Seaborn", "Matplotlib"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/StonageBanana/Crop-Yield-Prediction",
        kind: "repo",
      },
    ],
  },
  {
    id: "credit-segmentation",
    index: "06",
    title: "Behavioural Segmentation of Credit Card Customers",
    kind: "Personal Project",
    period: "Apr 2023",
    outcomes: [
      {
        segments: [
          { t: "text", v: "Segmented ~" },
          { t: "metric", v: "9,000" },
          {
            t: "strong",
            v: " active cardholders",
          },
          {
            t: "text",
            v: " across 18 behavioural variables over a 6-month window.",
          },
        ],
      },
      {
        segments: [
          { t: "text", v: "Compared " },
          {
            t: "strong",
            v: "four clustering algorithms with deliberately incompatible assumptions",
          },
          {
            t: "text",
            v: " — K-Means, Mini-Batch K-Means, Mean Shift and Hierarchical — using agreement between assumption-free Mean Shift and fixed-k K-Means as evidence the structure was real rather than imposed.",
          },
        ],
      },
      {
        segments: [
          {
            t: "text",
            v: "Translated segments into actions across targeted marketing, credit-risk flagging (revolving debt plus high cash-advance frequency as a distress indicator) and retention.",
          },
        ],
      },
    ],
    tech: [
      "scikit-learn",
      "K-Means",
      "Mean Shift",
      "Hierarchical Clustering",
      "Pandas",
      "Seaborn",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/StonageBanana/Novel-Customer-Segmentation-on-Credit-Card-Customer-Details",
        kind: "repo",
      },
    ],
  },
];
