import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { declaredAssets, type ResolvedAssets } from "@/content/assets";

/**
 * Resolves which declared assets actually exist.
 *
 * The site is statically prerendered, so this runs on the BUILD machine and
 * only the resulting booleans/strings are serialised into the RSC payload —
 * no `fs` ever reaches the browser graph. `import "server-only"` makes it a
 * hard build error if a client component ever imports this, which is the
 * safety net that keeps it that way.
 *
 * Consequence: dropping a file into `public/` and redeploying is enough. There
 * is no code change, and no component ever renders a broken image.
 */
export function resolveAssets(): ResolvedAssets {
  const has = (p: string) => existsSync(join(process.cwd(), "public", p));

  return {
    headshot: has(declaredAssets.headshot.path)
      ? `/${declaredAssets.headshot.path}`
      : null,
    cv: has(declaredAssets.cv.path) ? `/${declaredAssets.cv.path}` : null,
    certificates: Object.fromEntries(
      Object.entries(declaredAssets.certificates).map(([id, a]) => [
        id,
        has(a.path) ? `/${a.path}` : null,
      ]),
    ),
  };
}
