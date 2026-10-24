/* ==========================================================================
   Cemetery of Scream — site behaviour
   No dependencies. Every enhancement degrades to readable HTML.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var prefersReducedMotion = function () {
    return !!(reduceMotionQuery && reduceMotionQuery.matches);
  };

  root.classList.remove("no-js");
  root.classList.add("js");

  function qs(selector, context) {
    return (context || doc).querySelector(selector);
  }

  function qsa(selector, context) {
    return Array.prototype.slice.call((context || doc).querySelectorAll(selector));
  }

  function on(element, event, handler, options) {
    if (element) element.addEventListener(event, handler, options);
  }

  /* ------------------------------------------------------------------------
     Header state + scroll progress + back-to-top
     ------------------------------------------------------------------------ */

  function initScrollChrome() {
    var header = qs("[data-header]");
    var progress = qs("[data-scroll-progress]");
    var toTop = qs("[data-to-top]");
    var queued = false;

    function update() {
      var top = window.scrollY || doc.documentElement.scrollTop || 0;
      if (header) header.classList.toggle("is-scrolled", top > 20);
      if (toTop) {
        var threshold = Math.max(520, window.innerHeight * 0.75);
        toTop.classList.toggle("is-visible", top > threshold);
      }
      if (progress) {
        var height = doc.documentElement.scrollHeight - window.innerHeight;
        var ratio = height > 0 ? Math.min(1, Math.max(0, top / height)) : 0;
        progress.style.setProperty("--progress", ratio.toFixed(4));
      }
      queued = false;
    }

    function requestUpdate() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }

    on(window, "scroll", requestUpdate, { passive: true });
    on(window, "resize", requestUpdate);
    update();
  }

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */

  function initMobileMenu() {
    var menu = qs("[data-mobile-menu]");
    var toggle = qs("[data-menu-toggle]");
    if (!menu || !toggle) return;

    var label = qs("[data-menu-label]", toggle);
    var openLabel = toggle.getAttribute("data-open-label") || "Menu";
    var closeLabel = toggle.getAttribute("data-close-label") || "Close";
    var isOpen = false;
    var lastFocused = null;

    function focusables() {
      var items = qsa("a[href], button:not([disabled])", menu).filter(function (element) {
        return element.offsetParent !== null;
      });
      return [toggle].concat(items);
    }

    function setOpen(open, restoreFocus) {
      if (open === isOpen) return;
      isOpen = open;

      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? closeLabel : openLabel);
      if (label) label.textContent = open ? closeLabel : openLabel;
      doc.body.classList.toggle("menu-open", open);

      if (open) {
        lastFocused = doc.activeElement && doc.activeElement !== doc.body ? doc.activeElement : toggle;
        menu.removeAttribute("inert");
        window.setTimeout(function () {
          var first = qs(".mobile-menu__nav a", menu);
          if (first) first.focus({ preventScroll: true });
        }, 40);
      } else {
        menu.setAttribute("inert", "");
        if (restoreFocus !== false) {
          var target = lastFocused && lastFocused.focus ? lastFocused : toggle;
          window.setTimeout(function () {
            target.focus({ preventScroll: true });
          }, 40);
        }
      }
    }

    on(toggle, "click", function () {
      setOpen(!isOpen);
    });

    qsa("a", menu).forEach(function (link) {
      on(link, "click", function () {
        setOpen(false, false);
      });
    });

    on(doc, "keydown", function (event) {
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      var list = focusables();
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    on(window, "resize", function () {
      if (window.innerWidth > 980 && isOpen) setOpen(false, false);
    });
  }

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */

  function initReveal() {
    var items = qsa(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.06
    });

    items.forEach(function (item, index) {
      item.style.setProperty("--reveal-delay", ((index % 4) * 55) + "ms");
      observer.observe(item);
    });

    /* Safety net for direct anchor arrivals and browsers that throttle IO. */
    function revealInView() {
      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight * 0.96) {
          item.classList.add("is-visible");
        }
      });
    }

    window.setTimeout(revealInView, 160);
    window.addEventListener("hashchange", function () {
      window.setTimeout(revealInView, 160);
    });
  }

  /* ------------------------------------------------------------------------
     Navigation scroll spy
     ------------------------------------------------------------------------ */

  function initNavSpy() {
    var links = qsa("[data-nav-link]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var sections = links.map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? doc.getElementById(id.slice(1)) : null;
    }).filter(Boolean);

    if (!sections.length) return;

    var visible = new Map();

    function setActive(id) {
      links.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      var bestId = null;
      var bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestId) setActive(bestId);
    }, {
      rootMargin: "-34% 0px -54% 0px",
      threshold: [0, 0.05, 0.2, 0.4, 0.7, 1]
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     Tab groups — about chapters + discography master/detail
     ------------------------------------------------------------------------ */

  function initTabs(root, options) {
    if (!root) return;

    var tabs = qsa("[role='tab']", root);
    var panels = qsa("[role='tabpanel']", root);
    if (!tabs.length || tabs.length !== panels.length) return;

    var scrollOnMobile = !!(options && options.scrollOnMobile);
    var current = 0;

    tabs.forEach(function (tab, index) {
      if (tab.getAttribute("aria-selected") === "true") current = index;
    });

    function activate(index, focusTab, revealPanel) {
      index = Math.min(tabs.length - 1, Math.max(0, index));

      tabs.forEach(function (tab, i) {
        var selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        tab.classList.toggle("is-active", selected);
      });

      panels.forEach(function (panel, i) {
        var selected = i === index;
        panel.classList.toggle("is-active", selected);
        panel.hidden = !selected;
      });

      current = index;

      if (focusTab) {
        tabs[index].focus({ preventScroll: true });
      }

      if (revealPanel && scrollOnMobile && window.matchMedia("(max-width: 980px)").matches) {
        window.setTimeout(function () {
          panels[index].scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start"
          });
        }, 40);
      }
    }

    tabs.forEach(function (tab, index) {
      on(tab, "click", function () {
        activate(index, false, true);
      });

      on(tab, "keydown", function (event) {
        var next = null;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          next = (index + 1) % tabs.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          next = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = tabs.length - 1;
        }

        if (next !== null) {
          event.preventDefault();
          activate(next, true, false);
        }
      });
    });

    activate(current, false, false);
  }

  /* ------------------------------------------------------------------------
     Gallery filmstrip + lightbox
     ------------------------------------------------------------------------ */

  function initGallery() {
    var strip = qs("[data-filmstrip]");
    if (!strip) return;

    var frames = qsa(".frame", strip);
    var prev = qs("[data-gallery-prev]");
    var next = qs("[data-gallery-next]");
    var count = qs("[data-gallery-count]");
    var progress = qs("[data-gallery-progress]");
    var total = frames.length;
    var current = 0;
    var frameStep = 0;

    function measure() {
      if (frames.length > 1) {
        frameStep = frames[1].offsetLeft - frames[0].offsetLeft;
      } else if (frames.length === 1) {
        frameStep = frames[0].offsetWidth;
      }
    }

    function closestIndex() {
      if (!frames.length) return 0;
      var stripRect = strip.getBoundingClientRect();
      var center = stripRect.left + stripRect.width / 2;
      var best = 0;
      var bestDistance = Infinity;

      frames.forEach(function (frame, index) {
        var rect = frame.getBoundingClientRect();
        var distance = Math.abs((rect.left + rect.width / 2) - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });

      return best;
    }

    function update() {
      current = closestIndex();
      if (count) {
        count.textContent = String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
      }
      if (progress) {
        var max = strip.scrollWidth - strip.clientWidth;
        var ratio = max > 0 ? strip.scrollLeft / max : 0;
        progress.style.width = (Math.min(1, Math.max(0, ratio)) * 100).toFixed(2) + "%";
      }
      if (prev) prev.disabled = current <= 0;
      if (next) next.disabled = current >= total - 1;
    }

    function goTo(index) {
      var target = Math.min(total - 1, Math.max(0, index));
      var frame = frames[target];
      if (!frame) return;
      var stripRect = strip.getBoundingClientRect();
      var frameRect = frame.getBoundingClientRect();
      var left = strip.scrollLeft + (frameRect.left - stripRect.left) - (strip.clientWidth - frameRect.width) / 2;

      strip.scrollTo({
        left: left,
        behavior: prefersReducedMotion() ? "auto" : "smooth"
      });
    }

    var queued = false;
    on(strip, "scroll", function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        update();
        queued = false;
      });
    }, { passive: true });

    on(prev, "click", function () {
      goTo(current - 1);
    });

    on(next, "click", function () {
      goTo(current + 1);
    });

    on(strip, "keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(current + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(total - 1);
      }
    });

    /* Mouse drag, without hijacking touch scrolling or link clicks. */
    var drag = { active: false, startX: 0, startLeft: 0, moved: false, pointerId: null };

    on(strip, "pointerdown", function (event) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag.active = true;
      drag.startX = event.clientX;
      drag.startLeft = strip.scrollLeft;
      drag.moved = false;
      drag.pointerId = event.pointerId;
      strip.classList.add("is-dragging");
      if (strip.setPointerCapture) strip.setPointerCapture(event.pointerId);
    });

    on(strip, "pointermove", function (event) {
      if (!drag.active) return;
      var distance = event.clientX - drag.startX;
      if (Math.abs(distance) > 6) drag.moved = true;
      strip.scrollLeft = drag.startLeft - distance;
    });

    function endDrag(event) {
      if (!drag.active) return;
      drag.active = false;
      strip.classList.remove("is-dragging");
      if (strip.releasePointerCapture && drag.pointerId !== null) {
        try { strip.releasePointerCapture(drag.pointerId); } catch (error) { /* noop */ }
      }
      drag.pointerId = null;
      if (drag.moved) {
        window.setTimeout(function () { drag.moved = false; }, 0);
      }
    }

    on(strip, "pointerup", endDrag);
    on(strip, "pointercancel", endDrag);
    on(strip, "pointerleave", function (event) {
      if (event.pointerType === "mouse") endDrag(event);
    });

    on(strip, "click", function (event) {
      if (!drag.moved) return;
      event.preventDefault();
      event.stopPropagation();
      drag.moved = false;
    }, true);

    measure();
    update();
    on(window, "resize", function () {
      measure();
      window.setTimeout(update, 80);
    });
  }

  function initLightbox() {
    var dialog = qs("#lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;

    var triggers = qsa("[data-lightbox]");
    if (!triggers.length) return;

    var image = qs("[data-lightbox-image]", dialog);
    var caption = qs("[data-lightbox-caption]", dialog);
    var credit = qs("[data-lightbox-credit]", dialog);
    var counter = qs("[data-lightbox-counter]", dialog);
    var closeButton = qs("[data-lightbox-close]", dialog);
    var prevButton = qs("[data-lightbox-prev]", dialog);
    var nextButton = qs("[data-lightbox-next]", dialog);
    var index = 0;
    var returnFocus = null;
    var placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    function preload(target) {
      if (!target) return;
      var loader = new Image();
      loader.src = target.getAttribute("href");
    }

    function show(targetIndex) {
      index = (targetIndex + triggers.length) % triggers.length;
      var trigger = triggers[index];
      if (!trigger || !image) return;

      image.src = trigger.getAttribute("href");
      var thumb = qs("img", trigger);
      image.alt = thumb ? thumb.alt : (trigger.getAttribute("data-caption") || "");
      if (caption) caption.textContent = trigger.getAttribute("data-caption") || "";
      if (credit) credit.textContent = trigger.getAttribute("data-credit") || "";
      if (counter) counter.textContent = String(index + 1).padStart(2, "0") + " / " + String(triggers.length).padStart(2, "0");

      preload(triggers[(index + 1) % triggers.length]);
      preload(triggers[(index - 1 + triggers.length) % triggers.length]);
    }

    function open(targetIndex, trigger) {
      returnFocus = trigger;
      show(targetIndex);
      dialog.showModal();
      doc.body.classList.add("lightbox-open");
      if (closeButton) closeButton.focus({ preventScroll: true });
    }

    function cleanup() {
      doc.body.classList.remove("lightbox-open");
      if (image) {
        image.src = placeholder;
        image.alt = "";
      }
      if (returnFocus && returnFocus.focus) {
        returnFocus.focus({ preventScroll: true });
      }
      returnFocus = null;
    }

    function close() {
      if (dialog.open) dialog.close();
      cleanup();
    }

    triggers.forEach(function (trigger, triggerIndex) {
      on(trigger, "click", function (event) {
        if (event.defaultPrevented) return;
        event.preventDefault();
        open(triggerIndex, trigger);
      });
    });

    on(closeButton, "click", close);

    on(prevButton, "click", function () {
      show(index - 1);
    });

    on(nextButton, "click", function () {
      show(index + 1);
    });

    on(dialog, "keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      }
    });

    var stage = qs(".lightbox__stage", dialog);
    on(stage, "click", function (event) {
      if (event.target === stage) close();
    });

    on(dialog, "click", function (event) {
      if (event.target === dialog) close();
    });

    on(dialog, "close", cleanup);
  }

  /* ------------------------------------------------------------------------
     Copy short biography
     ------------------------------------------------------------------------ */

  function fallbackCopy(text) {
    var field = doc.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    field.style.left = "-1000px";
    doc.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, field.value.length);
    var ok = false;
    try { ok = doc.execCommand("copy"); } catch (error) { ok = false; }
    doc.body.removeChild(field);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function initCopyBio() {
    qsa("[data-copy-bio]").forEach(function (button) {
      var status = qs("[data-copy-status]", button.closest(".press-card") || doc);
      var targetId = button.getAttribute("data-copy-target");
      var target = targetId ? doc.getElementById(targetId) : null;
      var success = button.getAttribute("data-copy-success") || "Copied.";
      var failure = button.getAttribute("data-copy-error") || "Could not copy. Select the text manually.";
      var timer = null;

      on(button, "click", function () {
        if (!target) return;
        copyText(target.textContent.trim()).then(function (ok) {
          if (status) status.textContent = ok ? success : failure;
          if (timer) window.clearTimeout(timer);
          timer = window.setTimeout(function () {
            if (status) status.textContent = "";
          }, 4200);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Anchor arrivals — keep the fixed header clear of the target
     ------------------------------------------------------------------------ */

  function initHashScroll() {
    if (!window.location.hash || window.location.hash.length < 2) return;
    var id = decodeURIComponent(window.location.hash.slice(1));
    var target = doc.getElementById(id);
    if (!target) return;

    var jump = function () {
      var previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start", behavior: "auto" });
      root.style.scrollBehavior = previous;
    };

    window.setTimeout(jump, 80);
    window.addEventListener("load", jump, { once: true });
  }

  /* ------------------------------------------------------------------------
     Current year
     ------------------------------------------------------------------------ */

  function initYear() {
    var year = String(new Date().getFullYear());
    qsa("[data-year]").forEach(function (node) {
      node.textContent = year;
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */

  function boot() {
    initScrollChrome();
    initMobileMenu();
    initReveal();
    initNavSpy();
    initTabs(qs("[data-about-tabs]"), { scrollOnMobile: true });
    initTabs(qs("[data-disco]"), { scrollOnMobile: true });
    initGallery();
    initLightbox();
    initCopyBio();
    initHashScroll();
    initYear();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
