// Night-sky background: film grain plus scattered cream dots, randomized on every load.
// Dots sit on three depth layers that drift at different speeds as you scroll.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CREAM = [246, 238, 220];

// grain: a small random tile repeated across the page
function grainTile() {
  const c = document.createElement("canvas"); c.width = c.height = 180;
  const g = c.getContext("2d"), img = g.createImageData(180, 180);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random();
    const light = v > 0.5;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = light ? 190 : 8;
    img.data[i + 2] = light ? 230 : 30;
    img.data[i + 3] = Math.random() * (light ? 26 : 34);
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL();
}
document.documentElement.style.setProperty("--grain", `url(${grainTile()})`);

const canvas = document.createElement("canvas");
canvas.className = "sky"; canvas.setAttribute("aria-hidden", "true");
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");
const LAYERS = [
  { depth: 0.04, density: 1 / 9000, size: [0.4, 1.1], alpha: [0.25, 0.6] },
  { depth: 0.1, density: 1 / 26000, size: [0.9, 1.8], alpha: [0.5, 0.85] },
  { depth: 0.2, density: 1 / 90000, size: [1.8, 3.4], alpha: [0.8, 1] },
];
let W, H, dpr, stars = [], twinklers = [];
const rand = (a, b) => a + Math.random() * (b - a);

function build() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  stars = []; twinklers = [];
  LAYERS.forEach((L, li) => {
    const n = Math.round(W * H * L.density);
    for (let i = 0; i < n; i++) {
      // skew sizes small: most dots tiny, a few big ones
      const s = L.size[0] + Math.pow(Math.random(), 2.2) * (L.size[1] - L.size[0]);
      const st = { x: Math.random() * W, y: Math.random() * H, r: s, a: rand(...L.alpha), L: li, tw: Math.random() < 0.12 ? rand(0.6, 1.8) : 0, ph: Math.random() * 6.28 };
      stars.push(st);
    }
  });
}

let smooth = scrollY, last = performance.now();
function draw(now) {
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  smooth += (scrollY - smooth) * (reduce ? 1 : 1 - Math.pow(0.001, dt));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    const L = LAYERS[s.L];
    let y = (s.y - smooth * L.depth) % H; if (y < 0) y += H;
    let a = s.a;
    if (s.tw && !reduce) a *= 0.65 + 0.35 * Math.sin(now / 1000 * s.tw + s.ph);
    ctx.globalAlpha = a;
    if (s.r > 1.6) { // soft glow on the bigger dots
      const grd = ctx.createRadialGradient(s.x, y, 0, s.x, y, s.r * 3);
      grd.addColorStop(0, `rgba(${CREAM},0.35)`); grd.addColorStop(1, `rgba(${CREAM},0)`);
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(s.x, y, s.r * 3, 0, 6.283); ctx.fill();
    }
    ctx.fillStyle = `rgb(${CREAM})`;
    ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (!reduce) requestAnimationFrame(draw);
}
build();
let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduce) draw(performance.now()); }, 150); });
if (reduce) addEventListener("scroll", () => draw(performance.now()), { passive: true });
requestAnimationFrame(draw);
