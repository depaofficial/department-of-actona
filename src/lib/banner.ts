/**
 * Resolves a banner/thumbnail image URL with a fallback to the site's
 * default background images inside src/images when a post has no image.
 */
import bgWide from "../images/BG_.png";
import bgSquare from "../images/BG_square.png";
import { url } from "./url";

type MediaItem = { type?: string; src?: string } | undefined;

/** Full banner (hero-wide, article header). Falls back to BG_.png. */
export function bannerSrc(media: MediaItem): string {
  if (media?.type === "image" && media.src) return url(media.src);
  return bgWide.src;
}

/** Small square thumbnail. Falls back to BG_square.png. */
export function thumbSrc(media: MediaItem): string {
  if (media?.type === "image" && media.src) return url(media.src);
  return bgSquare.src;
}