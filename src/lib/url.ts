/**
 * Builds an internal link that respects Astro's configured `base` path.
 *
 * This matters for GitHub Pages project sites, which are served from
 * https://<user>.github.io/<repo>/ rather than the domain root. Astro does
 * not rewrite plain `href="/foo"` strings for you, so every internal link
 * in this project goes through this helper instead of a raw string.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/" or "/actona/"
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}
