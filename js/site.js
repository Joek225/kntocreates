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
