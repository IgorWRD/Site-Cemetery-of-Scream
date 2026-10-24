(() => {
  const photo = document.querySelector(".hero-photo");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  if (!photo || reducedMotion.matches || !finePointer.matches) return;

  let frame = 0;
  let y = 0;

  const paint = () => {
    photo.style.setProperty("--photo-y", `${y}px`);
    frame = 0;
  };

  window.addEventListener("pointermove", (event) => {
    y = ((event.clientY / window.innerHeight) - .5) * 4;
    if (!frame) frame = window.requestAnimationFrame(paint);
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    y = 0;
    if (!frame) frame = window.requestAnimationFrame(paint);
  });
})();
