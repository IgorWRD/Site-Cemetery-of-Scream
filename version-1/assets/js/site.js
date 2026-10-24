/* ==========================================================================
   Cemetery of Scream — site behaviour
   No dependencies. All progressive enhancements are optional.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var lang = (root.lang || "pl").toLowerCase().indexOf("en") === 0 ? "en" : "pl";
  var config = window.COS_CONFIG || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var copy = {
    pl: {
      menuOpen: "Otwórz menu",
      menuClose: "Zamknij menu",
      menuLabelOpen: "Menu",
      menuLabelClose: "Zamknij",
      copiedBio: "Skopiowano krótkie bio.",
      copyBioError: "Nie udało się skopiować. Zaznacz tekst ręcznie.",
      briefReady: "Brief gotowy. Skopiuj go i wyślij wybranym kanałem.",
      briefCopied: "Skopiowano brief do schowka. Otwórz Facebooka i wklej go w wiadomości do zespołu.",
      briefEmail: "Brief gotowy. Otwórz e-mail, aby go wysłać.",
      briefCopyError: "Nie udało się skopiować automatycznie. Zaznacz treść briefu i skopiuj ją ręcznie.",
      openEmail: "Otwórz e-mail",
      openFacebook: "Otwórz Facebook",
      requiredName: "Podaj imię i nazwisko.",
      requiredEmail: "Podaj poprawny adres e-mail.",
      requiredMessage: "Napisz kilka słów o wydarzeniu.",
      emailIntro: "Bezpośredni kontakt bookingowy:",
      epkMessage: "Dzień dobry, proszę o przesłanie EPK i materiałów prasowych Cemetery of Scream. Interesuje mnie: [publikacja / festiwal / inny cel].",
      briefSubject: "Zapytanie bookingowe — Cemetery of Scream",
      labels: {
        name: "Imię i nazwisko",
        email: "E-mail",
        organisation: "Klub / organizator",
        city: "Miasto / venue",
        date: "Proponowana data",
        message: "Wiadomość"
      }
    },
    en: {
      menuOpen: "Open menu",
      menuClose: "Close menu",
      menuLabelOpen: "Menu",
      menuLabelClose: "Close",
      copiedBio: "Short bio copied.",
      copyBioError: "Could not copy. Please select the text manually.",
      briefReady: "Brief ready. Copy it and send it through your preferred channel.",
      briefCopied: "Brief copied to your clipboard. Open Facebook and paste it into a message to the band.",
      briefEmail: "Brief ready. Open your email app to send it.",
      briefCopyError: "Could not copy automatically. Select the brief text and copy it manually.",
      openEmail: "Open email",
      openFacebook: "Open Facebook",
      requiredName: "Please enter your name.",
      requiredEmail: "Please enter a valid email address.",
      requiredMessage: "Please tell us a little about the event.",
      emailIntro: "Direct booking contact:",
      epkMessage: "Hello, please send the Cemetery of Scream EPK and press materials. I am interested in: [publication / festival / other].",
      briefSubject: "Booking enquiry — Cemetery of Scream",
      labels: {
        name: "Name",
        email: "Email",
        organisation: "Club / promoter",
        city: "City / venue",
        date: "Proposed date",
        message: "Message"
      }
    }
  };

  var t = copy[lang];

  function $(selector, context) {
    return (context || doc).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || doc).querySelectorAll(selector));
  }

  /* ------------------------------------------------------------------------
     Clipboard
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
    try {
      ok = doc.execCommand("copy");
    } catch (error) {
      ok = false;
    }
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

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */

  var menu = $("[data-mobile-menu]");
  var menuToggle = $("[data-menu-toggle]");
  var menuLabel = $("[data-menu-label]");
  var menuOpen = false;
  var lastFocused = null;

  function getMenuFocusable() {
    if (!menu) return [];
    return $$("a[href], button:not([disabled])", menu).filter(function (el) {
      return el.offsetParent !== null;
    });
  }

  function openMenu() {
    if (!menu || !menuToggle) return;
    menuOpen = true;
    lastFocused = doc.activeElement;
    menu.classList.add("is-open");
    menu.removeAttribute("inert");
    menu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", t.menuClose);
    if (menuLabel) menuLabel.textContent = t.menuLabelClose;
    doc.body.classList.add("menu-open");
    var focusable = getMenuFocusable();
    if (focusable.length) {
      window.setTimeout(function () {
        focusable[0].focus({ preventScroll: true });
      }, 30);
    }
  }

  function closeMenu(returnFocus) {
    if (!menu || !menuToggle || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove("is-open");
    menu.setAttribute("inert", "");
    menu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", t.menuOpen);
    if (menuLabel) menuLabel.textContent = t.menuLabelOpen;
    doc.body.classList.remove("menu-open");
    if (returnFocus !== false) {
      var target = lastFocused && lastFocused.focus ? lastFocused : menuToggle;
      target.focus({ preventScroll: true });
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menu) {
    $$("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    doc.addEventListener("keydown", function (event) {
      if (!menuOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      var focusable = getMenuFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1020 && menuOpen) {
      closeMenu(false);
    }
  });

  /* ------------------------------------------------------------------------
     Header state and scroll progress
     ------------------------------------------------------------------------ */

  var header = $("[data-header]");
  var progress = $("[data-scroll-progress]");
  var scrollQueued = false;

  function updateScrollState() {
    var top = window.scrollY || doc.documentElement.scrollTop || 0;
    if (header) {
      header.classList.toggle("is-scrolled", top > 24);
    }
    if (progress) {
      var height = doc.documentElement.scrollHeight - window.innerHeight;
      var ratio = height > 0 ? Math.min(1, Math.max(0, top / height)) : 0;
      progress.style.width = (ratio * 100).toFixed(2) + "%";
    }
    scrollQueued = false;
  }

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollState);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScrollState();

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */

  var reveals = $$(".reveal");

  if (reveals.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      root.classList.add("reveal-ready");
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: "0px 0px -7% 0px",
        threshold: 0.06
      });

      reveals.forEach(function (el, index) {
        el.style.setProperty("--reveal-delay", ((index % 4) * 55) + "ms");
        revealObserver.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Navigation scroll spy
     ------------------------------------------------------------------------ */

  var navLinks = $$(".desktop-nav a[href^='#']");
  var spySections = navLinks.map(function (link) {
    return doc.getElementById(link.getAttribute("href").slice(1));
  }).filter(Boolean);

  if (navLinks.length && spySections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, {
      rootMargin: "-32% 0px -60% 0px",
      threshold: 0
    });

    spySections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------------ */

  var lightbox = doc.getElementById("lightbox");
  var lightboxImage = $("[data-lightbox-image]", lightbox || doc);
  var lightboxCaption = $("[data-lightbox-caption]", lightbox || doc);
  var lightboxClose = $("[data-lightbox-close]", lightbox || doc);
  var lightboxReturnFocus = null;

  if (lightbox && lightboxImage && typeof lightbox.showModal === "function") {
    $$("[data-lightbox]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var image = $("img", link);
        lightboxReturnFocus = link;
        lightboxImage.src = link.getAttribute("href");
        lightboxImage.alt = image ? image.alt : "";
        if (lightboxCaption) {
          lightboxCaption.textContent = link.getAttribute("data-caption") || (image ? image.alt : "");
        }
        lightbox.showModal();
        doc.body.classList.add("lightbox-open");
      });
    });

    function closeLightbox() {
      if (lightbox.open) lightbox.close();
    }

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("close", function () {
      doc.body.classList.remove("lightbox-open");
      lightboxImage.removeAttribute("src");
      if (lightboxReturnFocus && lightboxReturnFocus.focus) {
        lightboxReturnFocus.focus({ preventScroll: true });
      }
    });
  }

  /* ------------------------------------------------------------------------
     Copy short bio
     ------------------------------------------------------------------------ */

  $$("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = doc.getElementById(button.getAttribute("data-copy-target"));
      var status = $("[data-copy-status]");
      if (!target) return;
      copyText(target.textContent.trim()).then(function (ok) {
        if (!status) return;
        status.textContent = ok ? t.copiedBio : t.copyBioError;
        window.clearTimeout(button._copyTimer);
        button._copyTimer = window.setTimeout(function () {
          status.textContent = "";
        }, 4200);
      });
    });
  });

  /* ------------------------------------------------------------------------
     Booking brief
     ------------------------------------------------------------------------ */

  var form = $("[data-booking-form]");
  var result = $("[data-booking-result]");
  var resultText = $("[data-booking-result-text]");
  var output = $("[data-brief-output]");
  var copyButton = $("[data-copy-brief]");
  var channel = $("[data-booking-channel]");
  var emailSlot = $("[data-booking-email-slot]");
  var bookingEmail = (config.bookingEmail || "").trim();
  var lastBrief = "";

  function setFieldError(field, message) {
    if (!field) return;
    var wrapper = field.closest(".form-field");
    var error = wrapper ? $(".field-error", wrapper) : null;
    if (message) {
      field.setAttribute("aria-invalid", "true");
      if (error) error.textContent = message;
    } else {
      field.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }
  }

  function validateField(field) {
    if (!field) return true;
    var value = (field.value || "").trim();
    var name = field.name;
    var message = "";

    if (name === "name" && value.length < 2) {
      message = t.requiredName;
    }
    if (name === "email") {
      var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      if (!validEmail) message = t.requiredEmail;
    }
    if (name === "message" && value.length < 10) {
      message = t.requiredMessage;
    }

    setFieldError(field, message);
    return !message;
  }

  function formatDate(value) {
    if (!value) return "";
    var parts = value.split("-");
    if (parts.length !== 3) return value;
    return parts[2] + "." + parts[1] + "." + parts[0];
  }

  function buildBrief(fields) {
    var lines = [
      t.briefSubject,
      "",
      t.labels.name + ": " + fields.name,
      t.labels.email + ": " + fields.email
    ];

    if (fields.organisation) lines.push(t.labels.organisation + ": " + fields.organisation);
    if (fields.city) lines.push(t.labels.city + ": " + fields.city);
    if (fields.date) lines.push(t.labels.date + ": " + formatDate(fields.date));

    lines.push("", t.labels.message + ":", fields.message);
    return lines.join("\r\n");
  }

  function updateBookingChannel(brief) {
    if (!channel) return;
    if (bookingEmail) {
      var subject = encodeURIComponent(t.briefSubject);
      var body = encodeURIComponent(brief);
      channel.setAttribute("href", "mailto:" + bookingEmail + "?subject=" + subject + "&body=" + body);
      channel.removeAttribute("target");
      channel.removeAttribute("rel");
      channel.innerHTML = t.openEmail + ' <span class="arrow" aria-hidden="true">↗</span>';
    } else {
      channel.setAttribute("href", config.facebookUrl || "https://www.facebook.com/cemeteryofscream");
      channel.setAttribute("target", "_blank");
      channel.setAttribute("rel", "noopener noreferrer");
      channel.innerHTML = t.openFacebook + ' <span class="arrow" aria-hidden="true">↗</span>';
    }
  }

  if (emailSlot && bookingEmail) {
    emailSlot.hidden = false;
    emailSlot.textContent = t.emailIntro + " ";
    var emailLink = doc.createElement("a");
    emailLink.href = "mailto:" + bookingEmail;
    emailLink.textContent = bookingEmail;
    emailSlot.appendChild(emailLink);
  }

  if (form) {
    var dateField = $("#booking-date", form);
    if (dateField) {
      var today = new Date();
      var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateField.min = iso;
    }

    $$("input, textarea", form).forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
      field.addEventListener("blur", function () {
        if (field.value.trim()) validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var fields = {
        name: ($("#booking-name", form).value || "").trim(),
        email: ($("#booking-email", form).value || "").trim(),
        organisation: ($("#booking-org", form).value || "").trim(),
        city: ($("#booking-city", form).value || "").trim(),
        date: ($("#booking-date", form).value || "").trim(),
        message: ($("#booking-message", form).value || "").trim()
      };

      var valid = true;
      ["name", "email", "message"].forEach(function (name) {
        var field = form.elements[name];
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        var firstInvalid = $("[aria-invalid='true']", form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      lastBrief = buildBrief(fields);
      if (output) output.value = lastBrief;
      updateBookingChannel(lastBrief);

      copyText(lastBrief).then(function (ok) {
        if (result) result.hidden = false;
        if (resultText) {
          if (bookingEmail) {
            resultText.textContent = t.briefEmail;
          } else {
            resultText.textContent = ok ? t.briefCopied : t.briefCopyError;
          }
        }
        if (!ok && output) {
          output.focus();
          output.select();
        }
        if (result) {
          result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
        }
      });
    });
  }

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      if (!lastBrief && output) lastBrief = output.value;
      if (!lastBrief) return;
      copyText(lastBrief).then(function (ok) {
        if (resultText) {
          resultText.textContent = ok ? t.briefCopied : t.briefCopyError;
        }
        if (!ok && output) {
          output.focus();
          output.select();
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     EPK / press intent prefill
     ------------------------------------------------------------------------ */

  $$("[data-booking-intent='epk']").forEach(function (link) {
    link.addEventListener("click", function () {
      var message = $("#booking-message");
      if (!message || message.value.trim()) return;
      message.value = t.epkMessage;
      var name = $("#booking-name");
      if (name) {
        window.setTimeout(function () {
          name.focus({ preventScroll: true });
        }, 260);
      }
    });
  });
})();
