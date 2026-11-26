// Your channel links: paste them here and every Instagram / YouTube link on the site updates.
const SOCIAL = {
  instagram: "https://instagram.com/",
  youtube: "https://youtube.com/",
};
for (const a of document.querySelectorAll("[data-social]")) {
  a.href = SOCIAL[a.dataset.social]; a.target = "_blank"; a.rel = "noopener";
}

const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Fade things up as they scroll into view
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}, { rootMargin: "0px 0px -8% 0px" });
export function reveal(root = document) { root.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => io.observe(el)); }
reveal();

// Big headings shrink to fit their column if a wide font (Avenir) would overflow it
const fitBig = () => document.querySelectorAll(".big").forEach((h) => {
  h.style.fontSize = "";
  const col = h.parentElement.clientWidth;
  const widest = Math.max(...[...h.querySelectorAll(".line-mask > span")].map((s) => s.scrollWidth));
  if (widest > col) h.style.fontSize = parseFloat(getComputedStyle(h).fontSize) * (col / widest) * 0.97 + "px";
});
fitBig(); document.fonts.ready.then(fitBig);
let ft; addEventListener("resize", () => { clearTimeout(ft); ft = setTimeout(fitBig, 120); });
