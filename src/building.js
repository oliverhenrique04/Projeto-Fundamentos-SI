/* ============================================================
   PRÉDIO 3D — 2 pavimentos (vista explodida), um grupo por andar
   ============================================================ */
const UP = 6.2;      // altura do piso superior (explodido)
const H = 2.6;       // pé-direito visual
const ROOMS = [
  { id: 'deposito', name: 'Depósito', f: 0, x: [-10, -1], z: [-6, 6], c: 0x24324F },
  { id: 'expedicao', name: 'Expedição', f: 0, x: [-1, 4], z: [-6, 0], c: 0x2B2F4D },
  { id: 'comercial', name: 'Comercial', f: 0, x: [-1, 10], z: [0, 6], c: 0x223A48 },
  { id: 'recepcao', name: 'Recepção', f: 0, x: [4, 10], z: [-6, 0], c: 0x2A2A44 },
  { id: 'adm', name: 'Administração', f: 1, x: [-10, -3], z: [-6, 6], c: 0x263452 },
  { id: 'fin', name: 'Financeiro', f: 1, x: [-3, 3], z: [-6, 6], c: 0x2C3150 },
  { id: 'reuniao', name: 'Reuniões', f: 1, x: [3, 10], z: [-6, 1], c: 0x2A2D46 },
  { id: 'ger', name: 'Gerência', f: 1, x: [3, 10], z: [1, 6], c: 0x24384A },
];
const R = Object.fromEntries(ROOMS.map(r => [r.id, r]));

const building = (() => {
  const root = new THREE.Group(); root.name = 'building'; scene.add(root);
  const mk = () => { const g = new THREE.Group(); return g; };
  const F = [0, 1].map(f => { const g = mk(); g.position.y = f * UP; g.userData.k = 1; root.add(g); return g; });
  const L = F.map(fg => { const o = { base: mk(), before: mk(), after: mk(), hot: mk() }; Object.values(o).forEach(g => fg.add(g)); return o; });
  const shared = { before: mk(), after: mk() }; const sharedRoot = mk(); sharedRoot.userData.k = 1; root.add(sharedRoot); sharedRoot.add(shared.before, shared.after);
  const BEFORE = [L[0].before, L[1].before, shared.before], AFTER = [L[0].after, L[1].after, shared.after], HOT = [L[0].hot, L[1].hot];

  // lajes e pilares
  [0, 1].forEach(f => {
    const slab = box(20.6, .25, 12.6, mat(f ? 0x18223A : 0x141C30), 0, -.14, 0); L[f].base.add(slab);
    const e = edges(slab.geometry, 0x5470A8, .5); e.position.copy(slab.position); L[f].base.add(e);
  });
  [[-10, -6], [10, -6], [-10, 6], [10, 6]].forEach(([x, z]) => { const c = box(.18, UP - .2, .18, mat(0x34466E, { transparent: true, opacity: .45 }), x, UP / 2 - .1, z); c.castShadow = false; sharedRoot.add(c); });

  // salas
  const roomMeshes = {};
  ROOMS.forEach(r => {
    const w = r.x[1] - r.x[0] - .12, d = r.z[1] - r.z[0] - .12;
    const cx = (r.x[0] + r.x[1]) / 2, cz = (r.z[0] + r.z[1]) / 2;
    const floor = box(w, .06, d, new THREE.MeshStandardMaterial({ color: r.c, roughness: .9, emissive: 0xFF8A3D, emissiveIntensity: 0 }), cx, .02, cz);
    L[r.f].base.add(floor); roomMeshes[r.id] = floor;
    const wallGeo = new THREE.BoxGeometry(w, H, d);
    const wall = new THREE.LineSegments(new THREE.EdgesGeometry(wallGeo), new THREE.LineBasicMaterial({ color: 0x6D8CCB, transparent: true, opacity: .28 }));
    wall.position.set(cx, H / 2, cz); L[r.f].base.add(wall);
    const anchor = new THREE.Object3D(); anchor.position.set(cx, .1, cz); L[r.f].base.add(anchor);
    r.label = label(r.name, anchor, { cls: 'room' });
  });

  // estantes do depósito
  const boxColors = [0xC9824A, 0xB0703F, 0xD9A066, 0x8C6A4A, 0x5E86B8];
  for (let i = 0; i < 4; i++) {
    const x = -8.6 + i * 2.1;
    for (let s = 0; s < 2; s++) {
      const z = s ? 2.8 : -2.4;
      L[0].base.add(box(.9, 2.1, 4.2, mat(0x3E5277), x, 1.05, z));
      for (let k = 0; k < 9; k++) L[0].base.add(box(.7, .45, .6, mat(boxColors[(i + k + s) % 5], { roughness: .95 }), x, .35 + (k % 3) * .7, z - 1.6 + Math.floor(k / 3) * 1.6));
    }
  }
  // mesas e computadores
  const pcScreens = [];
  function desk(f, x, z, rot, roomId) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot;
    const dm = mat(0x4A5C82);
    g.add(box(1.2, .08, .7, dm, 0, .75, 0)); g.add(box(.08, .75, .6, dm, -.55, .37, 0)); g.add(box(.08, .75, .6, dm, .55, .37, 0));
    const scr = box(.62, .38, .04, new THREE.MeshStandardMaterial({ color: 0x0B1022, emissive: 0x5A8CFF, emissiveIntensity: .5 }), 0, 1.07, -.2);
    g.add(scr); g.add(box(.08, .2, .08, dm, 0, .87, -.2));
    scr.userData.room = roomId; pcScreens.push(scr); L[f].base.add(g);
  }
  [[0, -3.4], [2.4, -3.4]].forEach(([x, z]) => desk(0, x, z, 0, 'expedicao'));
  [[0.5, 2.2], [2.8, 2.2], [5.1, 2.2], [7.4, 2.2], [0.5, 4.6], [2.8, 4.6], [5.1, 4.6]].forEach(([x, z]) => desk(0, x, z, 0, 'comercial'));
  desk(0, 7, -2.5, Math.PI / 2, 'recepcao'); desk(0, -2, 4.8, Math.PI, 'deposito');
  [[-8.5, -3.5], [-6, -3.5], [-8.5, 0], [-6, 0], [-8.5, 3.5]].forEach(([x, z]) => desk(1, x, z, 0, 'adm'));
  [[-1.5, -3], [1.2, -3], [-1.5, 0.5]].forEach(([x, z]) => desk(1, x, z, 0, 'fin'));
  [[5.5, 3.5], [8, 3.5]].forEach(([x, z]) => desk(1, x, z, 0, 'ger'));
  L[1].base.add(box(4, .1, 1.6, mat(0x5B6E96), 6.5, .75, -2.6));
  for (let i = 0; i < 6; i++) L[1].base.add(box(.4, .5, .4, mat(0x34466E), 5 + (i % 3) * 1.5, .25, -2.6 + (i < 3 ? -1.2 : 1.2)));

  /* ---------- ANTES ---------- */
  let seed = 7; const srand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const cableColors = [0x8D9AB8, 0x6C7A99, 0xD6B85A, 0x5C7FBF, 0xA0A8B8];
  for (let i = 0; i < 16; i++) {
    const pts = []; const n = 5 + Math.floor(srand() * 3);
    let x = -9 + srand() * 18, z = -5 + srand() * 10;
    for (let k = 0; k < n; k++) { pts.push(new THREE.Vector3(x, 2.35 + srand() * .35 - (k % 2) * .35, z)); x += (srand() - .5) * 8; z += (srand() - .5) * 6; x = Math.max(-9.6, Math.min(9.6, x)); z = Math.max(-5.6, Math.min(5.6, z)); }
    L[0].before.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, .035, 5, false), mat(cableColors[i % 5])));
  }
  for (let i = 0; i < 3; i++) {
    const x = -2 + i * 1.3;
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 2.6, -5.5), new THREE.Vector3(x + .6, 4, -5.8), new THREE.Vector3(x - .4, UP - .1, -5.5)]);
    shared.before.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, .035, 5, false), mat(0x8D9AB8)));
  }
  const routers = [];
  [[0, 7.5, .9, -4.5], [0, 3, .9, 5.3], [1, -7, .9, 5.2]].forEach(([f, x, y, z]) => {
    const r = box(.5, .12, .35, mat(0xEDEDED), x, y, z); L[f].before.add(r);
    const led = new THREE.Mesh(new THREE.SphereGeometry(.05), glow(C.red)); led.position.set(x + .18, y + .08, z + .18); L[f].before.add(led); routers.push(led);
    const cov = new THREE.Mesh(new THREE.SphereGeometry(3.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: C.red, transparent: true, opacity: .07, depthWrite: false }));
    cov.position.set(x, y - .9, z); L[f].before.add(cov);
    const ring = new THREE.Mesh(new THREE.RingGeometry(3.3, 3.4, 48), new THREE.MeshBasicMaterial({ color: C.red, transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(x, y - .85, z); L[f].before.add(ring);
  });
  const oldPrinter = box(.8, .5, .6, mat(0x9AA3B5), 1.2, .25, -5.2); L[0].before.add(oldPrinter);
  for (let i = 0; i < 6; i++) L[0].before.add(box(.42, .02, .3, mat(0xF4F1E8), .2 - i * .12, .55 + i * .05, -5.2));
  label('Roteador doméstico', routers[0], { cls: 'sm', offset: [0, .5, 0] });
  label('Fila de impressão', oldPrinter, { cls: 'sm', offset: [0, .9, 0] });

  /* ---------- DEPOIS ---------- */
  const rackG = new THREE.Group(); rackG.position.set(-.6, 0, -5.3); L[0].after.add(rackG);
  const rack = box(.9, 2.2, .7, mat(0x1A1F2E, { metalness: .5, roughness: .4 }), 0, 1.1, 0); rackG.add(rack);
  const rackLeds = [];
  for (let i = 0; i < 6; i++) {
    rackG.add(box(.8, .14, .05, mat(0x2B3550), 0, .5 + i * .27, .36));
    for (let k = 0; k < 6; k++) { const l = new THREE.Mesh(new THREE.BoxGeometry(.04, .03, .02), glow(i === 3 ? C.orange : C.green)); l.position.set(-.3 + k * .1, .5 + i * .27, .39); rackG.add(l); rackLeds.push(l); }
  }
  const tray = (grp, pts) => grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p))), new THREE.LineBasicMaterial({ color: C.teal, transparent: true, opacity: .9 })));
  const Y = 2.4;
  tray(L[0].after, [[-.6, Y, -5.3], [-.6, Y, -5.8], [-9.6, Y, -5.8], [-9.6, Y, 5.8], [-1, Y, 5.8]]);
  tray(L[0].after, [[-.6, Y, -5.8], [9.6, Y, -5.8], [9.6, Y, 5.8], [-1, Y, 5.8]]);
  tray(L[0].after, [[-5.5, Y, -5.8], [-5.5, Y, 5.8]]); tray(L[0].after, [[-1, Y, 0], [9.6, Y, 0]]);
  tray(shared.after, [[-.6, Y, -5.8], [-.6, UP + Y, -5.8]]);
  tray(L[1].after, [[-.6, Y, -5.8], [-9.6, Y, -5.8], [-9.6, Y, 5.8], [9.6, Y, 5.8], [9.6, Y, -5.8], [-.6, Y, -5.8]]);
  tray(L[1].after, [[3, Y, -5.8], [3, Y, 5.8]]); tray(L[1].after, [[-3, Y, -5.8], [-3, Y, 5.8]]);
  const ring = [[-9.6, Y, -5.8], [-9.6, Y, 5.8], [9.6, Y, 5.8], [9.6, Y, -5.8]].map(p => new THREE.Vector3(...p));
  const flowCurve = new THREE.CatmullRomCurve3(ring, true, 'catmullrom', 0);
  const packets = [];
  [0, 1].forEach(f => { for (let i = 0; i < 14; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 8), glow(i % 3 ? C.teal : C.orange)); p.userData.u = i / 14; L[f].after.add(p); packets.push(p); } });
  const AP_POS = [[0, -7, -2.5, 'Depósito A'], [0, -4, 3, 'Depósito B'], [0, 3.5, -1, 'Expedição / Comercial / Recepção'], [1, -6.5, 0, 'Administração / Financeiro'], [1, 6.5, 0, 'Reuniões / Gerência']];
  const domes = [];
  AP_POS.forEach(([f, x, z, nm], i) => {
    const ap = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .08, 24), new THREE.MeshStandardMaterial({ color: 0xF2F5FF, emissive: C.teal, emissiveIntensity: .25 }));
    ap.position.set(x, 2.45, z); L[f].after.add(ap);
    pickable(ap, { tip: `<b>Access point Wi-Fi 6 — ${nm}</b><br>EAP650 no teto, alimentado pelo cabo (PoE).`, onClick: () => window.__showSolution && window.__showSolution('s-wifi') });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.6, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: C.teal, transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide }));
    dome.position.set(x, 0, z); dome.scale.y = .5; L[f].after.add(dome);
    const rg = new THREE.Mesh(new THREE.RingGeometry(5.45, 5.6, 64), new THREE.MeshBasicMaterial({ color: C.teal, transparent: true, opacity: .4, side: THREE.DoubleSide, depthWrite: false }));
    rg.rotation.x = -Math.PI / 2; rg.position.set(x, .05, z); L[f].after.add(rg); domes.push(rg);
  });
  const emis = (c, i = .3) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i });
  const elgin = box(.45, .3, .4, emis(0xFF8A3D, .25), 2.4, 1.0, -3.0); L[0].after.add(elgin);
  const mf1 = box(.9, .8, .75, emis(0xB48CFF, .15), 3.4, .4, -5.2); L[0].after.add(mf1);
  const mf2 = box(.9, .8, .75, emis(0xB48CFF, .15), 0, .4, 5.2); L[1].after.add(mf2);
  const nasBox = box(.35, .4, .45, emis(0x5BD68A, .35), .2, 2.42, -5.3); L[0].after.add(nasBox);
  const finGlow = [];
  [[-1.5, -3], [1.2, -3]].forEach(([x, z]) => { const h = new THREE.Mesh(new THREE.RingGeometry(.75, .85, 32), new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: .8, side: THREE.DoubleSide })); h.rotation.x = -Math.PI / 2; h.position.set(x, .06, z); L[1].after.add(h); finGlow.push(h); });
  const scanners = [];
  [[-7.5, .9, 0], [-3.4, .9, .2], [1.8, 1.0, -3.5]].forEach(([x, y, z]) => { const s = box(.12, .3, .12, emis(0x2EC4B6, .4), x, y, z); L[0].after.add(s); scanners.push(s); });
  const solPick = (mesh, sid, tip) => pickable(mesh, { tip, onClick: () => window.__showSolution && window.__showSolution(sid) });
  solPick(rack, 's-rede', '<b>Rack central</b><br>Gateway ER605, switch PoE+, patch panel identificado e nobreak.');
  solPick(nasBox, 's-backup', '<b>NAS Synology (RAID 1)</b><br>Servidor de arquivos com backup 3-2-1.');
  solPick(elgin, 's-print', '<b>Etiquetadora Elgin L42 Pro</b><br>Dedicada à expedição: fim da fila.');
  solPick(mf1, 's-print', '<b>Multifuncional locada (térreo)</b><br>Franquia, toner e manutenção inclusos.');
  solPick(mf2, 's-print', '<b>Multifuncional locada (superior)</b>');
  scanners.forEach(s => solPick(s, 's-erp', '<b>Leitor de código de barras</b><br>Conferência direto no ERP.'));
  label('Rack + NAS', rackG, { cls: 'sm', offset: [0, 2.7, 0] });
  label('Etiquetadora', elgin, { cls: 'sm', offset: [0, .5, 0] });
  label('PCs novos', finGlow[0], { cls: 'sm', offset: [1.3, 1.6, 0] });

  /* ---------- hotspots do diagnóstico ---------- */
  const HS = [['wifi', 0, [-6, 2.0, -1]], ['rede', 0, [-4.5, 2.9, 4.6]], ['print', 0, [1.4, 1.6, -5]], ['dados', 0, [3.5, 1.7, 3.4]],
    ['backup', 1, [-.2, 1.6, -1.5]], ['pcs', 1, [1.4, 1.6, -3]], ['suporte', 1, [-7.5, 1.7, -1.6]], ['net', 0, [8.5, 1.4, -4.6]]];
  const hsMeshes = [];
  HS.forEach(([pid, f, p]) => {
    const prob = PROBLEMS.find(x => x.id === pid);
    const g = new THREE.Group(); g.position.set(...p); L[f].hot.add(g);
    const core = new THREE.Mesh(new THREE.SphereGeometry(.26, 20, 16), emis(C.red, .8)); g.add(core);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(.26, 20, 16), glow(C.red, { opacity: .35, depthWrite: false })); g.add(halo);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, p[1], 6), glow(C.red, { opacity: .4 })); stem.position.y = -p[1] / 2; g.add(stem);
    pickable(core, { tip: `<b>${prob.n}. ${prob.short}</b><br>${prob.where}<br><span style="color:#FF8A3D">Clique para detalhar</span>`, onClick: () => window.__showProblem && window.__showProblem(pid), hoverScale: 1.4 });
    hsMeshes.push({ g, halo, core, pid });
    label(`${prob.n}`, g, { cls: 'sm', offset: [0, .55, 0] });
  });

  let mode = 'neutral';
  function setMode(m, instant = false) {
    mode = m; const d = instant ? 1 : 700;
    BEFORE.forEach(g => fadeGroup(g, m === 'antes', d)); AFTER.forEach(g => fadeGroup(g, m === 'depois' || m === 'final', d)); HOT.forEach(g => fadeGroup(g, m === 'antes', d));
    pcScreens.forEach(s => { const fresh = (m === 'depois' || m === 'final'); s.material.emissive.setHex(s.userData.room === 'fin' ? (fresh ? C.green : m === 'antes' ? C.red : 0x5A8CFF) : 0x5A8CFF); });
  }
  [...BEFORE, ...AFTER, ...HOT].forEach(g => { g.visible = false; setOpacity(g, 0); });

  /* ---------- foco em uma sala: separa os andares, nunca entra na parede ---------- */
  let focused = null;
  function focus(roomId, fly = true) {
    focused = roomId;
    const r = roomId ? R[roomId] : null;
    ROOMS.forEach(x => { x.label.el.classList.toggle('focus', !!r && x.id === roomId); });
    const lift0 = F[1].position.y;
    const targetLift = r && r.f === 0 ? UP + 7 : UP;
    tween(900, e => F[1].position.y = lerp(lift0, targetLift, e));
    fadeGroup(F[0], true, 700, r && r.f === 1 ? .12 : 1);
    fadeGroup(F[1], true, 700, r && r.f === 0 ? .14 : 1);
    fadeGroup(sharedRoot, true, 500, r ? 0 : 1);
    if (!fly) return;
    if (r) {
      const t = [(r.x[0] + r.x[1]) / 2, r.f * UP + .5, (r.z[0] + r.z[1]) / 2];
      const d = new THREE.Vector3(.3, 1.05, .9).normalize().multiplyScalar(r.id === 'deposito' || r.id === 'adm' || r.id === 'comercial' ? 27 : 24);
      flyTo([t[0] + d.x, t[1] + d.y, t[2] + d.z], t, 1100);
    }
  }

  function update(t) {
    if (L[0].after.visible || L[1].after.visible) {
      packets.forEach(p => { p.userData.u = (p.userData.u + .0018) % 1; p.position.copy(flowCurve.getPointAt(p.userData.u)); });
      domes.forEach((d, i) => { const s = 1 + .03 * Math.sin(t * 2 + i); d.scale.set(s, s, 1); });
      rackLeds.forEach((l, i) => l.visible = Math.sin(t * 6 + i * 1.7) > -.6);
      finGlow.forEach((h, i) => h.material.opacity = (.5 + .4 * Math.sin(t * 3 + i)) * kChain(h.parent));
    }
    routers.forEach((l, i) => l.visible = Math.sin(t * 9 + i * 2) > 0);
    hsMeshes.forEach((h, i) => { if (!h.g.parent.visible) return; const ph = (t * .9 + i * .2) % 1; h.halo.scale.setScalar(1 + ph * 1.6); h.halo.material.opacity = .45 * (1 - ph) * kChain(h.g); });
    ROOMS.forEach(x => { roomMeshes[x.id].material.emissiveIntensity = x.id === focused ? .25 + .15 * Math.sin(t * 3) : 0; });
  }
  root.visible = false;
  return { root, setMode, update, focus, roomMeshes, get mode() { return mode; } };
})();
