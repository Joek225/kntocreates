# Joey makes things

A plain HTML/CSS/JS site with no build step. Open it with any static server
(`python3 -m http.server`) or host it on GitHub Pages.

## Add a design
1. In Fusion: right click the body > **Save As Mesh** > STL (or export OBJ/GLB/3MF). Put it in `models/`.
2. Open `js/designs.js` and copy the sample entry. Set `model: "models/your-file.stl"`,
   `download` (your Fusion public share link or an .f3d in `models/`), `instagram` and `youtube`.
3. Optional: `fusionEmbed` with a Fusion "Share > Public link > Embed" URL shows Autodesk's own viewer instead.
4. Delete the sample cycloidal drive entry whenever you want.

## Other edits
- Channel links: `js/site.js`
- About photo: put it in `images/` and replace the placeholder in `about.html`
- Colors and fonts: top of `css/style.css` (colors come from the gym site and the macOS browser project; font is Avenir with Nunito as the fallback)

## Viewer controls (same as Fusion)
Shift + middle drag orbits, middle drag pans, scroll zooms, F6 fits. Left drag orbits and right drag pans too, for trackpads.
