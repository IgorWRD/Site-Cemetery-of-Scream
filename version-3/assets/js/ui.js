/* Back-to-top control. Shared by the splash, both language pages and 404. */
(() => {
  "use strict";

  const btn = document.querySelector("[data-to-top]");
  if (!btn) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function toggle() {
    btn.classList.toggle("is-visible", window.scrollY > 320);
  }

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  btn.addEventListener("click", () => {
    if (window.COS_MOTION) {
      window.COS_MOTION.scrollToY(0, { duration: window.COS_MOTION.reduce ? 280 : 900 });
    } else {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  });
})();
