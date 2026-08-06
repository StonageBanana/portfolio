/**
 * Declared asset paths, relative to `public/`. None of these need to exist —
 * `lib/assets.server.ts` checks existence on the build machine and every
 * consumer renders a designed fallback when the file is absent.
 *
 * To add a real asset: drop the file at the declared path and redeploy.
 * No code change is required.
 */
export const declaredAssets = {
  headshot: {
    path: "headshot.jpg",
    alt: "Simhadri Mohana Kushal",
  },
  cv: {
    path: "cv.pdf",
  },
  certificates: {
    "aws-ccp": { path: "certificates/aws_cloud_practitioner.jpg" },
    smartbridge: { path: "certificates/smartbridge_externship.jpg" },
    leaps: { path: "certificates/leaps_analyttica.jpg" },
    nasscom: { path: "certificates/nasscom_futureskills.jpg" },
    "kaggle-python": { path: "certificates/kaggle_python.jpg" },
  },
} as const;

export type CertificateAssetId = keyof typeof declaredAssets.certificates;

/** Shape produced by `resolveAssets()` and threaded down from the server. */
export interface ResolvedAssets {
  headshot: string | null;
  cv: string | null;
  certificates: Record<string, string | null>;
}
