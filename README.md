# Department of ACTONA — Official Information Portal

A static, content-driven website built with [Astro](https://astro.build). It is
designed to read as a plain, credible institutional archive site — no game
language, no spooky styling — while being structured underneath to support an
ARG that unfolds gradually through the content you add over time.

You do not need to know how to code to add new content. You edit small JSON
files; the website builds itself around them.

---

## 1. What's in this project

| Section   | Purpose                                                        |
| --------- | --------------------------------------------------------------- |
| News      | Official announcements, dated articles                          |
| Archive   | The public record database (documents, photos, PDFs, metadata)  |
| Cases     | Case files that group related archive records and news together |
| Research  | Research subjects, grouped by category                          |
| People    | Employee / researcher profiles                                  |
| Notices   | Short public notices shown on the homepage                      |

Every one of these is just a folder of JSON files under `src/content/`. Add a
file, and a new page appears automatically — you never touch the page
templates.

## 2. Project structure

```
actona/
├── src/
│   ├── content/               ← YOU EDIT THIS. One JSON file per entry.
│   │   ├── news/
│   │   ├── archive/
│   │   ├── cases/
│   │   ├── people/
│   │   ├── notices/
│   │   └── research/
│   ├── content.config.ts      ← defines the fields each content type has
│   ├── components/            ← reusable UI pieces (badges, tables, viewer)
│   ├── layouts/BaseLayout.astro
│   ├── lib/                   ← small helpers (dates, cross-linking, base URL)
│   ├── pages/                 ← routes; reads from src/content automatically
│   └── styles/global.css      ← the whole visual identity lives here
├── public/                    ← images, PDFs, favicon — served as-is
├── .github/workflows/deploy.yml   ← auto-deploys to GitHub Pages on push
└── astro.config.mjs           ← site URL / base path (see deployment below)
```

## 3. Running it locally

You need [Node.js](https://nodejs.org) 22 or later installed.

```sh
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:4321`). Edit any file in
`src/content/` and the browser updates automatically.

To build the production version (what actually gets deployed):

```sh
npm run build
npm run preview   # serve the built site locally to double-check it
```

## 4. Adding content

Every content file is a plain JSON object. Copy an existing file in the
relevant folder, rename it, and edit the fields. The filename itself doesn't
matter for the ID shown on the site — the `archiveId` / `caseId` / `id`
field inside the file is what's displayed and linked to.

### 4.1 News (`src/content/news/*.json`)

```json
{
  "id": "ACTONA NEWS 002",
  "title": "Second Excavation Report Published",
  "date": "2026-10-02",
  "department": "Department of ACTONA",
  "summary": "One or two sentences shown in listings.",
  "body": ["First paragraph.", "Second paragraph.", "Third paragraph."],
  "media": [],
  "relatedRecords": ["ACT-ARC-001"],
  "relatedCases": ["CASE-001"],
  "published": true
}
```

Set `"published": false` to prepare an article without it appearing on the
site yet.

### 4.2 Archive records (`src/content/archive/*.json`)

This is the core of the site. `status` controls the badge shown; it must be
one of `PUBLIC`, `UNDER INVESTIGATION`, `UNDER REVIEW`, `RESTRICTED`,
`WITHHELD`.

```json
{
  "archiveId": "ACT-ARC-002",
  "title": "Recovered Photograph, Site 4",
  "date": "2026-09-25",
  "location": "Excavation Site 4",
  "category": "PHOTOGRAPHIC MATERIAL",
  "status": "UNDER REVIEW",
  "description": "Plain descriptive paragraph.",
  "media": [
    { "type": "image", "src": "/images/act-arc-002/photo-1.jpg", "caption": "Optional caption." }
  ],
  "documents": [],
  "relatedRecords": ["ACT-ARC-001"],
  "relatedCases": ["CASE-001"],
  "source": "Field Recovery Unit 2",
  "published": true
}
```

Put image/video/PDF files under `public/` (e.g. `public/images/act-arc-002/photo-1.jpg`)
and reference them with a path starting `/`, exactly as above.

### 4.3 Documents inside an archive record

A single archive record can carry one or more scanned/paginated documents,
each with independently controllable page status. This is how you make a
page restricted, withheld, or missing without writing any extra explanation
— the badge alone does the work:

```json
"documents": [
  {
    "id": "ACT-DOC-003",
    "title": "Laboratory Analysis, Preliminary",
    "classification": "RESTRICTED",
    "version": 2,
    "versionLabel": "Corrected",
    "downloadUrl": "/files/act-doc-003.pdf",
    "pages": [
      { "status": "AVAILABLE", "image": "/images/act-doc-003/p1.jpg", "caption": "Cover sheet." },
      { "status": "RESTRICTED" },
      { "status": "MISSING" }
    ]
  }
]
```

Page `status` must be one of `AVAILABLE`, `RESTRICTED`, `WITHHELD`, `MISSING`.
Only `AVAILABLE` pages need an `image`; the others render a plain placeholder
automatically.

To publish a corrected version of a document later, just add a second object
to the `documents` array with a higher `version` number — both stay visible,
in order, on the record's page. That's the "document revisions" mechanic
from the brief.

### 4.4 Cases (`src/content/cases/*.json`)

`status` is one of `ONGOING`, `CLOSED`, `RESTRICTED`, `SUSPENDED`. A
`RESTRICTED` case can have a very short `description` and an empty
`timeline` — the page will simply show less, which is intentional.

```json
{
  "caseId": "CASE-002",
  "title": "Society of the Dusk Investigation",
  "status": "RESTRICTED",
  "openingDate": "2026-10-10",
  "description": "Limited information available at this time.",
  "associatedDocuments": [],
  "associatedNews": [],
  "associatedPeople": [],
  "timeline": [],
  "published": true
}
```

### 4.5 People (`src/content/people/*.json`)

```json
{
  "slug": "susan-cobewell",
  "name": "Susan Cobewell",
  "position": "Research Reporter",
  "department": "Department of ACTONA",
  "biography": ["Paragraph one.", "Paragraph two."],
  "reports": ["ACT-FLD-001"],
  "associatedResearch": ["historical-materials"],
  "published": true
}
```

### 4.6 Notices (`src/content/notices/*.json`)

```json
{
  "id": "NOTICE-002",
  "title": "Temporary Access Restriction",
  "date": "2026-10-05",
  "body": ["Plain bureaucratic paragraph."],
  "severity": "ADVISORY",
  "published": true
}
```

`severity` is `INFORMATION`, `CORRECTION`, or `ADVISORY` — it doesn't change
the styling dramatically (no red alert banners by default), it's just for
your own bookkeeping.

### 4.7 Research (`src/content/research/*.json`)

`category` must be one of: `ARCHAEOLOGY`, `HISTORICAL SOCIETIES`,
`RELIGIOUS SYMBOLS`, `ARCHIVAL ANALYSIS`, `ANTHROPOLOGY`,
`UNIDENTIFIED MATERIALS`. This is where a subject like "Society of the Dusk"
can first appear as a low-key research entry rather than a dedicated page.

```json
{
  "slug": "society-of-the-dusk",
  "title": "Society of the Dusk",
  "category": "HISTORICAL SOCIETIES",
  "status": "ONGOING",
  "summary": "One-sentence institutional description, kept minimal.",
  "body": [],
  "relatedRecords": [],
  "relatedCases": [],
  "published": true
}
```

### 4.8 Cross-references

Anywhere you write `"relatedRecords": [...]`, `"relatedCases": [...]`, etc.,
just use the exact display ID (`ACT-ARC-001`, `CASE-001`, `ACTONA NEWS 001`,
a research `slug`, or a person `slug`). The site resolves it into a working
link automatically at build time — you never write a URL by hand. If an ID
doesn't exist yet (a document you haven't published), it's simply skipped,
so you can reference future content without breaking the build.

### 4.9 A note on the album title

Per the brief: never put the real project title anywhere in content files.
Use the field value `"PROJECT FILE"` or `"UNPUBLISHED MATERIAL"` wherever a
placeholder is needed. Nothing in the current schema requires the title, so
there's nothing to accidentally leak.

## 5. Search

Search is fully static — no backend, no database. At build time, every
published news item, archive record, case, research subject and person is
compiled into `/search-index.json`. The `/search` page fetches that file and
filters it in the browser. Add content, rebuild, and it's searchable
automatically.

## 6. Deploying to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds and deploys
the site automatically every time you push to `main`. You only need to do
two things once.

### Step 1 — Set the correct `site` and `base` in `astro.config.mjs`

Open `astro.config.mjs`. Which values you use depends on how you name your
GitHub repository:

**A. Repo named `<your-username>.github.io`** (a "user site", served at the
root domain):

```js
export default defineConfig({
  site: "https://<your-username>.github.io",
  base: "/",
  trailingSlash: "always",
});
```

**B. Any other repo name** (a "project site", served at `/repo-name/` — this
is the default and what's currently configured with the placeholder
`actona`):

```js
export default defineConfig({
  site: "https://<your-username>.github.io",
  base: "/<your-repo-name>",
  trailingSlash: "always",
});
```

All internal links in this project already go through a small helper
(`src/lib/url.ts`) that reads this `base` value, so once it's set correctly
here, every link, image, PDF and the search index will resolve correctly —
you don't need to edit anything else.

**C. Custom domain:** set `site` to your domain and `base: "/"`, then add a
file `public/CNAME` containing just your domain name, e.g. `actona.example`.

### Step 2 — Enable GitHub Pages via Actions

In your GitHub repository: **Settings → Pages → Build and deployment →
Source**, choose **GitHub Actions**. That's it — push to `main` and the
included workflow builds and publishes the site. The Actions tab shows
progress and the live URL.

### Redeploying after content changes

Just commit and push. Every push to `main` triggers a fresh build and
deploy — there's no separate "publish" step to remember.

## 7. Design tokens

Everything visual lives in `src/styles/global.css` as CSS variables:

| Token             | Hex       | Use                          |
| ------------------ | --------- | ----------------------------- |
| `--color-bg`        | `#F2F2EE` | Page background               |
| `--color-surface`   | `#FFFFFF` | Cards, headers, tables        |
| `--color-ink`       | `#17191A` | Body text                     |
| `--color-gray`      | `#7C8285` | Secondary text, borders       |
| `--color-accent`    | `#344D5C` | Links, nav, badges, buttons   |
| `--color-alert`     | `#7A2E2E` | Restricted/withheld badges only |

Typography: **IBM Plex Sans** for everything readable, **IBM Plex Mono** for
archive IDs, case numbers, dates and other metadata (applied via the `.mono`
class and inside metadata tables automatically). Both are self-hosted via
`@fontsource`, so the site has no external font requests.

## 8. What was tested before hand-off

- `npm run build` completes cleanly and generates all 14 routes
- Internal links, images and the search index correctly carry the
  configured `base` path (verified in the built HTML/JSON output)
- Mobile layout: nav wraps to a stacked list, footer collapses to one
  column, metadata tables narrow gracefully, document pages remain readable
- Archive filtering (text + category) and news filtering work client-side
  with no network requests
- Cross-references (`relatedRecords`, `relatedCases`, `associatedPeople`,
  etc.) resolve to working links or are silently skipped if the target
  doesn't exist yet
- Restricted / withheld / missing document pages render a placeholder with
  no explanatory text beyond the status itself

## 9. Adding the next phase of content

Nothing further needs to change in the code to move into Phase 2 (more
historical materials, Rosara, Society of the Dusk, photographs) — add new
JSON files following the patterns above. If a future phase needs a genuinely
new *kind* of content (not covered by news / archive / cases / people /
notices / research), extend the matching schema in `src/content.config.ts`
and the corresponding page template; everything else (routing, search,
cross-linking) will pick it up automatically.
