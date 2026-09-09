// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
//
// GitHub Pages deployment notes (see README.md for the full walkthrough):
//
// - Project site (https://<user>.github.io/<repo>/):
//     site: "https://<user>.github.io",
//     base: "/<repo>",
//
// - User/organisation site (https://<user>.github.io/):
//     site: "https://<user>.github.io",
//     base: "/",
//
// - Custom domain (with a CNAME file in /public):
//     site: "https://your-domain.example",
//     base: "/",
export default defineConfig({
  site: "https://actona-mp3.github.io",
  base: "/department-of-actona",
  trailingSlash: "always",
});
