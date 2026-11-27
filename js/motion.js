// Fluid scroll motion. Any element with data-float="speed" (e.g. 0.08):
//  - drifts with a little parallax (bigger speed = moves more against the scroll)
//  - trails the scroll slightly and eases back, each element at its own pace
// Optional data-fade fades the element out as the page scrolls past the first screen.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const items = new Map();
let running = false, last = performance.now();

function measure(el, it) {
  const r = el.getBoundingClientRect();
  it.center = r.top + scrollY - it.off + r.height / 2;
}
export function track(root = document) {
  if (reduce) return;
  root.querySelectorAll("[data-float]").forEach((el, i) => {
    if (items.has(el)) return;
    const it = { speed: parseFloat(el.dataset.float) || 0.06, rate: 7 + ((i * 37) % 5), sy: scrollY, off: 0, fade: "fade" in el.dataset };
    items.set(el, it); measure(el, it);
  });
  kick();
}
const remeasure = () => { for (const [el, it] of items) measure(el, it); kick(); };
addEventListener("resize", remeasure);
addEventListener("load", remeasure);
new ResizeObserver(remeasure).observe(document.body);
addEventListener("scroll", kick, { passive: true });

function kick() { if (!running && items.size) { running = true; last = performance.now(); requestAnimationFrame(tick); } }
function tick(now) {
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  const vh = innerHeight, mid = vh / 2, y = scrollY;
  let moving = false;
  for (const [el, it] of items) {
    it.sy += (y - it.sy) * (1 - Math.exp(-it.rate * dt));
    if (Math.abs(y - it.sy) > 0.15) moving = true; else it.sy = y;
    const lag = Math.max(-70, Math.min(70, (y - it.sy) * 0.22));
    const screenCenter = it.center - it.sy;
    if (screenCenter < -vh || screenCenter > vh * 2) continue; // off screen
    const para = (screenCenter - mid) * it.speed;
    it.off = lag + para;
    el.style.translate = `0 ${it.off.toFixed(2)}px`;
    if (it.fade) el.style.opacity = Math.max(0, 1 - y / (vh * 0.38)).toFixed(3);
  }
  if (moving) requestAnimationFrame(tick); else running = false;
}
