# Cemetery of Scream — project presentation

Start page that leads to three versions of the website:

| Door | Folder | What it is |
|---|---|---|
| Version 1 | `version-1/` | Single-page site, Polish and English |
| Version 2 | `version-2/` | Complete bilingual site (PL / EN) with press kit |
| Hosting Page | `hosting/` | Minimal single-screen landing page with contacts |

Everything is static HTML, CSS and JavaScript — no build step, no dependencies.

## Structure

```
index.html              start page (background photo + three buttons)
css/landing.css         styles for the start page
assets/                 fonts, logo, background photo, favicon
version-1/              first design
version-2/              second design
hosting/                hosting landing page
.nojekyll               serve files as-is on GitHub Pages
robots.txt              keep the presentation out of search engines
```

## Publishing

The site is published with GitHub Pages from the `main` branch, repository root:

**https://igorwrd.github.io/Site-Cemetery-of-Scream/**

The landing page is marked `noindex` on purpose — these are design drafts, not the
official band website. Remove the meta tag in `index.html` and the `robots.txt`
rules when the final version goes live.

## Credits

Cemetery of Scream — Kraków, Poland. Doom / gothic metal, est. 1992.
