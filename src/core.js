import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ---------------- utilidades ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const BRL = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const BRLk = v => 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + ' mil';
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const C = { orange: 0xFF8A3D, teal: 0x2EC4B6, red: 0xFF4D5E, green: 0x5BD68A, blue: 0x4C8DFF, violet: 0xB48CFF, yellow: 0xFFC94D, ink: 0xEAF0FF, mute: 0x8D9AB8 };
const ONDA_COLOR = { 0: 0x8D9AB8, 1: C.orange, 2: C.teal, 3: C.blue };
const ONDA_HEX = { 0: '#8D9AB8', 1: '#FF8A3D', 2: '#2EC4B6', 3: '#4C8DFF' };
const srcLink = k => SOURCES[k] ? `<a href="${SOURCES[k].url}" target="_blank" rel="noopener">${SOURCES[k].name}</a>` : '';
const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
const itemTotal = x => Math.round(x.qtd * x.un * 100) / 100;

/* ---------------- renderer / cena ---------------- */
const stage = $('#stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x070B16);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x070B16, 45, 110);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 400);
camera.position.set(30, 22, 30);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .07;
controls.minDistance = 8; controls.maxDistance = 80; controls.maxPolarAngle = Math.PI * .49;
controls.enablePan = true;

scene.add(new THREE.HemisphereLight(0xBFD4FF, 0x1A1208, .75));
const sun = new THREE.DirectionalLight(0xFFE2C4, 1.6);
sun.position.set(18, 30, 12); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 90 });
scene.add(sun);
const rim = new THREE.DirectionalLight(0x6E8CFF, .55); rim.position.set(-20, 10, -18); scene.add(rim);

/* chão e estrelas */
const ground = new THREE.Mesh(new THREE.CircleGeometry(120, 64), new THREE.MeshStandardMaterial({ color: 0x0A1020, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -0.06; ground.receiveShadow = true; scene.add(ground);
const grid = new THREE.GridHelper(160, 80, 0x1C2A4A, 0x121C33); grid.position.y = -0.04; scene.add(grid);
{
  const g = new THREE.BufferGeometry(); const n = 1400; const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const r = 120 + Math.random() * 80, th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * .45; p[i * 3] = r * Math.cos(th) * Math.cos(ph); p[i * 3 + 1] = 8 + r * Math.sin(ph); p[i * 3 + 2] = r * Math.sin(th) * Math.cos(ph); }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const stars = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9FB4E8, size: .6, transparent: true, opacity: .7, fog: false }));
  scene.add(stars);
}
/* sol do horizonte (capa) */
const horizonSun = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d');
  const gr = x.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,190,120,1)'); gr.addColorStop(.25, 'rgba(255,138,61,.9)'); gr.addColorStop(.6, 'rgba(255,90,40,.25)'); gr.addColorStop(1, 'rgba(255,60,20,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, fog: false, opacity: 0 }));
  sp.scale.set(70, 70, 1); sp.position.set(-30, 4, -70); scene.add(sp); return sp;
})();

/* ---------------- materiais / helpers ---------------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: .1, ...o });
const glow = (color, o = {}) => new THREE.MeshBasicMaterial({ color, transparent: true, ...o });
function box(w, h, d, m, x = 0, y = 0, z = 0) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; return b; }
function edges(geo, color, opacity = .5) { return new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color, transparent: true, opacity })); }
function curveLine(points, color, opacity = .8, tension = .5) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'catmullrom', tension);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  line.userData.curve = curve; return line;
}
function arc(a, b, h = 3, color = C.teal, opacity = .8) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const M = A.clone().add(B).multiplyScalar(.5); M.y += h;
  const curve = new THREE.QuadraticBezierCurve3(A, M, B);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  line.userData.curve = curve; return line;
}
function kChain(o) { let k = 1; for (let p = o; p; p = p.parent) if (p.userData.k !== undefined) k *= p.userData.k; return k; }
function applyOpacity(o, acc) {
  if (o.userData.k !== undefined) acc *= o.userData.k;
  const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
  ms.forEach(m => { if (m.userData.base === undefined) { m.userData.base = m.opacity; m.userData.t0 = m.transparent; } m.opacity = m.userData.base * acc; const tr = m.userData.t0 || m.opacity < .999; if (tr !== m.transparent) { m.transparent = tr; m.needsUpdate = true; } });
  o.children.forEach(c => applyOpacity(c, acc));
}
function setOpacity(g, k) { g.userData.k = k; applyOpacity(g, kChain(g.parent)); }

/* ---------------- tweens ---------------- */
const tweens = [];
function tween(dur, fn, done) { const t = { t0: performance.now(), dur, fn, done }; tweens.push(t); return t; }
function runTweens(now) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const t = tweens[i]; const k = Math.min(1, (now - t.t0) / t.dur); t.fn(ease(k), k);
    if (k >= 1) { tweens.splice(i, 1); t.done && t.done(); }
  }
}
function fadeGroup(g, on, dur = 600, to_ = null) {
  if (on) g.visible = true;
  const from = g.userData.k ?? (on ? 0 : 1), to = to_ ?? (on ? 1 : 0);
  if (g.userData.ft) g.userData.ft.dur = 0;
  g.userData.ft = tween(dur, e => setOpacity(g, lerp(from, to, e)), () => { if (!on) g.visible = false; });
}
function flyTo(pos, target, dur = 1400) {
  const p0 = camera.position.clone(), t0 = controls.target.clone();
  const p1 = new THREE.Vector3(...pos), t1 = new THREE.Vector3(...target);
  tween(dur, e => { camera.position.lerpVectors(p0, p1, e); controls.target.lerpVectors(t0, t1, e); });
}

/* ---------------- rótulos HTML ---------------- */
const labelsEl = $('#labels');
const labels = [];
function label(text, obj, { cls = '', offset = [0, 0, 0], onClick = null, tip = null } = {}) {
  const el = document.createElement('div'); el.className = 'lbl ' + cls; el.innerHTML = text;
  if (onClick) { el.classList.add('click'); el.addEventListener('click', e => { e.stopPropagation(); onClick(); }); }
  labelsEl.appendChild(el);
  const L = { el, obj, offset: new THREE.Vector3(...offset), alpha: 1 }; labels.push(L); return L;
}
function chainVisible(o) { let last = o; while (o) { if (!o.visible) return false; last = o; o = o.parent; } return last === scene; }
const _v = new THREE.Vector3();
function updateLabels() {
  const w = innerWidth, h = innerHeight;
  for (const L of labels) {
    const vis = chainVisible(L.obj);
    if (!vis) { if (L.el.style.display !== 'none') L.el.style.display = 'none'; continue; }
    L.obj.getWorldPosition(_v).add(L.offset); _v.project(camera);
    if (_v.z > 1 || _v.z < -1) { L.el.style.display = 'none'; continue; }
    L.el.style.display = '';
    L.el.style.left = ((_v.x + 1) / 2 * w) + 'px'; L.el.style.top = ((1 - _v.y) / 2 * h) + 'px';
    let k = 1; let o = L.obj; while (o) { if (o.userData.k !== undefined) k *= o.userData.k; o = o.parent; }
    L.el.style.opacity = (k * L.alpha).toFixed(2);
  }
}

/* ---------------- interação (raycast) ---------------- */
const ray = new THREE.Raycaster(); const mouse = new THREE.Vector2(); let hovered = null;
const tooltip = $('#tooltip');
const pickables = [];
function pickable(mesh, { tip, onClick, hoverScale = 1 } = {}) { mesh.userData.pick = { tip, onClick, hoverScale }; pickables.push(mesh); return mesh; }
function hilite(o, on) {
  if (!o) return;
  const m = o.material; if (m && m.emissive) { if (m.userData.ei === undefined) m.userData.ei = m.emissiveIntensity; m.emissiveIntensity = on ? m.userData.ei + .9 : m.userData.ei; if (on && m.emissive.getHex() === 0) { m.userData.e0 = true; m.emissive.setHex(0x333333); } else if (!on && m.userData.e0) { m.emissive.setHex(0); m.userData.e0 = false; } }
  const s = o.userData.pick.hoverScale; if (s !== 1) { if (on) { o.userData.s0 = o.scale.clone(); o.scale.multiplyScalar(s); } else if (o.userData.s0) o.scale.copy(o.userData.s0); }
}
function pickAt(ev) {
  mouse.set(ev.clientX / innerWidth * 2 - 1, -ev.clientY / innerHeight * 2 + 1);
  ray.setFromCamera(mouse, camera);
  const list = pickables.filter(chainVisible);
  const hit = ray.intersectObjects(list, false)[0];
  return hit ? hit.object : null;
}
renderer.domElement.addEventListener('pointermove', ev => {
  const o = pickAt(ev);
  if (o !== hovered) {
    hilite(hovered, false); hovered = o; hilite(o, true);
  }
  renderer.domElement.style.cursor = o ? 'pointer' : 'grab';
  if (o && o.userData.pick.tip) {
    const tip = typeof o.userData.pick.tip === 'function' ? o.userData.pick.tip() : o.userData.pick.tip;
    tooltip.innerHTML = tip; tooltip.classList.add('on');
    const x = Math.min(ev.clientX + 16, innerWidth - 300); tooltip.style.left = x + 'px'; tooltip.style.top = (ev.clientY + 14) + 'px';
  } else tooltip.classList.remove('on');
});
let downAt = null;
renderer.domElement.addEventListener('pointerdown', ev => downAt = [ev.clientX, ev.clientY]);
renderer.domElement.addEventListener('pointerup', ev => {
  if (!downAt || Math.hypot(ev.clientX - downAt[0], ev.clientY - downAt[1]) > 5) return;
  const o = pickAt(ev); if (o && o.userData.pick.onClick) o.userData.pick.onClick();
});

addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); applyViewOffset(); });
/* desloca o centro de visão para a direita quando o painel lateral está aberto */
let panelSide = true;
function applyViewOffset() {
  const w = innerWidth, h = innerHeight;
  if (panelSide && w > 820) { const shift = Math.min(460, w * .4) * .5 + 10; camera.setViewOffset(w, h, -shift, 0, w, h); }
  else if (w <= 820) { camera.setViewOffset(w, h, 0, h * .18, w, h); }
  else camera.setViewOffset(w, h, 0, h * .2, w, h);
  camera.updateProjectionMatrix();
}
