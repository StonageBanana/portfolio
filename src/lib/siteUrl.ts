/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL in Vercel once the real domain is
 * attached; the Vercel-provided URL is used as a fallback so preview
 * deployments still emit correct absolute URLs.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
