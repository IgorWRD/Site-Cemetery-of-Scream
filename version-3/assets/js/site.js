/* Cemetery of Scream — site behaviour
   Vanilla JS, no dependencies. Everything is progressive: content is in the HTML. */

(() => {
  "use strict";

  const html = document.documentElement;
  const body = document.body;
  const lang = html.lang === "en" ? "en" : "pl";
  const BASE = body.dataset.base || "";
  const labels = (window.COS_LABELS && window.COS_LABELS[lang]) || {};
  const releases = window.COS_RELEASES || {};
  const photos = window.COS_PHOTOS || [];
  const order = Object.keys(releases);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------------------------------------------------------------- locking */
  function syncLock() {
    const open = document.querySelector("dialog[open]");
    html.classList.toggle("is-locked", Boolean(open));
  }

  /* ---------------------------------------------------------------- menu */
  const menu = $("#menu");
  const menuOpen = $("[data-menu-open]");
  const menuClose = $("[data-menu-close]");

  if (menu && menuOpen) {
    menuOpen.addEventListener("click", () => {
      menu.showModal();
      syncLock();
    });
    menuClose?.addEventListener("click", () => menu.close());
    $$("[data-menu-link]", menu).forEach((a) => a.addEventListener("click", () => menu.close()));
    menu.addEventListener("click", (e) => {
      if (e.target === menu) menu.close();
    });
    menu.addEventListener("close", syncLock);
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && menu.open) menu.close();
    });
  }

  /* -------------------------------------------------------------- reveal */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = $$(".section__head, .chapter, .lineup, .release, .stage, .contact__link, .live__panel, .disco__intro");

  if (revealTargets.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealTargets.forEach((el) => {
        el.classList.add("reveal");
        io.observe(el);
      });
      // Safety net: never leave content hidden if the observer misbehaves.
      window.setTimeout(() => {
        revealTargets.forEach((el) => el.classList.add("is-in"));
      }, 4000);
    }
  }

  /* ----------------------------------------------------------- scrollspy */
  const sectionIds = ["historia", "dyskografia", "widma", "rytualy", "kontakt"];
  const railLinks = $$("[data-section]");
  const bios = $$("[data-bio-link]");
  let spyTick = false;

  function spy() {
    spyTick = false;
    const marker = window.innerHeight * 0.34;
    let active = null;
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top <= marker && r.bottom > marker) active = id;
    });
    railLinks.forEach((a) => {
      if (a.dataset.section === active) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });

    let activeChapter = null;
    bios.forEach((a) => {
      const el = document.getElementById(a.dataset.bioLink);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top <= window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.3) activeChapter = a.dataset.bioLink;
    });
    bios.forEach((a) => {
      if (a.dataset.bioLink === activeChapter) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  function requestSpy() {
    if (spyTick) return;
    spyTick = true;
    requestAnimationFrame(spy);
  }
  window.addEventListener("scroll", requestSpy, { passive: true });
  window.addEventListener("resize", requestSpy, { passive: true });
  requestSpy();

  /* --------------------------------------------------------------- gate */
  const gate = $("#release-dialog");
  const gateRoom = $("#gate-room");
  const gateCover = $("#gate-cover");
  const gateYear = $("#gate-year");
  const gateTitle = $("#gate-title");
  const gateMeta = $("#gate-meta");
  const gateNote = $("#gate-note");
  const gateTracks = $("#gate-tracks");
  const gateLinks = $("#gate-links");
  const gateClose = $("[data-gate-close]", gate || document);
  let currentRelease = "oceans";

  function coverURL(r) {
    return `${BASE}assets/img/covers/${r.cover}`;
  }

  function preloadRelease(id) {
    const r = releases[id];
    if (!r) return;
    const im = new Image();
    im.src = coverURL(r);
  }

  function renderRelease(id) {
    const r = releases[id];
    if (!r || !gate) return;
    currentRelease = id;

    gateYear.textContent = `${r.year} · ${r.type[lang]}`;
    gateTitle.textContent = r.title;
    gateNote.textContent = r.note[lang];

    const meta = [r.label];
    if (r.catalog) meta.push(r.catalog);
    meta.push(`${r.tracks.length} ${labels.tracks}`);
    if (/^\d+:\d+$/.test(r.duration)) meta.push(r.duration);
    gateMeta.innerHTML = meta.map((m) => `<span>${m}</span>`).join("");

    gateTracks.innerHTML = r.tracks
      .map(
        ([name, time], i) =>
          `<li class="track"><span class="track__n">${String(i + 1).padStart(2, "0")}</span>` +
          `<span class="track__name">${name}</span><span class="track__time">${time}</span></li>`
      )
      .join("");

    gateLinks.innerHTML =
      `<a class="btn" href="${window.COS_SPOTIFY || "https://open.spotify.com/artist/0W8QHkPjO1VVeOkDwtJTbN"}" rel="me">${labels.spotify} <span class="btn__arrow" aria-hidden="true">↗</span></a>` +
      `<a class="btn" href="${window.COS_BANDSINTOWN || "https://www.bandsintown.com/a/90207-cemetery-of-scream"}" rel="me">${labels.booking} <span class="btn__arrow" aria-hidden="true">↗</span></a>`;

    gateCover.src = coverURL(r);
    gateCover.alt = `${r.title} — cover`;
    const backdrop = new URL(coverURL(r), document.baseURI).href;
    gateRoom.style.setProperty("--cover", `url("${backdrop}")`);
    gate.dataset.current = id;
    gateTracks.scrollTop = 0;
    const info = $("#gate-info");
    if (info) info.scrollTop = 0;
  }

  function openRelease(id, trigger) {
    if (!gate) return;
    renderRelease(id);
    if (!gate.open) {
      gate.showModal();
      syncLock();
      gateClose?.focus({ preventScroll: true });
    }
    gate.dataset.trigger = trigger ? "1" : "";
  }

  function stepRelease(delta) {
    const i = order.indexOf(currentRelease);
    const next = order[(i + delta + order.length) % order.length];
    renderRelease(next);
    const swap = $(".gate__info");
    if (swap && !reduce) {
      swap.animate(
        [
          { opacity: 0.2, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 320, easing: "cubic-bezier(.22,.61,.36,1)" }
      );
    }
  }

  if (gate) {
    $$("[data-release]").forEach((btn) => {
      const id = btn.dataset.release;
      btn.addEventListener("click", () => openRelease(id, btn));
      ["pointerenter", "focus"].forEach((ev) => btn.addEventListener(ev, () => preloadRelease(id)));
    });

    gateClose?.addEventListener("click", () => gate.close());
    $("[data-gate-prev]", gate)?.addEventListener("click", () => stepRelease(-1));
    $("[data-gate-next]", gate)?.addEventListener("click", () => stepRelease(1));
    gate.addEventListener("click", (e) => {
      if (e.target === gate || e.target === gateRoom) gate.close();
    });
    gate.addEventListener("close", () => {
      syncLock();
      const trigger = gate.dataset.trigger && $$("[data-release]").find((b) => b.dataset.release === gate.dataset.current);
      trigger?.focus({ preventScroll: true });
      gate.dataset.trigger = "";
    });
    gate.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepRelease(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepRelease(1);
      }
    });
    gate.addEventListener("toggle", (e) => {
      if (e.newState === "open") syncLock();
    });
  }

  /* -------------------------------------------------------------- lightbox */
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  const lbCaption = $("#lb-caption");
  const lbCredit = $("#lb-credit");
  const lbCount = $("[data-lb-count]");
  let photoIndex = 0;
  const preloaded = new Set();

  function photoURL(p) {
    return `${BASE}assets/img/gallery/full/${p.slug}.jpg`;
  }

  function preloadPhoto(i) {
    if (!photos.length) return;
    const p = photos[(i + photos.length) % photos.length];
    if (!p || preloaded.has(p.slug)) return;
    preloaded.add(p.slug);
    const im = new Image();
    im.src = photoURL(p);
  }

  function renderPhoto(i) {
    if (!photos.length) return;
    photoIndex = (i + photos.length) % photos.length;
    const p = photos[photoIndex];
    const pick = (v) => (v && typeof v === "object" ? v[lang] || v.pl : v);
    lbImg.src = photoURL(p);
    lbImg.alt = pick(p.alt);
    lbImg.width = p.w;
    lbImg.height = p.h;
    lbCaption.textContent = pick(p.caption);
    lbCredit.textContent = pick(p.credit);
    lbCount.textContent = `${String(photoIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
    preloadPhoto(photoIndex + 1);
    preloadPhoto(photoIndex - 1);
  }

  function openPhoto(i) {
    if (!lb) return;
    renderPhoto(i);
    if (!lb.open) {
      lb.showModal();
      syncLock();
    }
  }

  if (lb) {
    $$("[data-photo]").forEach((btn) => {
      btn.addEventListener("click", () => openPhoto(Number(btn.dataset.photo) || 0));
    });
    $("[data-lb-close]", lb)?.addEventListener("click", () => lb.close());
    $("[data-lb-prev]", lb)?.addEventListener("click", () => renderPhoto(photoIndex - 1));
    $("[data-lb-next]", lb)?.addEventListener("click", () => renderPhoto(photoIndex + 1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lightbox__stage") || e.target.classList.contains("lightbox__inner")) lb.close();
    });
    lb.addEventListener("close", () => {
      syncLock();
      lbImg.removeAttribute("src");
      lbImg.removeAttribute("width");
      lbImg.removeAttribute("height");
    });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        renderPhoto(photoIndex - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        renderPhoto(photoIndex + 1);
      }
    });
  }

  /* ----------------------------------------------------------------- reel */
  const reel = $("#reel");
  if (reel) {
    const frames = $$(".frame", reel);
    const count = $("[data-reel-count]");
    const bar = $("[data-reel-bar]");
    let lastIndex = -1;
    let raf = 0;

    function reelUpdate() {
      raf = 0;
      if (!frames.length) return;
      const rect = reel.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      frames.forEach((f, i) => {
        const r = f.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best !== lastIndex && count) {
        count.textContent = `${String(best + 1).padStart(2, "0")} / ${String(frames.length).padStart(2, "0")}`;
        lastIndex = best;
      }
      if (bar) {
        const max = reel.scrollWidth - reel.clientWidth;
        const pct = max > 0 ? (reel.scrollLeft / max) * 100 : 0;
        bar.style.inlineSize = `${Math.max(3, pct)}%`;
      }
    }

    function requestReel() {
      if (raf) return;
      raf = requestAnimationFrame(reelUpdate);
    }

    reel.addEventListener("scroll", requestReel, { passive: true });
    window.addEventListener("resize", requestReel, { passive: true });
    requestReel();

    function goFrame(delta) {
      const from = lastIndex < 0 ? 0 : lastIndex;
      const target = Math.max(0, Math.min(frames.length - 1, from + delta));
      frames[target].scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
    }

    $("[data-reel-prev]")?.addEventListener("click", () => goFrame(-1));
    $("[data-reel-next]")?.addEventListener("click", () => goFrame(1));

    reel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        reel.scrollBy({ left: -reel.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        reel.scrollBy({ left: reel.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
      }
    });

    // Mouse drag (touch and trackpads keep native scrolling).
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    reel.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = reel.scrollLeft;
      reel.setPointerCapture(e.pointerId);
    });
    reel.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) {
        moved = true;
        reel.classList.add("is-dragging");
      }
      if (moved) reel.scrollLeft = startLeft - dx;
    });
    const endDrag = (e) => {
      if (!down) return;
      down = false;
      reel.classList.remove("is-dragging");
      if (e.pointerId !== undefined && reel.hasPointerCapture(e.pointerId)) reel.releasePointerCapture(e.pointerId);
      window.setTimeout(() => {
        moved = false;
      }, 20);
    };
    reel.addEventListener("pointerup", endDrag);
    reel.addEventListener("pointercancel", endDrag);
    reel.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  /* ------------------------------------------------------------- sheet */
  const sheetToggle = $("[data-sheet-toggle]");
  const sheet = $("#sheet");
  if (sheetToggle && sheet) {
    sheetToggle.addEventListener("click", () => {
      const open = sheet.hidden;
      sheet.hidden = !open;
      sheetToggle.setAttribute("aria-expanded", String(open));
      sheetToggle.textContent = open ? labels.reel : labels.sheet;
      if (open) {
        window.setTimeout(() => sheet.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }), 60);
      }
    });
  }

  /* ------------------------------------------------------------- misc */

  // Keep the current section when switching language.
  function syncLangHash() {
    $$("a[hreflang]").forEach((a) => {
      const base = a.getAttribute("href").split("#")[0];
      if (base.endsWith("../pl/index.html") || base.endsWith("../en/index.html")) {
        a.setAttribute("href", location.hash ? `${base}${location.hash}` : base);
      }
    });
  }
  syncLangHash();
  window.addEventListener("hashchange", syncLangHash);
  $$("a[hreflang]").forEach((a) => a.addEventListener("click", syncLangHash));

  // Soft in-page navigation: rail, mobile menu, bio index and hero CTAs.
  function anchorFor(target) {
    if (target.classList.contains("section")) return target.querySelector(".section__head") || target;
    if (target.classList.contains("chapter")) return target.querySelector(".chapter__head") || target;
    return target;
  }

  function revealNow(target) {
    target.querySelectorAll(".reveal").forEach((el) => {
      el.style.transition = "none";
      el.classList.add("is-in");
    });
    // Force layout so the measured heading is the final, untranslated position.
    void target.offsetHeight;
  }

  function scrollToId(id, instant = false) {
    const target = document.getElementById(id);
    if (!target) return false;
    revealNow(target);
    const anchor = anchorFor(target);
    const margin = parseFloat(getComputedStyle(anchor).scrollMarginBlockStart) || 0;
    let top = anchor.getBoundingClientRect().top + window.scrollY - margin;
    if (id === "top") top = 0;

    if (window.COS_MOTION && !instant) {
      window.COS_MOTION.scrollToY(top);
    } else if (instant) {
      window.scrollTo(0, top);
    } else {
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    return true;
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.classList.contains("skip") || link.hasAttribute("download") || link.target === "_blank") return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const id = hash.slice(1);
    if (!document.getElementById(id)) return;

    event.preventDefault();
    const dialog = link.closest("dialog");
    if (dialog && dialog.open) dialog.close();
    history.pushState(null, "", hash);
    syncLangHash();
    requestAnimationFrame(() => scrollToId(id));
  });

  window.addEventListener("popstate", () => {
    syncLangHash();
    if (location.hash) {
      requestAnimationFrame(() => scrollToId(location.hash.slice(1)));
    } else if (window.COS_MOTION) {
      window.COS_MOTION.scrollToY(0);
    }
  });

  // Deep links: the browser lands on the section box; nudge to its heading.
  if (location.hash) {
    const settle = () => {
      requestAnimationFrame(() => {
        if (!location.hash) return;
        const id = location.hash.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        revealNow(target);
        const anchor = anchorFor(target);
        const margin = parseFloat(getComputedStyle(anchor).scrollMarginBlockStart) || 0;
        const top = id === "top" ? 0 : anchor.getBoundingClientRect().top + window.scrollY - margin;
        window.scrollTo(0, top);
      });
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
    else window.addEventListener("load", settle, { once: true });
  }

  try {
    localStorage.setItem("cos-lang", lang);
  } catch (e) {
    /* storage may be disabled */
  }
})();
