import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const MATERIALS = {
  part: () => new THREE.MeshStandardMaterial({ color: 0x8dc5f0, metalness: 0.05, roughness: 0.45 }),
  pin: () => new THREE.MeshStandardMaterial({ color: 0xd9dbe6, metalness: 0.85, roughness: 0.25 }),
  housing: () => new THREE.MeshStandardMaterial({ color: 0x4b5590, metalness: 0.1, roughness: 0.6 }),
  accent: () => new THREE.MeshStandardMaterial({ color: 0xf3ecdc, metalness: 0.1, roughness: 0.5 }),
  glass: () => new THREE.MeshStandardMaterial({ color: 0xf3ecdc, metalness: 0, roughness: 0.3, transparent: true, opacity: 0.28, depthWrite: false }),
};

/* ---------- Sample model: a cycloidal drive, built in code ---------- */
function cycloidal() {
  const R = 30, Rr = 3, E = 1.5, N = 10, T = 6; // pin circle, pin radius, eccentricity, pins, thickness
  const group = new THREE.Group();

  // disc profile (N-1 lobes)
  const shape = new THREE.Shape();
  const steps = 720;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const psi = Math.atan2(Math.sin((1 - N) * t), R / (E * N) - Math.cos((1 - N) * t));
    const x = R * Math.cos(t) - Rr * Math.cos(t + psi) - E * Math.cos(N * t);
    const y = -R * Math.sin(t) + Rr * Math.sin(t + psi) + E * Math.sin(N * t);
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  }
  const center = new THREE.Path(); center.absarc(0, 0, 8, 0, Math.PI * 2, true); shape.holes.push(center);
  const holeR = 16, outPinR = 2.5, holeSize = outPinR + E;
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2, h = new THREE.Path();
    h.absarc(Math.cos(a) * holeR, Math.sin(a) * holeR, holeSize, 0, Math.PI * 2, true);
    shape.holes.push(h);
  }
  const discGeo = new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: true, bevelSize: 0.4, bevelThickness: 0.4, bevelSegments: 2, curveSegments: 48 });
  discGeo.translate(0, 0, -T / 2);
  const disc = new THREE.Mesh(discGeo, MATERIALS.part());

  // housing ring with pins
  const ringShape = new THREE.Shape(); ringShape.absarc(0, 0, R + 8, 0, Math.PI * 2, false);
  const ringHole = new THREE.Path(); ringHole.absarc(0, 0, R + 1.2, 0, Math.PI * 2, true); ringShape.holes.push(ringHole);
  const ringGeo = new THREE.ExtrudeGeometry(ringShape, { depth: T + 4, bevelEnabled: false, curveSegments: 96 });
  ringGeo.translate(0, 0, -(T + 4) / 2);
  const housing = new THREE.Mesh(ringGeo, MATERIALS.housing());
  const baseGeo = new THREE.CylinderGeometry(R + 8, R + 8, 3, 96); baseGeo.rotateX(Math.PI / 2); baseGeo.translate(0, 0, -(T + 4) / 2 - 1.5);
  housing.add(new THREE.Mesh(baseGeo, MATERIALS.housing()));
  const pinGeo = new THREE.CylinderGeometry(Rr, Rr, T + 3.4, 32); pinGeo.rotateX(Math.PI / 2);
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2, p = new THREE.Mesh(pinGeo, MATERIALS.pin());
    p.position.set(Math.cos(a) * R, Math.sin(a) * R, 0); housing.add(p);
  }

  // output plate with its 6 pins (stays centered, turns slowly)
  const output = new THREE.Group();
  const plateGeo = new THREE.CylinderGeometry(22, 22, 3, 72); plateGeo.rotateX(Math.PI / 2); plateGeo.translate(0, 0, T / 2 + 2.5);
  output.add(new THREE.Mesh(plateGeo, MATERIALS.glass()));
  const outPinGeo = new THREE.CylinderGeometry(outPinR, outPinR, T + 2, 24);
  const outPinMat = MATERIALS.accent(); outPinGeo.rotateX(Math.PI / 2);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2, p = new THREE.Mesh(outPinGeo, outPinMat);
    p.position.set(Math.cos(a) * holeR, Math.sin(a) * holeR, 0.5); output.add(p);
  }

  // input shaft + eccentric cam
  const input = new THREE.Group();
  const shaftGeo = new THREE.CylinderGeometry(3, 3, 30, 32); shaftGeo.rotateX(Math.PI / 2); shaftGeo.translate(0, 0, -8);
  input.add(new THREE.Mesh(shaftGeo, MATERIALS.pin()));
  const camGeo = new THREE.CylinderGeometry(7.8, 7.8, T, 48); camGeo.rotateX(Math.PI / 2);
  const cam = new THREE.Mesh(camGeo, MATERIALS.pin()); input.add(cam);

  group.add(housing, disc, output, input);
  group.rotation.x = -Math.PI / 2; // lay it flat like it sits on a desk

  let theta = 0;
  const update = (dt) => {
    theta += dt * 2.2;
    const discAngle = -theta / (N - 1);
    disc.position.set(E * Math.cos(theta), E * Math.sin(theta), 0);
    disc.rotation.z = discAngle;
    cam.position.set(E * Math.cos(theta), E * Math.sin(theta), 0);
    input.rotation.z = 0;
    output.rotation.z = discAngle;
  };
  update(0);
  return { object: group, update };
}

const PROCEDURAL = { cycloidal };

async function loadModel(url) {
  const ext = url.split("?")[0].split(".").pop().toLowerCase();
  const mat = MATERIALS.part();
  if (ext === "stl") {
    const { STLLoader } = await import("three/addons/loaders/STLLoader.js");
    const geo = await new STLLoader().loadAsync(url); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; // Fusion exports Z-up
    return m;
  }
  if (ext === "obj") {
    const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js");
    const o = await new OBJLoader().loadAsync(url); o.traverse((c) => c.isMesh && (c.material = mat)); return o;
  }
  if (ext === "3mf") {
    const { ThreeMFLoader } = await import("three/addons/loaders/3MFLoader.js");
    return await new ThreeMFLoader().loadAsync(url);
  }
  const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
  return (await new GLTFLoader().loadAsync(url)).scene;
}

export async function buildObject(design) {
  if (design.model) return { object: await loadModel(design.model), update: null };
  if (design.procedural && PROCEDURAL[design.procedural]) return PROCEDURAL[design.procedural]();
  const m = new THREE.Mesh(new THREE.BoxGeometry(40, 20, 40), MATERIALS.part());
  return { object: m, update: null };
}

function makeScene(renderer) {
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(60, 120, 80); scene.add(key);
  scene.add(new THREE.HemisphereLight(0xdfe2f1, 0x21232e, 0.6));
  return scene;
}

function frame(camera, object, controls, tight = 0.95) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const c = box.getCenter(new THREE.Vector3());
  const dist = size / (2 * Math.tan((camera.fov * Math.PI) / 360)) * tight;
  const dir = new THREE.Vector3(0.9, 1.5, 1.1).normalize(); // Fusion-style "home" isometric
  camera.position.copy(c).addScaledVector(dir, dist);
  camera.near = size / 100; camera.far = size * 100; camera.updateProjectionMatrix();
  if (controls) { controls.target.copy(c); controls.update(); } else camera.lookAt(c);
}

/* ---------- Interactive viewer with Fusion 360 mouse controls ----------
   Shift + middle drag : orbit        Middle drag : pan
   Scroll              : zoom (to cursor)    F6 : fit
   Also: left drag orbits and right drag pans, for trackpads.            */
export async function mountViewer(container, design) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.prepend(renderer.domElement);
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute("aria-label", `3D model of ${design.title}. Drag to rotate.`);

  const scene = makeScene(renderer);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 5000);
  const controls = new OrbitControls(camera, renderer.domElement);
  // OrbitControls swaps PAN to ROTATE while Shift is held, which is exactly Fusion's Shift+MMB orbit.
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN };
  controls.enableDamping = true; controls.dampingFactor = 0.12;
  controls.zoomToCursor = true; controls.screenSpacePanning = true;
  renderer.domElement.addEventListener("mousedown", (e) => { if (e.button === 1) e.preventDefault(); });

  const { object, update } = await buildObject(design);
  scene.add(object);

  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(container); resize();
  frame(camera, object, controls);

  const fit = () => frame(camera, object, controls);
  addEventListener("keydown", (e) => { if (e.key === "F6") { e.preventDefault(); fit(); } });

  let playing = false, last = performance.now();
  renderer.setAnimationLoop((now) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (playing && update) update(dt);
    controls.update(); renderer.render(scene, camera);
  });
  return { fit, canAnimate: !!update, toggle: () => (playing = !playing) };
}

/* ---------- Static preview images for the cards ---------- */
let thumbRenderer;
export async function renderThumb(design, w = 640, h = 480) {
  thumbRenderer ??= new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  thumbRenderer.setPixelRatio(1); thumbRenderer.setSize(w, h, false);
  thumbRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = makeScene(thumbRenderer);
  const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 5000);
  const { object } = await buildObject(design);
  scene.add(object); frame(camera, object, null, 0.72);
  thumbRenderer.render(scene, camera);
  return thumbRenderer.domElement.toDataURL("image/png");
}

/* ---------- Hero model: runs by itself, leans toward the cursor ---------- */
export async function mountHero(container, design) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.prepend(renderer.domElement);
  const scene = makeScene(renderer);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 5000);
  const { object, update } = await buildObject(design);
  const pivot = new THREE.Group(); pivot.add(object); scene.add(pivot);
  const resize = () => { const s = container.clientWidth; renderer.setSize(s, s, false); camera.aspect = 1; camera.updateProjectionMatrix(); };
  new ResizeObserver(resize).observe(container); resize();
  frame(camera, pivot, null, 0.82);

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouse = { x: 0, y: 0 }, lean = { x: 0, y: 0 };
  addEventListener("pointermove", (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(container);

  let last = performance.now(), spin = 0, intro = 0;
  renderer.setAnimationLoop((now) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!visible) return;
    if (!reduce) {
      intro = Math.min(intro + dt / 1.6, 1);
      const ease = 1 - Math.pow(1 - intro, 4);
      spin += dt * 0.12;
      lean.x += (mouse.x - lean.x) * 0.05; lean.y += (mouse.y - lean.y) * 0.05;
      pivot.rotation.y = spin + lean.x * 0.5 + (1 - ease) * -1.2;
      pivot.rotation.x = lean.y * 0.25;
      pivot.position.y = (1 - ease) * -12;
      if (update) update(dt * 0.6);
    }
    renderer.render(scene, camera);
  });
  container.classList.add("ready");
}
