/*
  ============================================================
  YOUR DESIGNS: add one object per design to this list.
  The newest design goes at the top.
  ============================================================

  id          short name used in the link, e.g. design.html?id=phone-case
  title       name shown on the list and the design page
  summary     one short line shown in the list on the home page
  date        when you posted it, as "YYYY-MM-DD"
  model       the preview: a mesh in /models (.stl, .glb, .obj or .3mf).
              In Fusion: right click the body > Save As Mesh > STL, then drop it in /models.
  fusionEmbed optional: a Fusion "Share > Public link > Embed" URL, shown instead of the model
  downloads   one button per file: { label: "Fusion 360 (.f3d)", url: "models/phone-case.f3d" }
              The url can be a file in /models or a Fusion public share link.
  instagram   link to the reel
  youtube     link to the short
  thumb       optional preview image; if left out, one is rendered from the model
*/

export const DESIGNS = [
  {
    id: "cycloidal-drive",
    title: "Cycloidal Drive",
    summary: "A compact 9:1 gearbox where a wobbling disc rolls around a ring of pins.",
    date: "2026-11-26",
    model: null,              // sample: built in code, no Fusion file yet
    procedural: "cycloidal",
    fusionEmbed: null,
    downloads: [
      { label: "Fusion 360 (.f3d)", url: null },
      { label: "STEP", url: null },
      { label: "STL", url: null },
    ],
    instagram: null,
    youtube: null,
  },
];
