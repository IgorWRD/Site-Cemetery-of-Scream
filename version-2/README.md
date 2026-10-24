# Cemetery of Scream — official website (version 2)

A bilingual, static, editorial website for the Kraków doom / gothic metal band Cemetery of Scream. No framework, no build step, no external runtime dependencies.

The design direction is an **archival programme**: near-black, oxblood and warm brown surfaces, one restrained blood-red accent, self-hosted type, real archive photography, a master-detail discography and a cinematic photo filmstrip. There are no light page sections; every surface is dark and all text is light.

## Structure

```text
web-page-wersion2/
├─ index.html                  language gate (PL / EN)
├─ pl/index.html               Polish version
├─ en/index.html               English version
├─ assets/
│  ├─ css/tokens.css           design tokens (colour, type, spacing, motion)
│  ├─ css/styles.css           layout, components, sections, responsive rules
│  ├─ js/site.js               menu, reveals, discography, gallery, lightbox, copy
│  ├─ fonts/                   self-hosted WOFF2 (Barlow, Barlow Condensed,
│  │                           Cormorant Garamond, IBM Plex Mono — OFL)
│  ├─ img/
│  │  ├─ covers/               eight album covers
│  │  ├─ gallery/live/         full-size live photographs
│  │  ├─ gallery/thumbs/       720 px filmstrip/archive thumbnails
│  │  ├─ hero-stage.jpg        landing hero crop (logo removed)
│  │  ├─ band-session.jpg      Oceans photo session
│  │  ├─ archive-*.jpg         archival images
│  │  └─ logo-white.png        official logo, white
│  └─ press/                   press kit ZIP + individual assets
├─ robots.txt
├─ site.webmanifest
├─ README.md
├─ PLAN.md                     design analysis, decisions and open questions
└─ ANALYTICS.md                privacy-friendly analytics guide (not active yet)
```

## Run locally

No build step. Serve the folder over HTTP — do **not** open `index.html` directly via `file://`, because Chrome blocks webfonts and the web manifest for local files (the console fills with CORS errors).

From the project folder (one level above `web-page-wersion2/`), double-click `preview.cmd`, or run:

```powershell
.\preview.ps1
```

It starts `http://localhost:8137/` and opens the browser. Closing the preview window stops the server. The site uses only relative paths and works from any static server or subdirectory.

## Language architecture

- `/` is a neutral language gate. It is not a redirect: the visitor chooses **Polski** or **English**.
- `/pl/` and `/en/` are parallel pages with `hreflang` links and a language switch.
- All visible copy, image alt text, captions, metadata and lightbox labels are localised.
- Do not add automatic language redirects; they break shared promo links and are bad for international booking.

## Content layout

- **Biography:** all-dark archival section. The four chapters sit in a vertical index on the left (1992—1995, 1995—2000, 2005—2009, 2012—2023, in chronological order); selecting one opens the matching text in the right-hand panel. The list is sticky on desktop and stacks above the panel on mobile.
- **Discography:** master-detail, not an accordion. The full eight-release list is always visible in the left column and stays sticky on desktop; selecting a release changes only the right-hand panel, which shows the cover, then the full tracklist, then the album description and metadata. On mobile the list sits above the panel and selecting a release scrolls the panel into view.
- **No light page sections:** the biography, press kit and all other surfaces are dark. Buttons, hover states, stickers and active tabs use oxblood/burgundy instead of light fills; all text is light on dark.
- **Back to top:** a fixed 35 px square button with 10 px rounded corners in the bottom-right corner appears after roughly 75% of the viewport has been scrolled and links to `#top`. It is a translucent dark-glass tile with a blurred backdrop, bevelled highlights, scaled-down drop shadows and an embossed up arrow; it lifts on hover and presses in on click. The target exceeds the 24 px WCAG 2.2 minimum, is keyboard focusable and respects reduced motion. The old inline footer link was removed to avoid duplication.
- **Anchor navigation:** menu jumps cancel the section’s top padding, so the section label arrives about 20 px below the fixed header instead of after an empty band. The offset follows `--header-h` and `--section-y`, so it holds on desktop, short viewports and mobile; direct `#hash` links and the mobile menu use the same rule.

## Content sources

- **Biography:** `_info/COS-Bio-PL.rtf` (Polish full bio) and `_info/COS - short bio PL.rtf` (short bio), edited into four chapters and translated into English.
- **Discography and tracklists:** `_info/cemetery-of-scream-discography/discography.md`.
- **Covers:** `_info/cemetery-of-scream-discography/covers/`.
- **Photography:** `_info/from galery/` (Garage Świrek, Zaczek), `_info/from internet/` (archive), `_info/hero23_photo.jpg` (landing).
- **Logo:** `_info/COS-logo Nowe/`.

### Discography notes

- `Sameone` — demo, 1993, 9 tracks, 31:27; CD reissue by Metal Mind in 2003.
- `Melancholy` — original 1995 edition and 2003 remaster have 12 tracks. The page shows the **expanded 2021 reissue tracklist (18 tracks)** and both covers (1995 and 2021). The 2021 total time is 1:14:34, calculated from the supplied track durations.
- `Deeppression` — Polish release 1997, European release 1998; displayed as **1997/98**.
- `Fin de siècle` — EP, 1999, 6 tracks.
- `Prelude to a Sentimental Journey` — released 20 October 2000 by Mystic Production; 15-track version, with `Radioactive Toy` as an edition-dependent bonus.
- `The Event Horizon` — 2006, Metal Mind Productions, 10 tracks.
- `Frozen Images` — 26 January 2009, Metal Mind Productions, 12 tracks. The Moody Blues cover is spelled **Nights in White Satin** (the supplied note wrote “Night in White Satin”).
- `Oceans` — 3 November 2023, Sleaszy Rider Records, SR-0326, 13 tracks, 1:09:53.
- Some catalogues spell the `Sameone` track as “Apocaliptic Visions”; the page uses the normalized “Apocalyptic Visions” and notes the variant.
- `A Million as One (As a Million)` is kept in the form used by the supplied discography document.

## Gallery

- 24 live photographs in the horizontal filmstrip (15 Garage Świrek + 9 landscape Zaczek).
- 6 archival images in the mosaic: 1997 band photo, Black Wave Fest, Oceans session, early line-up, and two portrait Zaczek frames.
- Full-size images open in a native `<dialog>` lightbox with keyboard arrows, Escape, backdrop click, captions and credits.
- The filmstrip uses native scroll-snap, arrow buttons, keyboard arrows and mouse drag. No autoplay.
- Thumbnails are 720 px wide (3:2 crop for landscape); full images are the supplied files, capped at 1600 px for the session photo.
- **Credits:** Paweł Świrek (Garage Świrek), Zaczek / Klub Studencki (Zaczek), band archive. Confirm final credit wording with the band before launch.

## Press kit

`assets/press/cos-press-kit.zip` (≈2.5 MB) contains:

- short bio PL / EN;
- `Oceans` photo session in two sizes (1600 px and the original 2048 px);
- promotional portrait (700 px);
- wide band photograph (1643 px);
- wide banner (2048 px);
- two live photographs: Zaczek (1500 px) and Garage Świrek (1279 px);
- white and black logos as PNG (transparent) and SVG;
- editable CorelDRAW logo master (`cos-logo-master.cdr`);
- `Oceans` cover;
- **technical rider template** (PDF, 3 pages) and an editable stage-plot SVG;
- README with contacts, credits and usage notes.

The SVG logos embed the supplied high-resolution PNG artwork, so they are ready for web use but are not true vector paths. The editable master is the CDR. If a clean vector SVG is available from CorelDRAW, replace both SVG files.

The technical rider and stage plot are **templates**, not approved requirements. Replace every bracketed field, confirm the input list, stage dimensions, backline, monitors and hospitality with the band, and approve the final document before sending it to promoters.

The individual files are also available in `assets/press/`. When you change any of them, rebuild the ZIP.

## Booking and contact

The site currently routes booking to the official **Bandsintown** artist page and **Facebook**, and label/press enquiries to **Sleaszy Rider Records**. There is no published e-mail address because none was supplied and verified.

If a booking e-mail is confirmed:

1. add it to the contact list in both language pages;
2. add it to the press kit README;
3. optionally add a short `mailto:` CTA in the live section.

## Privacy-friendly analytics

Analytics is **not active**. The site currently sets no cookies and has no third-party trackers or consent banner. A commented integration point is present before `site.js` on all three pages.

See `ANALYTICS.md` for a plain-language guide. Recommended options:

- **Cloudflare Web Analytics** — free, cookieless, no banner; simplest if hosting on Cloudflare;
- **Plausible** — paid, cookieless, simple dashboard, EU hosting;
- **Umami** — self-hosted, free, more technical.

Activate only after the production domain is known. Then add the provider snippet, a short privacy page (PL/EN) and a footer link. Do not use Google Analytics or Meta Pixel for this site.

## Live section

The site currently states **no confirmed upcoming dates** and lists the two most recent verified shows:

- 19.06.2025 — Bielsko-Biała, Rudeboy Club
- 05.04.2025 — Rzeszów, Pub Spółdzielczy

When new dates are confirmed, replace the empty-state block with a dated table (date, city, venue, ticket URL) in both languages. Do not publish unconfirmed dates.

## Line-up

The line-up block lists the musicians credited on `Oceans` (2023):

- Olaf Różański — vocals
- Marcin Piwowarczyk — guitar
- Paweł Góralczyk — guitar
- Katarzyna Rutkowska — keyboards
- Grzegorz Królik — bass
- Tomasz Rutkowski — drums

The page explicitly says the live line-up may vary. Confirm the current line-up with the band before treating this as a permanent roster.

## Technical notes

- **Fonts:** self-hosted WOFF2 with `latin` and `latin-ext` subsets. Licences: SIL Open Font License via Google Fonts.
- **Accessibility:** skip link, landmarks, one H1 per page, WAI-ARIA tab groups (`role="tablist"`, `aria-selected`, `aria-controls`, roving tabindex, arrow/Home/End keys) for the biography and discography, focus-visible rings, keyboard lightbox and filmstrip, reduced-motion support, no autoplay media.
- **Progressive enhancement:** without JavaScript, the tab lists are hidden and every biography chapter / album panel is visible in a stacked reading layout; gallery images open directly, and the mobile navigation is shown via a `<noscript>` fallback. The mobile menu, lightbox and copy-bio button are enhancements.
- **Performance:** LCP images preloaded, fonts preloaded, gallery lazy-loaded, no third-party embeds, no analytics, no cookies.
- **Images:** `width`/`height` set on all images to prevent layout shift. The Oceans cover in the open discography panel is eager; other covers are lazy.
- **SEO:** unique titles/descriptions, OG/Twitter metadata, JSON-LD `MusicGroup`, `hreflang`. Add canonical, absolute OG URLs and a sitemap after the production domain is chosen.
- **Indexing:** `robots.txt` allows crawling; pages use `index, follow`. Remove/change if the band wants a private draft.

## QA status

- **W3C Nu HTML Checker:** 0 errors, 0 warnings on `/`, `/pl/` and `/en/`.
- **axe-core 4.10 (WCAG 2.1/2.2 A/AA):** 0 violations on all three pages. Contrast checks that depend on a photograph are reported as “incomplete” by axe and need a human eye; the main text/background pairs pass.
- **Local link check:** 228 local references checked (including the technical rider template), 0 missing files or broken anchors.
- **External links:** all verified URLs return 200 in a browser, except Bandsintown which blocks automated HEAD requests (403) but is reachable normally.
- **Console:** no JavaScript warnings or errors on `/`, `/pl/` or `/en/`.
- **Responsive:** visually checked at 320, 390, 1024 and 1440 px, plus 720/980 breakpoint rules.
- **Interaction:** biography chapter tabs, discography master-detail tabs, gallery arrows/counter, lightbox close/arrow navigation, mobile menu open/Escape/focus return, back-to-top show/hide/click and copy-bio handler were tested.
- **Performance snapshot (localhost, PL):** ~630 KB of critical resources including the preloaded hero and session images, 18 requests, DOMContentLoaded ~0.6 s, load ~1.0 s; gallery images lazy-load below the fold.

## Open launch decisions

1. Production domain and hosting.
2. Confirmed booking/press e-mail (if one should be public).
3. Current line-up confirmation.
4. Upcoming dates and ticket links.
5. Final photographer credits and image rights.
6. Album artwork rights confirmation with labels.
7. Whether the root language gate should remember the last choice.
8. Which privacy-friendly analytics provider to activate when hosting is chosen (Cloudflare Web Analytics or Plausible recommended); add the privacy page at the same time.
9. Whether to add a lyrics section, video section or merch links.
10. Final technical rider requirements — the current PDF and stage plot are templates; the band must confirm the input list, stage dimensions, backline, monitors and hospitality.

See `PLAN.md` for the design analysis and rationale.
