import { getCollection } from "astro:content";
import { url } from "./url";

export type ResolvedRef = {
  id: string;
  title: string;
  href: string;
  kind: "archive" | "news" | "research" | "person";
};

let cache: Map<string, ResolvedRef> | null = null;

/**
 * Builds a lookup table from every display-facing ID (archive IDs, case
 * numbers, news IDs, research slugs, person slugs) to its page URL, so any
 * "related records" list can be turned into working links without every
 * content file needing to know its own URL.
 */
export async function getReferenceIndex(): Promise<Map<string, ResolvedRef>> {
  if (cache) return cache;

  const [archive, news, research, people] = await Promise.all([
    getCollection("archive"),
    getCollection("news"),
    getCollection("research"),
    getCollection("people"),
  ]);

  const map = new Map<string, ResolvedRef>();

  for (const entry of archive) {
    map.set(entry.data.archiveId, {
      id: entry.data.archiveId,
      title: entry.data.title,
      href: url(`/archive/${entry.id}/`),
      kind: "archive",
    });
  }

  for (const entry of news) {
    const ref = {
      id: entry.data.id,
      title: entry.data.title,
      href: url(`/news/${entry.id}/`),
      kind: "news" as const,
    };
    map.set(entry.data.id, ref);
    map.set(entry.id, ref);
  }

  for (const entry of research) {
    map.set(entry.data.slug, {
      id: entry.data.slug,
      title: entry.data.title,
      href: url(`/research/${entry.id}/`),
      kind: "research",
    });
  }

  for (const entry of people) {
    map.set(entry.data.slug, {
      id: entry.data.slug,
      title: entry.data.name,
      href: url(`/people/${entry.id}/`),
      kind: "person",
    });
  }

  cache = map;
  return map;
}
