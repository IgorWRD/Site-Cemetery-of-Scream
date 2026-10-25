# Cemetery of Scream — project presentation

Start page that leads to three versions of the website plus a hosting landing page:

| Door | Folder | What it is |
|---|---|---|
| Version 1 | `version-1/` | Single-page site, Polish and English |
| Version 2 | `version-2/` | Complete bilingual site (PL / EN) with press kit |
| Version 3 | `version-3/` | "Black Requiem" concept, bilingual splash and site (PL / EN) |
| Hosting Page | `hosting/` | Minimal single-screen landing page with contacts |

Everything is static HTML, CSS and JavaScript — no build step, no dependencies.

## Structure

```
index.html              start page (background photo + four buttons)
css/landing.css         styles for the start page
assets/                 fonts, logo, background photo, favicon
version-1/              first design
version-2/              second design
version-3/              third design ("Black Requiem")
hosting/                hosting landing page
.nojekyll               serve files as-is on GitHub Pages
robots.txt              keep the presentation out of search engines
```

Every version carries a **Start** navigation item that returns to this start page.

## Local preview

Open `index.html` in a browser — no server required. Every internal link points to
an explicit `.html` file, so the presentation also works from `file://`.

## Publishing

The site is published with GitHub Pages from the `main` branch, repository root:

**https://igorwrd.github.io/Site-Cemetery-of-Scream/**

The landing page is marked `noindex` on purpose — these are design drafts, not the
official band website. Remove the meta tag in `index.html` and the `robots.txt`
rules when the final version goes live.

## Credits

Cemetery of Scream — Kraków, Poland. Doom / gothic metal, est. 1992.
