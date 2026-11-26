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

// Dimension lines: measure each path so it draws itself
document.querySelectorAll(".draw path, .draw line").forEach((p) => p.style.setProperty("--len", Math.ceil(p.getTotalLength())));
