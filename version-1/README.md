# Cemetery of Scream — website

A bilingual (Polish / English), static, booking-first site for the Kraków doom / gothic metal band Cemetery of Scream. Dark editorial direction: near-black surfaces, restrained blood-red accents, self-hosted type, archive photography and a deliberate, low-motion feel.

No framework, no build step, no external runtime dependencies. Open the site directly from disk or serve the folder with any static file server.

## Run locally

From `web-page/`:

```powershell
# Option A: open the PL home page directly
start index.html

# Option B: serve locally (if Python is available)
python -m http.server 8080
# then open http://localhost:8080/
```

There is no package manager, compilation step or generated output. Edit the HTML/CSS/JS in place.

## Structure

```text
web-page/
├─ index.html                 PL home page
├─ en/index.html              EN home page
├─ assets/
│  ├─ css/styles.css          all layout, components and responsive rules
│  ├─ js/config.js            booking email / external URLs
│  ├─ js/site.js              navigation, reveals, lightbox, booking brief
│  ├─ fonts/                  self-hosted WOFF2 (Google Fonts, OFL)
│  └─ img/                    album art, archive photographs and discography covers
│     └─ discography/          nine cover images for the catalogue
├─ robots.txt                 currently blocks indexing (draft)
└─ README.md
```

## Content status

The site is a **draft**. It deliberately avoids inventing a booking email, future tour dates, a downloadable EPK, a current line-up or official social accounts that the research did not verify.

- Factual copy is based on `_info/research-dossier.md`, `_info/sources.md`, `_info/Cemetery of Scream - info.docx`, the supplied album artwork and `_info/cemetery-of-scream-discography/`.
- The discography is a chronological catalogue of six studio albums, one EP and one demo, with release data, cover art and expandable tracklists. `Deeppression` is listed under 1997; its note mentions the 1998 Serenades edition for Europe.
- The 2021 *Melancholy* reissue is shown as a card inside the 1995 entry, with the expanded 18-track list.
- The band history uses **“early 1990s”** rather than choosing between 1992 and 1993.
- No current line-up section is published: sources conflict on the bassist and the keyboardist’s surname. Add one only after band confirmation.
- The Live section intentionally states that there are no confirmed upcoming dates. Do not add dates without confirmation, venue and ticket link.
- The EPK is offered **on request**; no PDF is presented as downloadable because no approved file was supplied.
- Photography is from the supplied archive. Photographer credits and publication rights still need to be confirmed.
- The site is marked `noindex, nofollow` and `robots.txt` disallows all crawling. Remove both once the band approves the content and launch.

## Booking behaviour

`assets/js/config.js` contains:

```js
window.COS_CONFIG = {
  bookingEmail: "",
  facebookUrl: "https://www.facebook.com/cemeteryofscream",
  labelContactUrl: "https://sleaszyrider.com/contact/"
};
```

With `bookingEmail` empty, the booking form:

1. validates the fields locally,
2. prepares a formatted booking brief,
3. copies it to the clipboard,
4. offers a link to the band’s Facebook page and keeps the full brief visible in a textarea.

When the band confirms an address, set `bookingEmail: "booking@example.com"`. The result panel will switch to an “Open email” action with the brief pre-filled, and the direct address will appear in the contact column. No data is sent or stored by the site itself.

The Facebook URL is used as the current contact route. Confirm ownership/activity with the band before launch.

## Replace or add content

- **Album art / photos:** replace files in `assets/img/` and update the `src`, `width`, `height` and `alt` attributes in both HTML pages.
- **Booking email:** edit `assets/js/config.js`.
- **Streaming links:** update the Apple Music links in both pages and the footer.
- **Live dates:** the current section is a “no confirmed dates” state. When dates are confirmed, replace the status block with a dated list (date, city, venue, ticket URL) in both languages. Do not publish unconfirmed dates.
- **EPK:** if a PDF is approved, add it under `assets/` and replace the “on request” action with a labelled download (file type and size must be stated).
- **Translations:** the two HTML files are intentionally parallel and reviewable. Keep Polish and English equivalent; do not silently fall back to one language.
- **Domain / canonical:** no canonical URL or production domain is hard-coded. Add canonical and absolute Open Graph URLs only after the domain is chosen.
- **Indexing:** remove `<meta name="robots" content="noindex, nofollow">` from both pages and the `Disallow: /` rule in `robots.txt` after approval.

## Design and technical notes

- Self-hosted **Cormorant Garamond** (display), **Barlow Condensed** (UI / body) and **IBM Plex Mono** (labels). All have Latin Extended coverage for Polish. Licences: SIL Open Font License via Google Fonts.
- Mobile navigation uses `aria-expanded`, `inert`, Escape-to-close, focus return and a focus trap.
- `prefers-reduced-motion` disables the ticker, reveals and smooth scroll.
- The gallery uses a native `<dialog>` lightbox with keyboard close and focus return.
- Images below the fold use `loading="lazy"`; the hero cover uses `fetchpriority="high"`.
- No analytics, cookies, third-party embeds, autoplay audio/video or newsletter form.
- The booking form is deliberately client-side only. A real form backend, spam protection and privacy policy are launch decisions.

## Open launch decisions

1. Approved PL/EN biography and who signs it off.
2. Verified booking address and preferred enquiry workflow.
3. Confirmed current line-up, founding year and any history claims to publish.
4. Rights-cleared photography, credits and approved crops.
5. EPK contents, file version and download policy.
6. Confirmed live dates and ticket links.
7. Domain, hosting, deployment owner, analytics/privacy and form handling.
8. Whether the Facebook page is the official contact channel.
