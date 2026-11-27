// Smooth mouse-wheel scrolling. A wheel notch jumps ~100px in one frame on most mice, which
// looks choppy. Here each notch becomes a short eased glide, so every mouse scrolls the same.
// Trackpads (many small, fractional or sideways deltas) and touch keep native scrolling.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
  let target = scrollY, current = scrollY, animating = false, last = 0, trackpadUntil = 0;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  const looksLikeMouse = (e) =>
    e.deltaMode === 1 || e.deltaMode === 2 ||
    (e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40);

  addEventListener("wheel", (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return; // 3D viewer zoom, page zoom, sideways
    const now = performance.now();
    if (!looksLikeMouse(e)) { trackpadUntil = now + 400; return; } // trackpad gesture: leave it native
    if (now < trackpadUntil) return; // trailing events of a trackpad gesture
    e.preventDefault();
    const px = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (!animating) { current = scrollY; target = scrollY; }
    target = Math.max(0, Math.min(maxY(), target + px));
    if (!animating) { animating = true; last = now; requestAnimationFrame(step); }
  }, { passive: false });

  function step(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    current += (target - current) * (1 - Math.exp(-11 * dt)); // ~250ms ease-out per notch, frame-rate independent
    if (Math.abs(target - current) < 0.5) current = target;
    scrollTo({ top: current, behavior: "instant" });
    if (current !== target) requestAnimationFrame(step); else animating = false;
  }
  // keyboard, scrollbar or anchor scrolls cancel the glide
  addEventListener("keydown", () => { animating = false; target = current = scrollY; });
  addEventListener("pointerdown", () => { animating = false; target = current = scrollY; });
}
