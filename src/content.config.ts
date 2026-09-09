import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

const pageStatus = z.enum(["AVAILABLE", "RESTRICTED", "WITHHELD", "MISSING"]);

const documentPage = z.object({
  status: pageStatus,
  image: z.string().optional(),
  caption: z.string().optional(),
});

const documentFile = z.object({
  id: z.string(),
  title: z.string(),
  classification: z.enum(["PUBLIC", "RESTRICTED", "WITHHELD"]).default("PUBLIC"),
  version: z.number().default(1),
  versionLabel: z.string().optional(),
  pages: z.array(documentPage).default([]),
  downloadUrl: z.string().optional(),
});

// Attachment: any file type the visitor can download
const attachment = z.object({
  filename: z.string(),   // display name, e.g. "Site survey, page 1.jpg"
  src: z.string(),         // path under /public, e.g. /files/act-arc-001/survey.pdf
  type: z.enum(["pdf", "jpg", "jpeg", "png", "mp4", "mp3", "video", "audio", "image", "other"]),
  size: z.string().optional(), // human-readable, e.g. "2.4 MB"
  description: z.string().optional(),
});

// Banner item for news articles (first is primary; can be image or video)
const bannerItem = z.object({
  type: z.enum(["image", "video"]),
  src: z.string(),
  caption: z.string().optional(),
  poster: z.string().optional(), // video thumbnail
});

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

const news = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/news" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    department: z.string().default("Department of ACTONA"),
    summary: z.string(),
    body: z.array(z.string()),
    banner: bannerItem.optional(),       // ← hero image/video at top of article
    media: z.array(z.object({            // inline body media (kept for compat)
      type: z.enum(["image", "video"]),
      src: z.string(),
      caption: z.string().optional(),
      poster: z.string().optional(),
    })).default([]),
    relatedRecords: z.array(z.string()).default([]),
    breaking: z.boolean().default(false),
    live: z.boolean().default(false),
    published: z.boolean().default(true),
  }),
});

// ---------------------------------------------------------------------------
// Archive
// ---------------------------------------------------------------------------

const archive = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/archive" }),
  schema: z.object({
    archiveId: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    category: z.string(),
    status: z.enum(["PUBLIC","UNDER INVESTIGATION","UNDER REVIEW","RESTRICTED","WITHHELD"]),
    description: z.string(),
    media: z.array(z.object({
      type: z.enum(["image", "video"]),
      src: z.string(),
      caption: z.string().optional(),
      poster: z.string().optional(),
    })).default([]),
    attachments: z.array(attachment).default([]),   // ← downloadable file list
    documents: z.array(documentFile).default([]),
    relatedRecords: z.array(z.string()).default([]),
    source: z.string().optional(),
    lastRevised: z.coerce.date().optional(),
    published: z.boolean().default(true),
  }),
});

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

const people = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/people" }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    position: z.string(),
    department: z.string().default("Department of ACTONA"),
    biography: z.array(z.string()),
    reports: z.array(z.string()).default([]),
    associatedResearch: z.array(z.string()).default([]),
    photo: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

// ---------------------------------------------------------------------------
// Notices
// ---------------------------------------------------------------------------

const notices = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/notices" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    body: z.array(z.string()),
    severity: z.enum(["INFORMATION", "CORRECTION", "ADVISORY"]).default("INFORMATION"),
    published: z.boolean().default(true),
  }),
});

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------

const research = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/research" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    category: z.enum([
      "ARCHAEOLOGY","HISTORICAL SOCIETIES","RELIGIOUS SYMBOLS",
      "ARCHIVAL ANALYSIS","ANTHROPOLOGY","UNIDENTIFIED MATERIALS",
    ]),
    status: z.enum(["ONGOING", "CLOSED", "SUSPENDED", "RESTRICTED"]),
    summary: z.string(),
    body: z.array(z.string()).default([]),
    relatedRecords: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

// ---------------------------------------------------------------------------
// Settings (single file, e.g. home.json) — editable without touching code
// ---------------------------------------------------------------------------

const settings = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/settings" }),
  schema: z.object({
    key: z.string(),
    slogan: z.string().optional(),
    breakingEnabled: z.boolean().default(false),
    breakingLabel: z.string().default("Breaking"),
    breakingUrl: z.string().optional(),
    breakingText: z.string().optional(),
    liveEnabled: z.boolean().default(false),
    liveLabel: z.string().default("Live"),
    liveUrl: z.string().optional(),
    liveText: z.string().optional(),
  }),
});

export const collections = { news, archive, people, notices, research, settings };
