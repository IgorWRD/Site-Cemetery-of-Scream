/* Shared soft scrolling for menu links and the back-to-top control. */
(() => {
  "use strict";

  const html = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  let token = null;
  let removeUserListeners = null;

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    token = null;
    if (removeUserListeners) {
      removeUserListeners();
      removeUserListeners = null;
    }
    html.style.scrollBehavior = "";
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Animate window scroll to an absolute Y position.
   * @param {number} value
   * @param {{duration?: number, onDone?: () => void}} [options]
   */
  function scrollToY(value, options = {}) {
    const start = window.scrollY;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const end = Math.max(0, Math.min(max, value));
    const distance = Math.abs(end - start);

    if (distance < 2) {
      window.scrollTo(0, end);
      return;
    }

    stop();
    const duration = options.duration || (reduce ? 280 : Math.min(1350, Math.max(520, distance * 0.55)));
    const started = performance.now();
    const current = Symbol("cos-scroll");
    token = current;
    html.style.scrollBehavior = "auto";

    const cancel = () => stop();
    const onKey = (event) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stop();
    };

    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", onKey);
    removeUserListeners = () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", onKey);
    };

    function step(now) {
      if (token !== current) return;
      const progress = Math.min(1, (now - started) / duration);
      window.scrollTo(0, start + (end - start) * easeInOutCubic(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        frame = 0;
        token = null;
        removeUserListeners?.();
        removeUserListeners = null;
        html.style.scrollBehavior = "";
        options.onDone?.();
      }
    }

    frame = requestAnimationFrame(step);
  }

  window.COS_MOTION = { scrollToY, stop, reduce };
})();
