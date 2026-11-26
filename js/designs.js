/*
  ============================================================
  YOUR DESIGNS: add one object per design to this list.
  ============================================================

  id          short name used in the link, e.g. design.html?id=phone-case
  title       name shown on the card and the page
  summary     one sentence shown under the title
  tags        small labels, e.g. ["3D printed", "FEA"]
  process     "3D printed" or "Laser cut" (shown on the card)
  model       path to an exported model in /models (.stl, .glb, .obj or .3mf).
              In Fusion: right click the body > Save as Mesh > STL, then drop it in /models.
  fusionEmbed optional: a Fusion "Share > Public link > Embed" URL. If set, the
              Autodesk viewer is shown instead of the model file.
  download    link to the Fusion file (.f3d) people can download, or the public share link
  instagram   link to the reel
  youtube     link to the short
  specs       little facts table: [["Material", "PLA"], ...]
  body        the explanation, written in simple HTML
  thumb       optional preview image; if left out, a preview is rendered from the model
*/

export const DESIGNS = [
  {
    id: "cycloidal-drive",
    title: "Cycloidal Drive",
    sample: true,
    summary: "A compact 9:1 gearbox where a wobbling disc rolls around a ring of pins.",
    tags: ["3D printed", "Gearbox", "Sample"],
    process: "3D printed",
    model: null,            // sample: built in code, no Fusion file yet
    procedural: "cycloidal",
    fusionEmbed: null,
    download: null,
    instagram: null,
    youtube: null,
    specs: [
      ["Reduction", "9 : 1"],
      ["Ring pins", "10"],
      ["Material", "PLA / PETG"],
      ["Print time", "~ 6 h"],
    ],
    body: `
      <h2>What it is</h2>
      <p>A cycloidal drive turns a fast, weak rotation into a slow, strong one. The input shaft spins an
      off-center cam. That cam makes a lobed disc wobble around inside a ring of fixed pins. Because the
      disc has one fewer lobe than there are pins, it creeps backwards by one lobe every time the input
      spins once.</p>

      <h2>Where you see it</h2>
      <ul>
        <li>Robot arm joints and industrial robots</li>
        <li>Conveyor belts and heavy machinery</li>
        <li>Combat and competition robots that need torque in a small space</li>
      </ul>

      <h2>Why it's good</h2>
      <ul>
        <li><strong>High reduction in one stage.</strong> 9:1 here, and up to 100:1 is possible with no extra gears.</li>
        <li><strong>Almost no backlash.</strong> Many lobes touch pins at once, so there is very little slop.</li>
        <li><strong>Survives shock loads.</strong> The load is shared across lots of contact points.</li>
        <li><strong>Prints well.</strong> Smooth, round shapes with no tiny teeth to break.</li>
      </ul>

      <h2>How I CAD'd it</h2>
      <p>The disc profile comes from a parametric equation driven by four numbers: pin circle radius,
      pin radius, eccentricity and number of pins. In Fusion that goes in as a spline from a script, then
      gets extruded. Change the parameters and the whole gearbox updates.</p>
      <p><em>This is a sample entry. Hit play in the viewer to watch it run.</em></p>
    `,
  },
];
