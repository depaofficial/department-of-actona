import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { url } from "../lib/url";

export const prerender = true;

type SearchItem = {
  kind: "News" | "Archive" | "Research" | "Person";
  id: string;
  title: string;
  summary: string;
  href: string;
};

export const GET: APIRoute = async () => {
  const [news, archive, research, people] = await Promise.all([
    getCollection("news", ({ data }) => data.published),
    getCollection("archive", ({ data }) => data.published),
    getCollection("research", ({ data }) => data.published),
    getCollection("people", ({ data }) => data.published),
  ]);

  const items: SearchItem[] = [
    ...news.map((e) => ({
      kind: "News" as const,
      id: e.data.id,
      title: e.data.title,
      summary: e.data.summary,
      href: url(`/news/${e.id}/`),
    })),
    ...archive.map((e) => ({
      kind: "Archive" as const,
      id: e.data.archiveId,
      title: e.data.title,
      summary: e.data.description,
      href: url(`/archive/${e.id}/`),
    })),
    ...research.map((e) => ({
      kind: "Research" as const,
      id: e.data.category,
      title: e.data.title,
      summary: e.data.summary,
      href: url(`/research/${e.id}/`),
    })),
    ...people.map((e) => ({
      kind: "Person" as const,
      id: e.data.position,
      title: e.data.name,
      summary: e.data.biography[0] ?? "",
      href: url(`/people/${e.id}/`),
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
