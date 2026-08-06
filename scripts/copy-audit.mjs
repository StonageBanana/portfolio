/**
 * Verbatim copy audit.
 *
 * Every string below is quoted from the source brief. The site's copy lives in
 * src/content/ and must match it exactly — this asserts that against the
 * actually-rendered page, so a stray edit in a component can't silently
 * paraphrase something.
 *
 *   node scripts/copy-audit.mjs                    # against localhost:3000
 *   AUDIT_URL=https://... node scripts/copy-audit.mjs
 */
const TARGET = process.env.AUDIT_URL ?? "http://localhost:3000";

const res = await fetch(TARGET);
if (!res.ok) {
  console.error(`Could not fetch ${TARGET} — is the server running?`);
  process.exit(1);
}
const html = await res.text();

const text = html
  .replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<style[\s\S]*?<\/style>/g, " ")
  // Inline tags contribute NO whitespace when rendered — dropping them with a
  // space would fabricate a gap (e.g. the <span> wrapping "96%") and report a
  // copy mismatch that doesn't exist on screen.
  .replace(/<\/?(?:span|strong|em|b|i|a|code|sup|sub)\b[^>]*>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ")
  .replace(/&ldquo;/g, "“")
  .replace(/&rdquo;/g, "”")
  .replace(/&#x2019;/g, "’")
  .replace(/\s+/g, " ");

const EXPECT = [
  ["landing intro (opening)", "I build computer vision and machine learning systems end to end — from raw sensor data through the debugging nobody sees to a working, interpretable result."],
  ["landing intro (finding)", "on a markerless motion capture study I traced a geometric distortion that had corrupted every trial, and correcting it cut hip and knee flexion RMSE by 66–75% and reversed the sign of its agreement with ground truth."],
  ["landing intro (close)", "If you need someone who will find the problem before the reviewer does — let's talk."],
  ["about paragraph (opening)", "I'm a data scientist finishing an M.Sc. in Data Science (AI & ML) at FAU Erlangen-Nürnberg, after a B.Tech in Computer Science at VIT Chennai."],
  ["about paragraph (auditing)", "What separates my projects is the auditing: reproducible, config-driven pipelines with regression suites that enforce mathematical invariants, so a silent failure gets caught by the pipeline instead of by a reader."],
  ["about paragraph (tail)", "And I'll tell you when something didn't work — I tested confidence-weighted sensor fusion, it failed, and that's in the writeup."],
  ["mission", "To build measurement systems that are honest about their own error, so the people relying on them — clinicians, researchers, engineers — know exactly how far to trust the number."],
  ["vision", "To help make markerless, camera-only motion capture accurate enough to replace marker-based labs in clinical practice, putting gait and movement analysis within reach of any clinic with two cameras."],
  ["designation line", "Data Scientist · Computer Vision & 3D Pose Estimation · Applied Machine Learning"],
  ["work authorisation", "German student residence permit · eligible for the 18-month post-study job-seeker permit and the EU Blue Card on graduation"],
  ["contact heading", "Let's build something measurable."],
  ["footer tagline", "Measure it, then prove the measurement."],
  ["achievements subheading", "Results I can point to, including the ones that came from finding what was broken."],
  ["FAU graduation (filled in)", "Oct 2024 – Sep 2027 (expected)"],
  ["VIT period", "Aug 2020 – Jul 2024"],
  ["experience period", "May 2023 – Jul 2023"],
  ["externship programme", "Applied Data Science, powered by Google"],
  ["flight: model selection", "then deployed Gradient Boosting instead at 0.784 R²"],
  ["flight: browser parity", "predictions matching scikit-learn to within 8.2e-9 rupees"],
  ["project 01 title", "Markerless vs. Marker-Based Motion Capture: SAM 3D Body vs. Vicon"],
  ["project 01 distortion", "hip keypoints compressed to ~44% of true hip width, pelvis axis ~106° misaligned"],
  ["project 01 fusion", "confidence-weighted fusion (r = −0.13, p = 0.07)"],
  ["project 01 benchmark", "~78 mm vs ~24 mm MPJPE"],
  ["project 02 title", "Custom CNN Architectures for Histopathological Cancer Classification"],
  ["project 02 accuracy", "accuracy (97.1% precision, 97.0% recall, 97.0% F1) with the Custom EfficientNet"],
  ["project 03 planners", "A*, Dijkstra, BFS, DFS, Greedy Best-First, Bidirectional, Jump Point Search"],
  ["project 04 title", "Flight Price Prediction — Deployed ML Web Application"],
  ["project 05 datasets", "four independently sourced agricultural datasets"],
  ["project 06 clustering", "four clustering algorithms with deliberately incompatible assumptions"],
  ["skills: geometry", "3D Geometry (Procrustes/Umeyama/GPA)"],
  ["skills: trc export", ".trc Export (Vicon Nexus / Visual3D / OpenSim)"],
  ["cert in-progress", "AWS Certified Machine Learning Engineer – Associate (MLA-C01)"],
  ["achievement 1", "Identified a geometric error affecting all 10 trials of a markerless motion capture benchmark"],
  ["email", "mohanakushal.de2024@gmail.com"],
  ["phone", "+49 1551 0425067"],
  ["location", "Erlangen, Germany"],
];

const LINKS = [
  "https://github.com/StonageBanana",
  "https://www.linkedin.com/in/mohana-kuhsal-simhadri-177205200/",
  "https://github.com/StonageBanana/Movement-Analyses-sam3d-vs-mocap",
  "https://github.com/StonageBanana/Customized-CNNs-for-Precise-Lung-Cancer-Classification",
  "https://github.com/StonageBanana/Pathfinding-Algorithms",
  "https://github.com/StonageBanana/Flight-Price-Prediction-SmartBridge-Internship---Applied-Data-Science",
  "https://stonagebanana04-flight-price-prediction.static.hf.space",
  "https://github.com/StonageBanana/Crop-Yield-Prediction",
  "https://github.com/StonageBanana/Novel-Customer-Segmentation-on-Credit-Card-Customer-Details",
];

/**
 * Corrections that must not be silently undone.
 *
 * Scoped with a regex rather than a bare substring: "Apr 2023" is *correct*
 * elsewhere on the page (the credit-card segmentation project), so only the
 * NASSCOM card is checked.
 */
const GUARDS = [
  {
    label: "NASSCOM certificate date",
    // Issuer chip, then title, then date — within one card.
    re: /NASSCOM FutureSkills[\s\S]{0,160}?(Apr|May) 2023/,
    expect: "May",
    why: "the certificate is dated 21/05/2023 (ref FSP/2023/5/3714427)",
  },
];

/**
 * Claims the repo disproves. These were on the site before the flight-price
 * project was rewritten and must not come back: the project benchmarks six
 * regressors (no CatBoost, no XGBoost), tops out at 0.833 R², and deploys a
 * browser-side Gradient Boosting model rather than a Streamlit app.
 */
const DISPROVEN = [
  // The seminar fix reprojected joint angles onto mocap's pelvis frame. It
  // never restored hip width — the keypoints stay compressed at 44%, and the
  // repo is explicit that "joint positions were fine; the frame they were
  // expressed in was not". This caption claimed a correction that didn't happen.
  "hip width 44% → 100%",
  // NOTE: TensorFlow/Keras are deliberately NOT banned outright. The CNN
  // notebook imports torch/cv2/sklearn and neither TF nor Keras, so they were
  // removed from that project's tech tags — but they remain in the skills list
  // and About paragraph as general competence, which is a claim about the
  // author rather than about a repo. Banning the words here would fail on those.
  "Selected CatBoost",
  "CatBoost flight-price model",
  "96% R²",
  "8 regression algorithms",
  "eight regression algorithms",
  "Streamlit app on Hugging Face",
  "via Streamlit with a recorded video walkthrough",
];

let fail = 0;
for (const claim of DISPROVEN) {
  if (text.includes(claim)) {
    fail++;
    console.log(
      `DISPROVEN  "${claim}" is on the page — the flight-price repo contradicts it`,
    );
  }
}
for (const g of GUARDS) {
  const m = text.match(g.re);
  if (!m) {
    fail++;
    console.log(`GUARD  ${g.label}: could not locate the card at all`);
  } else if (m[1] !== g.expect) {
    fail++;
    console.log(
      `REGRESSED  ${g.label}: found "${m[1]} 2023", expected "${g.expect} 2023" — ${g.why}`,
    );
  }
}
for (const [label, expected] of EXPECT) {
  const needle = expected.replace(/\s+/g, " ");
  if (!text.includes(needle)) {
    fail++;
    console.log(`MISSING  ${label}`);
    for (let n = needle.length; n > 20; n -= 8) {
      if (text.includes(needle.slice(0, n))) {
        console.log(`   ok up to:      ...${needle.slice(Math.max(0, n - 55), n)}`);
        console.log(`   then expected: ${needle.slice(n, n + 55)}`);
        break;
      }
    }
  }
}
for (const href of LINKS) {
  if (!html.includes(href)) {
    fail++;
    console.log(`MISSING LINK  ${href}`);
  }
}

if (fail === 0) {
  console.log(
    `PASS - ${EXPECT.length} copy blocks + ${LINKS.length} links verbatim, ${GUARDS.length} regression guard(s) clear`,
  );
} else {
  console.log(`${fail} FAILURES`);
  process.exit(1);
}
