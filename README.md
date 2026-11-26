# Joey makes things

A plain HTML/CSS/JS site with no build step. Open it with any static server
(`python3 -m http.server`) or host it on GitHub Pages.

## Add a design
1. In Fusion: right click the body > **Save As Mesh** > STL. Put it in `models/` (this is the 3D preview).
2. Put the files people download in `models/` too (.f3d, .step, .stl), or use Fusion public share links.
3. Open `js/designs.js`, copy the sample entry and fill in `title`, `summary`, `date`, `model`,
   `downloads`, `instagram` and `youtube`. Newest design goes at the top.
4. Delete the sample cycloidal drive entry whenever you want.

## Other edits
- Channel links: `js/site.js`
- About photo: put it in `images/` and replace the placeholder in `about.html`
- Colors and fonts: top of `css/style.css` (colors come from the gym site and the macOS browser project; font is Avenir with Nunito as the fallback)

## Viewer controls (same as Fusion)
Shift + middle drag orbits, middle drag pans, scroll zooms, F6 fits. Left drag orbits and right drag pans too, for trackpads.
