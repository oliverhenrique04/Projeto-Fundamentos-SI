/* ============================================================
   SLIDES
   ============================================================ */
const panelInner = $('#panelInner');
const totals = (() => {
  const o = [1, 2, 3].map(n => sum(CAPEX.filter(x => x.onda === n && !x.optA), itemTotal));
  const pc4 = sum(CAPEX.filter(x => x.optA), itemTotal);
  const opex = sum(OPEX, itemTotal);
  return { o1: o[0], o2: o[1], o3base: o[2], pc4, o12: o[0] + o[1], opex, lease: LEASE_OPTION.qtd * LEASE_OPTION.un };
})();
let optA = true;

function group(slide) { const g = new THREE.Group(); g.visible = false; scene.add(g); slide.group = g; return g; }
function stats(list) { return `<div class="stats">${list.map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join('')}</div>`; }

/* ---------- 0. CAPA ---------- */
const S_COVER = {
  chapter: 'Proposta de consultoria', dot: '◉', tip: 'Capa', cover: true, building: 'neutral', sun: true,
  cam: [27, 13, 27], target: [0, 3.5, 0],
  html: () => `<div class="kicker">Proposta técnica e comercial · Novembro de 2026</div>
    <h1>Distribuidora <span class="hl">Horizonte</span></h1>
    <p class="lead">Diagnóstico, prioridades e plano de TI para a empresa crescer 20% sem atrasos, retrabalho ou perda de dados.</p>
    ${stats([['8', 'problemas mapeados no prédio'], [BRLk(totals.o12), 'Ondas 1+2 · teto de R$ 45 mil'], ['24 semanas', 'sem parar a operação']])}
    <p class="small">Equipe de consultoria: Oliver Henrique, Lucas Vasconcelos, Marcos de Oliveira, Rayna Livia, Caio Vilanova e Talita Nasser</p>
    <div class="row" style="justify-content:center"><button class="btn primary" data-go="1">Começar a apresentação →</button></div>`,
  update(t) { building.root.rotation.y = Math.sin(t * .12) * .35; },
  exit() { building.root.rotation.y = 0; },
  notes: 'Bom dia, diretoria. Eu sou a Rayna e esta é a nossa equipe: Marcos, Talita, Lucas, Caio e Oliver. Em 15 minutos vamos mostrar o que está travando a Horizonte, o que resolver primeiro e quanto custa. Tudo dentro do teto de R$ 45 mil para as duas primeiras ondas.'
};

/* ---------- 1. AGENDA ---------- */
const CHALLENGES = [
  ['Diagnóstico', 'Problemas e impactos', 2], ['Priorização', 'Urgência, impacto, dependências', 4], ['Soluções', 'Equipamentos, sistemas, serviços', 5], ['Pesquisa de mercado', 'Fornecedores e preços', 8],
  ['Orçamento', 'Inicial × recorrente', 9], ['Implantação', 'Etapas sem parar a empresa', 10], ['Benefícios e riscos', 'Indicadores e prevenção', 11], ['Apresentação executiva', 'Defesa diante da diretoria', 12]];
const S_AGENDA = {
  chapter: 'Agenda', dot: '≡', tip: 'Os 8 desafios', cam: [0, 15, 29], target: [0, 2, 0],
  build() {
    const g = group(this); this.cubes = [];
    const ring = new THREE.Group(); g.add(ring); this.ring = ring;
    CHALLENGES.forEach(([t, s, go], i) => {
      const a = i / 8 * Math.PI * 2; const col = [C.orange, C.yellow, C.teal, C.green, C.blue, C.violet, C.red, 0xFFFFFF][i];
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), new THREE.MeshStandardMaterial({ color: 0x141E36, emissive: col, emissiveIntensity: .12, roughness: .4, metalness: .3 }));
      m.position.set(Math.cos(a) * 8, 2.4, Math.sin(a) * 8); ring.add(m);
      const e = edges(m.geometry, col, .9); m.add(e);
      pickable(m, { tip: `<b>${i + 1}. ${t}</b><br>${s}`, onClick: () => go_(go) });
      label(`<span style="color:${'#' + col.toString(16).padStart(6, '0')}">${i + 1}</span> ${t}`, m, { cls: 'big', offset: [0, 1.7, 0] });
      this.cubes.push(m);
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), new THREE.MeshStandardMaterial({ color: C.orange, emissive: C.orange, emissiveIntensity: .5, wireframe: true }));
    core.position.y = 2.4; g.add(core); this.core = core;
  },
  html: () => `<div class="kicker">Agenda</div><h2>Os 8 desafios da consultoria</h2>
    <p>Cada desafio é uma parada desta apresentação. Clique em um cubo ou em um cartão para ir direto a ele.</p>
    <div class="cards">${CHALLENGES.map(([t, s, go], i) => `<button class="card" data-go="${go}"><div class="t">${i + 1}. ${t}</div><div class="s">${s}</div></button>`).join('')}</div>`,
  update(t) { this.ring.rotation.y = t * .08; this.cubes.forEach((c, i) => { c.rotation.y = -t * .08; c.position.y = 2.4 + Math.sin(t * 1.2 + i) * .25; }); this.core.rotation.y = t * .3; this.core.rotation.x = t * .2; },
  notes: 'Seguimos exatamente os 8 desafios do enunciado. Os três primeiros mostram o problema e a solução; do quarto ao sétimo, preço, orçamento, cronograma e riscos; o oitavo é a nossa defesa diante de vocês.'
};

/* ---------- 2. DIAGNÓSTICO (prédio) ---------- */
const PROB_ROOM = { wifi: 'deposito', rede: 'deposito', print: 'expedicao', dados: 'comercial', backup: 'fin', pcs: 'fin', suporte: 'adm', net: 'recepcao' };
const SOL_ROOM = { 's-rede': 'expedicao', 's-wifi': 'deposito', 's-erp': 'comercial', 's-backup': 'fin', 's-pcs': 'fin', 's-print': 'expedicao', 's-suporte': null, 's-net': 'recepcao' };
function problemDetail(p) {
  return `<div class="detail"><div class="kicker">Problema ${p.n} · ${p.where}</div><h3 style="margin-top:0">${p.icon} ${p.short}</h3>
  <dl><dt>Fato</dt><dd>${p.fato}</dd><dt>Causa</dt><dd>${p.causa}</dd><dt>Processo</dt><dd>${p.processo}</dd><dt>Resultado</dt><dd class="hl-r">${p.resultado}</dd></dl></div>`;
}
const S_DIAG = {
  chapter: '<b>Desafio 1</b> · Diagnóstico', dot: '1', tip: 'Diagnóstico — o prédio', building: 'antes', cam: [24, 15, 25], target: [0, 3.2, 0],
  html: () => `<div class="kicker">Desafio 1 · Diagnóstico</div><h2>Um problema em cada setor</h2>
    <p>Vista explodida dos dois pavimentos. Os pontos vermelhos marcam os problemas relatados. Clique em um ponto ou cartão: o outro andar se afasta e o setor fica em destaque.</p>
    <div class="cards">${PROBLEMS.map(p => `<button class="card" data-prob="${p.id}"><div class="t">${p.n}. ${p.short}</div><div class="s">${p.where}</div></button>`).join('')}</div>
    <div id="probDetail"><p class="small">Causa raiz em comum: a empresa dobrou o volume de pedidos e a TI cresceu por remendos, sem projeto, sem dono e sem dados integrados.</p></div>
    <div class="row" style="margin-top:8px"><button class="btn" id="diagReset">Visão geral</button></div>`,
  bind(root) {
    const show = id => {
      const p = PROBLEMS.find(x => x.id === id); $('#probDetail').innerHTML = problemDetail(p);
      $$('.card[data-prob]', root).forEach(c => c.classList.toggle('on', c.dataset.prob === id));
      building.focus(PROB_ROOM[id]);
    };
    window.__showProblem = show;
    $$('.card[data-prob]', root).forEach(c => c.onclick = () => show(c.dataset.prob));
    $('#diagReset').onclick = () => { building.focus(null); flyTo(this.cam, this.target); $$('.card.on', root).forEach(c => c.classList.remove('on')); };
  },
  enter() { building.focus(null, false); },
  exit() { window.__showProblem = null; building.focus(null, false); },
  notes: 'O prédio tem dois andares; separamos para enxergar tudo. Cada ponto vermelho é um fato do relato da direção. Destaque: o Wi-Fi do depósito, a pasta do financeiro numa estação, as três planilhas que não conversam e o PC parado por dois dias.'
};

/* ---------- 3. CADEIA DE IMPACTO ---------- */
const S_CHAIN = {
  chapter: '<b>Desafio 1</b> · Impactos', dot: '1', tip: 'Diagnóstico — impactos', cam: [3, 6.5, 35], target: [1, 5.3, 0],
  build() {
    const g = group(this); this.nodes = {}; this.edges = []; this.pulses = [];
    const mk = (id, text, pos, col, kind) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(kind === 'c' ? .42 : .55, 24, 16), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .35 }));
      m.position.set(...pos); g.add(m); this.nodes[id] = { m, kind, id };
      pickable(m, { tip: `<b>${text}</b><br>Clique para ver as ligações`, onClick: () => this.select(id), hoverScale: 1.25 });
      label(text, m, { cls: kind === 'r' ? '' : 'sm', offset: [kind === 'c' ? -.7 : kind === 'r' ? .8 : 0, kind === 'p' ? .9 : 0, 0] }).el.style.transform = kind === 'c' ? 'translate(-100%,-50%)' : kind === 'r' ? 'translate(0,-50%)' : '';
    };
    PROBLEMS.forEach((p, i) => mk(p.id, `${p.n}. ${p.short}`, [-10, 9.6 - i * 1.25, 3], C.red, 'c'));
    PROCESSES.forEach((p, i) => mk(p.id, p.label, [0, 9.2 - i * 1.9, 0], C.yellow, 'p'));
    RESULTS.forEach((p, i) => mk(p.id, p.label, [10, 9.2 - i * 1.9, -3], C.orange, 'r'));
    const link = (a, b, col) => {
      const A = this.nodes[a].m.position, B = this.nodes[b].m.position;
      const mid = A.clone().add(B).multiplyScalar(.5); mid.z += 2.5;
      const curve = new THREE.QuadraticBezierCurve3(A.clone(), mid, B.clone());
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .35 }));
      g.add(line); const e = { a, b, line, curve }; this.edges.push(e);
      const pu = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 8), glow(col, { opacity: .9 })); pu.userData.u = Math.random(); pu.userData.e = e; g.add(pu); this.pulses.push(pu);
    };
    PROCESSES.forEach(p => p.from.forEach(c => link(c, p.id, 0xFF7A6B)));
    RESULTS.forEach(r => r.from.forEach(p => link(p, r.id, 0xFFB347)));
    const h = (txt, x) => { const o = new THREE.Object3D(); o.position.set(x, 11.3, x === -10 ? 3 : x === 10 ? -3 : 0); g.add(o); label(txt, o, { cls: 'big' }); };
    h('Causas', -10); h('Processos afetados', 0); h('Resultados', 10);
    this.select = id => {
      const up = new Set([id]), down = new Set([id]);
      let changed = true; while (changed) { changed = false; this.edges.forEach(e => { if (down.has(e.a) && !down.has(e.b)) { down.add(e.b); changed = true; } if (up.has(e.b) && !up.has(e.a)) { up.add(e.a); changed = true; } }); }
      const on = new Set([...up, ...down]);
      this.edges.forEach(e => { const lit = on.has(e.a) && on.has(e.b); e.line.material.opacity = lit ? .95 : .05; e.lit = lit; });
      Object.values(this.nodes).forEach(n => n.m.material.emissiveIntensity = on.has(n.id) ? 1 : .08);
      const nm = id => (PROBLEMS.find(x => x.id === id)?.short) || (PROCESSES.find(x => x.id === id)?.label) || (RESULTS.find(x => x.id === id)?.label);
      const cs = [...on].filter(x => this.nodes[x].kind === 'c').map(nm), ps = [...on].filter(x => this.nodes[x].kind === 'p').map(nm), rs = [...on].filter(x => this.nodes[x].kind === 'r').map(nm);
      const d = $('#chainDetail'); if (d) d.innerHTML = `<div class="detail"><h3 style="margin-top:0">${nm(id)}</h3><dl><dt>Causas</dt><dd>${cs.join(' · ')}</dd><dt>Processos</dt><dd>${ps.join(' · ')}</dd><dt>Resultados</dt><dd class="hl">${rs.join(' · ')}</dd></dl></div>`;
    };
    this.reset = () => { this.edges.forEach(e => { e.line.material.opacity = .35; e.lit = true; }); Object.values(this.nodes).forEach(n => n.m.material.emissiveIntensity = .35); };
  },
  html: () => `<div class="kicker">Desafio 1 · Diagnóstico</div><h2>Como os problemas chegam ao resultado</h2>
    <p>Nenhum problema fica isolado: a rede ruim derruba vendas e expedição; a falta de backup ameaça o faturamento e o fechamento.</p>
    <p>Clique em qualquer esfera para acender sua cadeia completa.</p>
    <div class="row"><button class="btn" data-sel="dados">Venda sem estoque</button><button class="btn" data-sel="backup">Perda de arquivos</button><button class="btn" data-sel="atrasos">De onde vêm os atrasos?</button><button class="btn" id="chainReset">Tudo</button></div>
    <div id="chainDetail"></div>
    <p class="small" style="margin-top:12px">Leitura para a diretoria: os resultados ruins (atrasos, retrabalho, reclamações) são sintomas. Tratar só o sintoma, como contratar mais conferentes, não remove a causa.</p>`,
  bind(root) { $$('[data-sel]', root).forEach(b => b.onclick = () => this.select(b.dataset.sel)); $('#chainReset').onclick = () => { this.reset(); $('#chainDetail').innerHTML = ''; }; },
  enter() { this.reset(); },
  update(t) { this.pulses.forEach(p => { p.userData.u = (p.userData.u + .006) % 1; p.position.copy(p.userData.e.curve.getPoint(p.userData.u)); p.visible = p.userData.e.lit !== false; }); },
  notes: 'Este mapa mostra por que não adianta atacar o sintoma. Clique em “Venda sem estoque”: o problema nasce nas planilhas separadas e afeta vender, separar e faturar. Os atrasos têm quatro causas diferentes.'
};

/* ---------- gráfico de barras 3D reutilizável ---------- */
const CAT_COLOR = { 'Rede': 0xFF8A3D, 'Wi-Fi': 0x2EC4B6, 'Energia': 0xFFC94D, 'Dados': 0x5BD68A, 'Computadores': 0x4C8DFF, 'Sistemas': 0xB48CFF, 'Expedição': 0xFF6FA8 };
const chartPlays = new Map();
function disposeChart(g) {
  for (let i = labels.length - 1; i >= 0; i--) { let o = labels[i].obj; while (o && o !== g) o = o.parent; if (o === g) { labels[i].el.remove(); labels.splice(i, 1); } }
  for (let i = pickables.length - 1; i >= 0; i--) { let o = pickables[i]; while (o && o !== g) o = o.parent; if (o === g) pickables.splice(i, 1); }
  while (g.children.length) g.remove(g.children[0]);
}
function barChart(g, items, { gap = 2.2, w = 1.3, unit } = {}) {
  disposeChart(g);
  const n = items.length, start = -(n - 1) * gap / 2;
  const base = box(n * gap + .4, .1, w + 2.2, mat(0x0F1830, { roughness: .9 }), 0, -.05, .4); base.castShadow = false; g.add(base);
  const be = edges(base.geometry, 0x2A3B63, .8); be.position.copy(base.position); g.add(be);
  const bars = items.map((it, i) => {
    const grp = new THREE.Group(); grp.position.set(start + i * gap, 0, 0); g.add(grp);
    const inner = new THREE.Group(); grp.add(inner); inner.scale.y = .001;
    let y = 0; const meshes = [];
    (it.segs || [[it.value, it.color]]).forEach(([v, col]) => {
      const sh = Math.max(.04, v / unit); const geo = new THREE.BoxGeometry(w, sh, w); geo.translate(0, sh / 2 + y, 0);
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .22, roughness: .35, metalness: .1 }));
      m.castShadow = true; inner.add(m); meshes.push(m); pickable(m, { tip: it.tip, onClick: it.onClick }); y += sh;
    });
    const top = new THREE.Object3D(); top.position.y = .4; grp.add(top);
    const topL = label('', top, { cls: 'val' }); topL.alpha = 0;
    const bot = new THREE.Object3D(); bot.position.set(0, 0, w / 2 + .5); grp.add(bot);
    const botL = label(it.name, bot, { cls: 'barname' });
    return { it, grp, inner, meshes, h: y, top, topL, botL };
  });
  return {
    bars,
    play(order = null, stagger = 330, dur = 850) {
      const token = {}; chartPlays.set(g, token);
      bars.forEach(b => { b.inner.scale.y = .001; b.top.position.y = .4; b.topL.alpha = 0; });
      (order || bars.map((_, i) => i)).forEach((bi, k) => setTimeout(() => {
        if (chartPlays.get(g) !== token) return;
        const b = bars[bi]; b.topL.alpha = 1;
        tween(dur, e => { if (chartPlays.get(g) !== token) return; b.inner.scale.y = Math.max(.001, e); b.top.position.y = b.h * e + .45; b.topL.el.innerHTML = b.it.top(e); });
      }, 250 + k * stagger));
    },
    stop() { chartPlays.set(g, {}); },
    relabel() { bars.forEach(b => b.topL.el.innerHTML = b.it.top(1)); },
    dim(fn) { bars.forEach(b => { const on = fn(b.it); b.meshes.forEach(m => { m.material.transparent = true; m.material.opacity = on ? 1 : .15; m.material.userData.base = m.material.opacity; }); b.topL.alpha = on ? 1 : .25; b.botL.alpha = on ? 1 : .35; }); },
  };
}

/* ---------- 4. PRIORIZAÇÃO ---------- */
const score = p => p.U * p.I;
const ORDER_SCORE = [...PROBLEMS].sort((a, b) => score(b) - score(a) || a.onda - b.onda || a.n - b.n);
const ORDER_EXEC = [...PROBLEMS].sort((a, b) => a.onda - b.onda || score(b) - score(a) || a.n - b.n);
const PGAP = 2.15;
const S_PRIO = {
  chapter: '<b>Desafio 2</b> · Priorização', dot: '2', tip: 'Priorização', cam: [0, 7.5, 27], target: [0, 3.2, 0],
  view: 'score',
  order() { return this.view === 'score' ? ORDER_SCORE : ORDER_EXEC; },
  rank(id) { return this.order().findIndex(p => p.id === id) + 1; },
  xs() { return PROBLEMS.map(p => -(PROBLEMS.length - 1) * PGAP / 2 + (this.rank(p.id) - 1) * PGAP); },
  build() {
    const g = group(this); this.cg = new THREE.Group(); g.add(this.cg);
    this.chart = barChart(this.cg, PROBLEMS.map(p => ({
      id: p.id, value: score(p), color: ONDA_COLOR[p.onda], name: `${p.n}. ${p.short}`,
      top: e => `<span class="rk">${this.rank(p.id)}º</span>${Math.round(score(p) * e)}`,
      tip: `<b>${p.n}. ${p.short}</b><br>Urgência ${p.U} × Impacto ${p.I} = <b>${score(p)}</b><br>Onda ${p.onda}`,
      onClick: () => this.pick(p.id),
    })), { gap: PGAP, w: 1.25, unit: 1 / .26 });
    const xs = this.xs(); this.chart.bars.forEach((b, i) => b.grp.position.x = xs[i]);
    // faixas das ondas (ordem de execução)
    this.zones = new THREE.Group(); g.add(this.zones);
    const ex = ORDER_EXEC.map(p => p.onda); const startX = -(PROBLEMS.length - 1) * PGAP / 2;
    [1, 2, 3].forEach(o => {
      const i0 = ex.indexOf(o), i1 = ex.lastIndexOf(o); const x0 = startX + i0 * PGAP - PGAP / 2 + .08, x1 = startX + i1 * PGAP + PGAP / 2 - .08;
      const z = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, 4.4), new THREE.MeshBasicMaterial({ color: ONDA_COLOR[o], transparent: true, opacity: .22, depthWrite: false }));
      z.rotation.x = -Math.PI / 2; z.position.set((x0 + x1) / 2, .02, 1.6); this.zones.add(z);
      const a = new THREE.Object3D(); a.position.set((x0 + x1) / 2, 0, 7.2); this.zones.add(a);
      label(`<span style="color:${ONDA_HEX[o]}">Onda ${o}</span> · ${['', 'Fundação · sem. 1–5', 'Integração · sem. 6–12', 'Parque · sem. 15–22'][o]}`, a, { cls: 'sm' });
    });
    this.arcs = new THREE.Group(); g.add(this.arcs);
    const hint = new THREE.Object3D(); hint.position.set(startX - 1.6, 0, .4); g.add(hint); this.hintL = label('mais<br>prioritário', hint, { cls: 'sm' });
  },
  setView(v, animate = true) {
    this.view = v;
    $$('#pvSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
    const xs = this.xs();
    if (animate) this.chart.bars.forEach((b, i) => { const x0 = b.grp.position.x; tween(900, e => b.grp.position.x = lerp(x0, xs[i], e)); });
    if (this.sel) this.drawDeps(this.sel, animate ? 950 : 0);
    else this.chart.bars.forEach((b, i) => b.grp.position.x = xs[i]);
    this.chart.relabel();
    fadeGroup(this.zones, v === 'exec', 600);
    if (!this.sel) this.drawDeps(null);
    const tb = $('#prioBody'); if (tb) tb.innerHTML = this.rows();
    $$('tr[data-prio]').forEach(r => r.onclick = () => this.pick(r.dataset.prio));
    const ex = $('#prioExplain'); if (ex) ex.innerHTML = v === 'score'
      ? 'Ranking pela nota (urgência × impacto, cada um de 1 a 5). A barra mais alta é a mais prioritária e cresce primeiro.'
      : 'Ordem real de execução: agrupada por onda e respeitando dependências. Clique numa barra: as setas mostram o que precisa existir antes e o que ela destrava.';
  },
  rows() {
    return this.order().map((p, i) => {
      const dep = DEPS.filter(d => d[1] === p.id).map(d => PROBLEMS.find(x => x.id === d[0]).n).join(', ');
      return `<tr data-prio="${p.id}" style="cursor:pointer"><td><b>${i + 1}º</b></td><td>${p.short}</td><td class="n">${p.U}×${p.I}=<b>${score(p)}</b></td><td><span class="tag" style="color:${ONDA_HEX[p.onda]}">${p.onda}</span></td><td class="n">${dep || '—'}</td></tr>`;
    }).join('');
  },
  drawDeps(id, delay = 0) {
    disposeChart(this.arcs); if (!id) return;
    setTimeout(() => {
      if (this.sel !== id) return; disposeChart(this.arcs);
      const bar = pid => this.chart.bars.find(b => b.it.id === pid);
      DEPS.filter(d => d.includes(id)).forEach(([a, b]) => {
        const A = bar(a), B = bar(b); const pa = [A.grp.position.x, A.h + 1.2, 0], pb = [B.grp.position.x, B.h + 1.2, 0];
        const l = arc(pa, pb, 1.4 + Math.abs(pa[0] - pb[0]) * .1, C.yellow, .95); this.arcs.add(l);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(.15, .38, 12), glow(C.yellow));
        cone.position.copy(l.userData.curve.getPoint(.98)); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), l.userData.curve.getTangent(.98)); this.arcs.add(cone);
        const mid = new THREE.Object3D(); mid.position.copy(l.userData.curve.getPoint(.5)); this.arcs.add(mid);
        label(`${PROBLEMS.find(p => p.id === a).short.split(' ')[0]} → ${PROBLEMS.find(p => p.id === b).short.split(' ')[0]}`, mid, { cls: 'sm' });
      });
      this.arcs.visible = true; setOpacity(this.arcs, 1);
    }, delay);
  },
  pick(id) {
    this.sel = id; this.drawDeps(id);
    this.chart.bars.forEach(b => b.meshes.forEach(m => m.material.emissiveIntensity = b.it.id === id ? .9 : .12));
    $$('tr[data-prio]').forEach(r => r.style.background = r.dataset.prio === id ? 'rgba(255,138,61,.15)' : '');
    const p = PROBLEMS.find(x => x.id === id);
    const dep = DEPS.filter(d => d[1] === id).map(d => PROBLEMS.find(x => x.id === d[0]).short), unl = DEPS.filter(d => d[0] === id).map(d => PROBLEMS.find(x => x.id === d[1]).short);
    $('#prioDetail').innerHTML = `<div class="detail"><h3 style="margin-top:0">${p.n}. ${p.short}</h3><dl><dt>Nota</dt><dd>Urgência ${p.U} × Impacto ${p.I} = <b class="hl">${score(p)}</b> (${ORDER_SCORE.findIndex(x => x.id === id) + 1}º no ranking)</dd><dt>Depende de</dt><dd>${dep.join(', ') || 'nada — pode começar já'}</dd><dt>Destrava</dt><dd>${unl.join(', ') || '—'}</dd><dt>Onda</dt><dd><span class="tag" style="color:${ONDA_HEX[p.onda]}">Onda ${p.onda}</span></dd></dl></div>`;
  },
  html() {
    return `<div class="kicker">Desafio 2 · Priorização</div><h2>O que resolver primeiro</h2>
    <p id="prioExplain"></p>
    <div class="legend"><span><i style="background:#FF8A3D"></i>Onda 1 · Fundação</span><span><i style="background:#2EC4B6"></i>Onda 2 · Integração</span><span><i style="background:#4C8DFF"></i>Onda 3 · Parque</span></div>
    <div class="row" style="margin:8px 0"><div class="seg" id="pvSeg"><button data-v="score">1. Ranking por nota</button><button data-v="exec">2. Ordem de execução</button></div><button class="btn" id="prioPlay">▶ Reproduzir</button></div>
    <table><thead><tr><th>#</th><th>Problema</th><th class="n">U×I</th><th>Onda</th><th class="n">Depende de</th></tr></thead><tbody id="prioBody"></tbody></table>
    <div id="prioDetail"></div>
    <p class="small" style="margin-top:10px">O ERP tem nota 20, mas vai para a Onda 2 porque depende da rede e do Wi-Fi do depósito. Suporte e internet têm notas menores e entram na Onda 1 porque custam pouco e protegem todo o resto.</p>`;
  },
  bind(root) {
    $$('#pvSeg button', root).forEach(b => b.onclick = () => this.setView(b.dataset.v));
    $('#prioPlay').onclick = () => this.play();
    this.setView(this.view, false);
  },
  play() { this.chart.play(this.order().map(p => PROBLEMS.indexOf(p))); },
  enter() { this.sel = null; this.view = 'score'; this.setView('score', false); disposeChart(this.arcs); this.zones.visible = false; this.zones.userData.k = 0; this.arcs.visible = false; this.arcs.userData.k = 0; this.chart.bars.forEach(b => b.meshes.forEach(m => m.material.emissiveIntensity = .22)); this.play(); },
  exit() { this.chart.stop(); },
  notes: 'As barras nascem na ordem de prioridade: rede e backup empatam em 25 e crescem primeiro. Depois cliquem em “Ordem de execução”: as barras se reorganizam por onda e as setas mostram que nada começa antes do que precisa existir.'
};

/* ---------- 5. SOLUÇÕES (prédio antes/depois) ---------- */
const S_SOL = {
  chapter: '<b>Desafio 3</b> · Soluções', dot: '3', tip: 'Soluções — antes × depois', building: 'depois', cam: [-22, 15, 24], target: [0, 3.2, 0],
  html: () => `<div class="kicker">Desafio 3 · Soluções</div><h2>Antes e depois, no mesmo prédio</h2>
    <div class="row" style="margin:6px 0 10px"><div class="seg" id="baSeg"><button data-m="antes">Antes</button><button data-m="depois" class="on">Depois</button></div><button class="btn" id="solReset">Visão geral</button></div>
    <p class="small">Clique em um cartão ou nos equipamentos em 3D para ir ao setor.</p>
    <div class="cards">${SOLUTIONS.map(s => `<button class="card" data-sol="${s.id}"><div class="t">${s.title}</div><div class="s">Resolve: ${PROBLEMS.find(p => p.id === s.problem).short}</div></button>`).join('')}</div>
    <div id="solDetail"></div>`,
  bind(root) {
    const show = id => {
      const s = SOLUTIONS.find(x => x.id === id);
      $('#solDetail').innerHTML = `<div class="detail"><h3 style="margin-top:0">${s.title}</h3><dl><dt>O quê</dt><dd>${s.what}</dd><dt>Por quê</dt><dd class="hl-g">${s.why}</dd><dt>Alternativa</dt><dd>${s.alt}</dd></dl></div>`;
      $$('.card[data-sol]', root).forEach(c => c.classList.toggle('on', c.dataset.sol === id));
      $('#solDetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (SOL_ROOM[id]) building.focus(SOL_ROOM[id]); else { building.focus(null); flyTo(this.cam, this.target); }
    };
    window.__showSolution = show;
    $$('.card[data-sol]', root).forEach(c => c.onclick = () => show(c.dataset.sol));
    $$('#baSeg button', root).forEach(b => b.onclick = () => { building.setMode(b.dataset.m); $$('#baSeg button', root).forEach(x => x.classList.toggle('on', x === b)); });
    $('#solReset').onclick = () => { building.focus(null); flyTo(this.cam, this.target); $$('.card.on', root).forEach(c => c.classList.remove('on')); };
  },
  enter() { building.focus(null, false); },
  exit() { window.__showSolution = null; building.focus(null, false); },
  notes: 'Alternem entre Antes e Depois. Os cabos soltos dão lugar a um rack com bandejas; três roteadores domésticos dão lugar a cinco access points com cobertura medida, dois só no depósito. Cada cartão tem o porquê e a alternativa que descartamos.'
};

/* ---------- 6. TOPOLOGIA ---------- */
const VLANS = { corp: ['Corporativa', C.blue, '#4C8DFF'], op: ['Operação/Depósito', C.teal, '#2EC4B6'], vis: ['Visitantes', C.violet, '#B48CFF'], local: ['Arquivos (NAS)', C.green, '#5BD68A'] };
const S_TOPO = {
  chapter: '<b>Desafio 3</b> · Rede lógica', dot: '3', tip: 'Soluções — topologia', cam: [-3, 15, 31], target: [-3, 3.5, 0],
  build() {
    const g = group(this); this.N = {}; this.packets = []; this.failed = false; this.filter = 'all';
    const dev = (id, name, tip, pos, geo, col) => {
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .2, roughness: .4, metalness: .3 }));
      m.position.set(...pos); m.castShadow = true; g.add(m); this.N[id] = m;
      pickable(m, { tip: `<b>${name}</b><br>${tip}` }); label(name, m, { cls: 'sm', offset: [0, 1, 0] }); return m;
    };
    const cloudGeo = () => { const gg = new THREE.SphereGeometry(1, 20, 14); return gg; };
    dev('inetA', 'Link principal 500 Mbps', 'Operadora atual.', [-13, 6, -4], cloudGeo(), 0x9FB4E8).scale.set(1.8, 1, 1.2);
    dev('inetB', 'Link reserva Claro 400 Mbps', 'Outra operadora: R$ 79,90/mês.', [-13, 6, 4], cloudGeo(), 0x9FB4E8).scale.set(1.8, 1, 1.2);
    dev('er', 'Gateway ER605', 'Firewall, VLANs, balanceamento e failover entre os 2 links.', [-6, 3, 0], new THREE.BoxGeometry(2, .5, 1.2), C.orange);
    dev('poe', 'Switch PoE+ 24p', 'Alimenta os APs e separa as VLANs.', [0, 3, -2], new THREE.BoxGeometry(2.8, .4, 1), 0xD9E2F5);
    dev('sw', 'Switch 24p', 'Estações e impressoras.', [0, 3, 3.5], new THREE.BoxGeometry(2.8, .4, 1), 0xD9E2F5);
    dev('nas', 'NAS (RAID 1)', 'Arquivos centralizados + backup 3-2-1.', [5, 1.2, -1], new THREE.BoxGeometry(.9, 1.2, 1.2), C.green);
    dev('pcs', '21 estações + 3 notebooks', 'Rede Corporativa.', [7, .8, 5], new THREE.BoxGeometry(3, 1.4, 2.4), C.blue);
    dev('prn', 'Multifuncionais + etiquetadora', 'Impressão em rede.', [3, .7, 7.5], new THREE.BoxGeometry(1.8, 1.2, 1.2), C.violet);
    for (let i = 0; i < 5; i++) dev('ap' + i, i < 2 ? 'AP depósito' : i === 2 ? 'AP térreo' : i === 3 ? 'AP superior' : 'AP reuniões', 'Wi-Fi 6 com 3 SSIDs: Corporativa, Operação, Visitantes.', [7 + (i % 2) * 1.5, 5.5, -9 + i * 2], new THREE.CylinderGeometry(.55, .55, .18, 24), 0xF2F5FF);
    dev('erp', 'ERP Bling (nuvem)', 'Estoque, pedidos, NF-e e financeiro.', [-6, 9.5, -5], new THREE.IcosahedronGeometry(1, 0), C.teal);
    dev('m365', 'Microsoft 365', 'E-mail, OneDrive, SharePoint, Teams.', [-1, 9.5, -6], new THREE.IcosahedronGeometry(1, 0), C.blue);
    const L = (a, b, col = 0x5E79B0) => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([this.N[a].position, this.N[b].position]), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .6 })); g.add(l); return l; };
    this.linkA = L('inetA', 'er'); this.linkB = L('inetB', 'er'); L('er', 'poe'); L('poe', 'sw'); L('poe', 'nas'); L('sw', 'pcs'); L('sw', 'prn');
    for (let i = 0; i < 5; i++) L('poe', 'ap' + i, C.teal);
    ['erp', 'm365'].forEach(s => { L(s, 'inetA', 0x3A4A70); L(s, 'inetB', 0x3A4A70); });
    this.xMark = new THREE.Mesh(new THREE.TorusGeometry(.6, .1, 8, 24), glow(C.red)); this.xMark.visible = false; g.add(this.xMark);
    const P = id => this.N[id].position;
    const routes = [
      ['corp', () => [P('erp'), P(this.failed ? 'inetB' : 'inetA'), P('er'), P('poe'), P('sw'), P('pcs')]],
      ['corp', () => [P('m365'), P(this.failed ? 'inetB' : 'inetA'), P('er'), P('poe'), P('sw'), P('pcs')]],
      ['op', () => [P('erp'), P(this.failed ? 'inetB' : 'inetA'), P('er'), P('poe'), P('ap0')]],
      ['op', () => [P('erp'), P(this.failed ? 'inetB' : 'inetA'), P('er'), P('poe'), P('ap1')]],
      ['vis', () => [P(this.failed ? 'inetB' : 'inetA'), P('er'), P('poe'), P('ap4')]],
      ['local', () => [P('pcs'), P('sw'), P('poe'), P('nas')]],
      ['blocked', () => [P('ap4'), P('poe'), P('nas')]],
    ];
    routes.forEach(([v, fn], ri) => { for (let k = 0; k < 4; k++) { const col = v === 'blocked' ? C.red : VLANS[v][1]; const m = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 10), glow(col)); m.userData = { v, fn, u: k / 4 + ri * .07 }; g.add(m); this.packets.push(m); } });
  },
  html: () => `<div class="kicker">Desafio 3 · Soluções</div><h2>Rede segmentada, com dois caminhos para a internet</h2>
    <p>Cada cor é uma rede separada (VLAN). O visitante navega, mas não enxerga o servidor de arquivos nem os computadores do financeiro.</p>
    <div class="legend">${Object.values(VLANS).map(v => `<span><i style="background:${v[2]}"></i>${v[0]}</span>`).join('')}<span><i style="background:#FF4D5E"></i>Bloqueado</span></div>
    <div class="row" style="margin:8px 0"><div class="seg" id="vSeg"><button data-v="all" class="on">Todas</button><button data-v="corp">Corporativa</button><button data-v="op">Operação</button><button data-v="vis">Visitantes</button></div></div>
    <div class="row"><button class="btn" id="failBtn">⚡ Simular queda do link principal</button></div>
    <div id="topoMsg" class="detail"><p>Gateway ER605 com dois links de operadoras diferentes: em caso de queda, o tráfego muda sozinho para o reserva.</p></div>
    <h3>Decisões técnicas</h3><p class="small">TP-Link Omada em toda a rede (gateway, switches e APs) para gestão em um só painel, com custo de PME. Cabo Cat6 suporta 1 Gbps até cada mesa. O switch PoE+ dispensa tomadas no teto.</p>`,
  bind(root) {
    $$('#vSeg button', root).forEach(b => b.onclick = () => { this.filter = b.dataset.v; $$('#vSeg button', root).forEach(x => x.classList.toggle('on', x === b)); });
    $('#failBtn').onclick = e => {
      this.failed = !this.failed; e.target.classList.toggle('on', this.failed); e.target.textContent = this.failed ? '↺ Restabelecer link principal' : '⚡ Simular queda do link principal';
      this.linkA.material.color.setHex(this.failed ? C.red : 0x5E79B0); this.linkA.material.opacity = this.failed ? .9 : .6;
      this.N.inetA.material.emissive.setHex(this.failed ? C.red : 0x9FB4E8);
      $('#topoMsg').innerHTML = this.failed ? `<p class="hl-g"><b>Failover automático:</b> ERP, e-mail e Wi-Fi seguem pelo link Claro. Arquivos do NAS nem dependem da internet.</p><p class="small">Hoje, uma queda do link para a empresa inteira.</p>` : `<p>Gateway ER605 com dois links de operadoras diferentes: em caso de queda, o tráfego muda sozinho para o reserva.</p>`;
    };
  },
  enter() { this.failed = false; this.filter = 'all'; this.linkA.material.color.setHex(0x5E79B0); this.N.inetA.material.emissive.setHex(0x9FB4E8); },
  update(t) {
    this.packets.forEach(p => {
      const d = p.userData; d.u = (d.u + .0035) % 1;
      const pts = d.fn(); const n = pts.length - 1;
      let u = d.u; if (d.v === 'blocked') u = d.u * .82;
      const f = u * n, i = Math.min(n - 1, Math.floor(f)); p.position.lerpVectors(pts[i], pts[i + 1], f - i);
      const show = this.filter === 'all' || d.v === this.filter || (this.filter === 'vis' && d.v === 'blocked');
      p.material.opacity = show ? .95 : .08;
    });
    const pp = this.N.poe.position; this.xMark.position.set(pp.x + 2.2, pp.y + .2, pp.z + .4); this.xMark.lookAt(camera.position);
    this.xMark.visible = this.filter === 'vis' || this.filter === 'all'; this.xMark.scale.setScalar(1 + .15 * Math.sin(t * 6));
    this.N.erp.rotation.y = t * .6; this.N.m365.rotation.y = -t * .6;
    if (this.failed) this.N.inetA.material.emissiveIntensity = .3 + .3 * Math.sin(t * 8); else this.N.inetA.material.emissiveIntensity = .2;
  },
  notes: 'Quatro redes no mesmo cabo. Filtrem “Visitantes”: o pacote vermelho tenta chegar ao servidor e é barrado no switch. Agora simulem a queda do link principal: tudo migra para o reserva. Isso importa porque o ERP estará na nuvem.'
};

/* ---------- 7. ERP ---------- */
const MODS = [['vendas', 'Vendas / Pedidos', C.orange], ['estoque', 'Estoque', C.teal], ['exped', 'Expedição', C.violet], ['fiscal', 'Fiscal / NF-e', C.yellow], ['fin', 'Financeiro', C.blue], ['compras', 'Compras', C.green]];
const FLOW = [['vendas', 'Vendedor consulta o saldo real e registra o pedido'], ['estoque', 'O pedido reserva o produto: ninguém vende o mesmo item duas vezes'], ['exped', 'Separação conferida com leitor de código de barras'], ['fiscal', 'NF-e emitida; etiqueta sai na impressora térmica'], ['fin', 'Título gerado automaticamente em contas a receber'], ['compras', 'Estoque mínimo atingido gera sugestão de compra']];
const S_ERP = {
  chapter: '<b>Desafio 3</b> · Sistemas', dot: '3', tip: 'Soluções — ERP integrado', cam: [0, 15, 18], target: [0, 2.6, 0],
  build() {
    const g = group(this); this.after = new THREE.Group(); this.before = new THREE.Group(); g.add(this.after, this.before);
    const hub = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), new THREE.MeshStandardMaterial({ color: C.teal, emissive: C.teal, emissiveIntensity: .45, wireframe: true }));
    hub.position.y = 3.5; this.after.add(hub); this.hub = hub;
    const core = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshStandardMaterial({ color: 0x0E2A33, emissive: C.teal, emissiveIntensity: .6 })); core.position.y = 3.5; this.after.add(core);
    label('ERP Bling<br><span class="muted">base única · nuvem</span>', core, { cls: 'big', offset: [0, 2.4, 0] });
    this.mods = {}; this.spokes = [];
    MODS.forEach(([id, nm, col], i) => {
      const a = i / MODS.length * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 1.4), new THREE.MeshStandardMaterial({ color: 0x141E36, emissive: col, emissiveIntensity: .25 }));
      m.position.set(Math.cos(a) * 7, 2 + Math.sin(i) * .3, Math.sin(a) * 5.5); this.after.add(m); m.add(edges(m.geometry, col, .9));
      label(nm, m, { offset: [0, 1, 0] }); this.mods[id] = m;
      pickable(m, { tip: `<b>${nm}</b><br>Lê e grava na mesma base do ERP.` });
      const curve = new THREE.QuadraticBezierCurve3(core.position.clone(), core.position.clone().lerp(m.position, .5).add(new THREE.Vector3(0, 1.5, 0)), m.position.clone());
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .55 }));
      this.after.add(line);
      for (let k = 0; k < 3; k++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 8), glow(col)); p.userData = { curve, u: k / 3, dir: k % 2 ? 1 : -1 }; this.after.add(p); this.spokes.push(p); }
    });
    this.token = new THREE.Mesh(new THREE.SphereGeometry(.35, 20, 16), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: C.orange, emissiveIntensity: 1.2 })); this.token.visible = false; this.after.add(this.token);
    // antes: ilhas
    const isl = [['Planilha de estoque<br><span class="muted">PC da administração</span>', [-6, 2.5, -2]], ['Planilha de pedidos<br><span class="muted">comercial</span>', [6, 2.5, -2.5]], ['Programa financeiro<br><span class="muted">1 única máquina</span>', [0, 2.5, 4.5]]];
    isl.forEach(([t, p], i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, .2, 1.8), new THREE.MeshStandardMaterial({ color: 0x3A1E26, emissive: C.red, emissiveIntensity: .35, transparent: true }));
      m.position.set(...p); m.rotation.set(.3, i, .1); this.before.add(m); m.add(edges(m.geometry, C.red, .9));
      label(t, m, { offset: [0, 1.2, 0] });
    });
    const pts = isl.map(i => new THREE.Vector3(...i[1]));
    [[0, 1], [1, 2], [2, 0]].forEach(([a, b]) => {
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([pts[a], pts[b]]), new THREE.LineDashedMaterial({ color: C.red, dashSize: .3, gapSize: .3, transparent: true, opacity: .7 }));
      l.computeLineDistances(); this.before.add(l);
      const mid = new THREE.Object3D(); mid.position.copy(pts[a].clone().lerp(pts[b], .5)); this.before.add(mid); label('<span class="hl-r">digitação manual · atraso</span>', mid, { cls: 'sm' });
    });
    this.before.visible = false; this.mode = 'depois';
  },
  setMode(m) { this.mode = m; fadeGroup(this.before, m === 'antes', 500); fadeGroup(this.after, m === 'depois', 500); $$('#erpSeg button').forEach(b => b.classList.toggle('on', b.dataset.m === m)); $('#simBtn') && ($('#simBtn').disabled = m !== 'depois'); },
  html: () => `<div class="kicker">Desafio 3 · Sistemas</div><h2>Três bases isoladas viram uma só</h2>
    <div class="row" style="margin:6px 0 10px"><div class="seg" id="erpSeg"><button data-m="antes">Antes</button><button data-m="depois" class="on">Depois</button></div></div>
    <p>ERP em nuvem: o comercial vê o mesmo saldo que o depósito, no mesmo segundo.</p>
    <div class="row"><button class="btn primary" id="simBtn">▶ Simular um pedido</button></div>
    <ol class="steps" id="steps">${FLOW.map(f => `<li>${f[1]}</li>`).join('')}</ol>
    <h3>Por que Bling (e não Omie)</h3>
    <table><tr><th></th><th>Bling Titânio</th><th>Omie</th></tr>
    <tr><td>Preço</td><td>a partir de R$ 120/mês</td><td>a partir de R$ 309/mês</td></tr>
    <tr><td>Usuários</td><td>até 50</td><td>conforme plano</td></tr>
    <tr><td>Forte em</td><td>estoque, pedidos, NF-e</td><td>financeiro e contábil</td></tr></table>
    <p class="small" style="margin-top:6px">Fontes: ${srcLink('bling')} · ${srcLink('omie')}</p>`,
  bind(root) {
    $$('#erpSeg button', root).forEach(b => b.onclick = () => this.setMode(b.dataset.m));
    $('#simBtn').onclick = () => this.simulate();
  },
  simulate() {
    if (this.sim) return; this.sim = true; const lis = $$('#steps li'); lis.forEach(l => l.classList.remove('on'));
    const core = new THREE.Vector3(0, 3.5, 0); this.token.visible = true; let step = 0;
    const next = () => {
      if (step >= FLOW.length || !this.group.visible) { this.sim = false; this.token.visible = false; return; }
      const m = this.mods[FLOW[step][0]]; const from = this.token.position.clone().lengthSq() ? this.token.position.clone() : core.clone();
      lis.forEach((l, i) => l.classList.toggle('on', i <= step));
      Object.values(this.mods).forEach(x => x.material.emissiveIntensity = .25);
      tween(650, e => this.token.position.lerpVectors(from, core, e), () =>
        tween(650, e => this.token.position.lerpVectors(core, m.position, e), () => { m.material.emissiveIntensity = 1.1; step++; setTimeout(next, 500); }));
    };
    this.token.position.copy(core); next();
  },
  enter() { this.sim = false; this.token.visible = false; this.before.visible = false; this.before.userData.k = 0; this.after.visible = true; this.after.userData.k = 1; setOpacity(this.after, 1); this.mode = 'depois'; Object.values(this.mods).forEach(x => x.material.emissiveIntensity = .25); },
  update(t) { this.hub.rotation.y = t * .4; this.hub.rotation.z = t * .2; this.spokes.forEach(p => { p.userData.u = (p.userData.u + .008) % 1; p.position.copy(p.userData.curve.getPoint(p.userData.dir > 0 ? p.userData.u : 1 - p.userData.u)); }); },
  notes: 'Antes: três ilhas e digitação manual entre elas, que é exatamente onde nasce a venda sem estoque. Depois: uma base só. Cliquem em Simular um pedido e acompanhem os seis passos sem redigitação.'
};

/* ---------- 8. PESQUISA DE MERCADO ---------- */
const S_MKT = {
  chapter: '<b>Desafio 4</b> · Pesquisa de mercado', dot: '4', tip: 'Pesquisa de mercado', cam: [0, 6.5, 21], target: [0, 3, 0],
  build() {
    const g = group(this); this.cg = new THREE.Group(); g.add(this.cg);
    const byCat = {}; CAPEX.forEach(x => { (byCat[x.cat] = byCat[x.cat] || []).push(x); });
    this.cats = Object.entries(byCat).map(([cat, its]) => ({ cat, its, v: sum(its, itemTotal) })).sort((a, b) => b.v - a.v);
    const max = this.cats[0].v;
    this.chart = barChart(this.cg, this.cats.map(c => ({
      id: c.cat, value: c.v, color: CAT_COLOR[c.cat], name: `${c.cat}<br><span class="muted">${c.its.length} ${c.its.length > 1 ? 'itens' : 'item'}</span>`,
      top: e => BRLk(c.v * e),
      tip: `<b>${c.cat}: ${BRL(c.v)}</b><br><span class="small">${c.its.map(x => `${x.qtd}× ${x.item.split(' (')[0].split(' —')[0]} — ${BRL(itemTotal(x))}`).join('<br>')}</span>`,
      onClick: () => { const b = $(`#catSeg button[data-c="${c.cat}"]`); b && b.click(); },
    })), { gap: 2.4, w: 1.5, unit: max / 7 });
    const t = new THREE.Object3D(); t.position.set(0, 9.2, 0); g.add(t);
    label(`Investimento total por categoria (Ondas 1–3, opção A): <b class="hl">${BRL(sum(CAPEX, itemTotal))}</b>`, t, { cls: 'sm' });
  },
  html() {
    const cats = [...new Set(CAPEX.map(x => x.cat))];
    return `<div class="kicker">Desafio 4 · Pesquisa de mercado</div><h2>Cada item com fornecedor e preço verificável</h2>
    <p class="small">Preços pesquisados em 16/11/2026 em lojas brasileiras e tabelas públicas. O gráfico mostra para onde vai o dinheiro: as barras crescem da categoria mais cara para a mais barata. Clique numa barra para filtrar a tabela.</p>
    <div class="tabs"><button class="on" data-t="itens">Itens e fontes</button><button data-t="comp">Compra × locação</button><button data-t="rec">Serviços mensais</button></div>
    <div data-p="itens"><div class="row" style="margin-bottom:6px"><div class="seg" id="catSeg"><button class="on" data-c="">Todos</button>${cats.map(c => `<button data-c="${c}">${c}</button>`).join('')}</div></div>
      <table><thead><tr><th>Item</th><th>Fornecedor / referência</th><th class="n">Unit.</th></tr></thead><tbody>
      ${CAPEX.map(x => `<tr data-item="${x.id}" data-cat="${x.cat}"><td>${x.item}<div class="small">${x.obs}</div></td><td>${x.forn}<br><span class="small">${srcLink(x.src)}</span></td><td class="n">${BRL(x.un)}</td></tr>`).join('')}
      </tbody></table></div>
    <div data-p="comp" hidden>
      <h3>Desktops (4 trocas da Onda 3)</h3>
      <div class="small">Compra Lenovo neo 50s: ${BRL(5933.14)} por unidade · Locação Vivo Positivo C6400: ${BRL(192.99)}/mês × 48 = ${BRL(192.99 * 48)}</div>
      <div class="bar"><i style="width:${5933.14 / 9263.52 * 100}%"></i></div><div class="small">Compra = 64% do custo da locação em 48 meses. A locação inclui manutenção e preserva caixa.</div>
      <p class="small">${srcLink('fast_pc')} · ${srcLink('vivo_loc')}</p>
      <h3>Impressão</h3>
      <div class="small">Comprar 2 × Brother DCP-L5662DN: ${BRL(9558)} iniciais, fora toner e manutenção · Locar 2 multifuncionais (4.000 pág.): ${BRL(560)}/mês, com tudo incluso.</div>
      <p class="small">Recomendação: locar agora (sem consumir o orçamento de investimento) e reavaliar com 3 meses de contadores. ${srcLink('brother')} · ${srcLink('ohub_print')}</p>
      <h3>ERP</h3><div class="small">Bling Titânio a partir de R$ 120/mês × Omie a partir de R$ 309/mês. ${srcLink('bling')} · ${srcLink('omie')}</div>
      <h3>Suporte</h3><div class="small">Contrato por dispositivo: R$ 98 (Essencial) a R$ 185 (com EDR e backup) na Verum IT; faixa de mercado de R$ 80–250 por estação. ${srcLink('verum')} · ${srcLink('sa8')}</div>
    </div>
    <div data-p="rec" hidden><table><thead><tr><th>Serviço</th><th>Fonte</th><th class="n">Unit.</th></tr></thead><tbody>
      ${OPEX.map(x => `<tr><td>${x.item}<div class="small">${x.obs}</div></td><td><span class="small">${srcLink(x.src)}</span></td><td class="n">${BRL(x.un)}<div class="small">${x.unit}</div></td></tr>`).join('')}
      </tbody></table></div>
    <p class="small" style="margin-top:10px">Preços de varejo mudam rápido: antes da compra, a consultoria cota cada item com 3 fornecedores e congela a proposta.</p>
    <div class="row" style="margin-top:8px"><button class="btn" id="mktPlay">▶ Reproduzir gráfico</button></div>`;
  },
  bind(root) {
    $$('.tabs button', root).forEach(b => b.onclick = () => { $$('.tabs button', root).forEach(x => x.classList.toggle('on', x === b)); $$('[data-p]', root).forEach(p => p.hidden = p.dataset.p !== b.dataset.t); });
    $$('#catSeg button', root).forEach(b => b.onclick = () => {
      $$('#catSeg button', root).forEach(x => x.classList.toggle('on', x === b)); const c = b.dataset.c;
      $$('tr[data-cat]', root).forEach(r => r.hidden = c && r.dataset.cat !== c);
      this.chart.dim(it => !c || it.id === c);
    });
    $('#mktPlay').onclick = () => { this.chart.dim(() => true); this.chart.play(); };
  },
  enter() { this.chart.dim(() => true); this.chart.play(); },
  exit() { this.chart.stop(); },
  notes: 'Todo item principal tem fornecedor e link verificável. O gráfico mostra que computadores e rede concentram o investimento. Na aba Compra × locação: comprar desktops sai 36% mais barato em 4 anos, mas a impressão locada vence porque inclui toner, peças e troca.'
};

/* ---------- 9. ORÇAMENTO ---------- */
const OPEX_SHORT = { msp: 'Suporte de TI<br>com SLA', m365b: 'Microsoft 365<br>Basic (24)', m365a: 'Microsoft 365<br>Apps (6)', erp: 'ERP<br>Bling', print: 'Locação de<br>impressão', link2: 'Link de<br>internet reserva', lease: 'Locação<br>4 desktops' };
const S_BUD = {
  chapter: '<b>Desafio 5</b> · Orçamento', dot: '5', tip: 'Orçamento', cam: [0, 6.5, 23.5], target: [0, 3.6, 0],
  tab: 'res',
  build() {
    const g = group(this); this.inv = new THREE.Group(); this.op = new THREE.Group(); g.add(this.inv, this.op);
    this.rebuild();
  },
  rebuild() {
    const o3 = totals.o3base + (optA ? totals.pc4 : 0), U = 10000;
    const seg1 = [totals.o1, C.orange], seg2 = [totals.o2, C.teal], seg3 = [o3, C.blue];
    this.invChart = barChart(this.inv, [
      { value: totals.o1, segs: [seg1], name: 'Onda 1<br><span class="muted">Fundação</span>', top: e => BRLk(totals.o1 * e), tip: `<b>Onda 1 — Fundação: ${BRL(totals.o1)}</b><br>Rede, Wi-Fi, energia, backup e 2 PCs do financeiro.` },
      { value: totals.o12, segs: [seg1, seg2], name: 'Ondas 1 + 2<br><span class="muted">dentro do teto</span>', top: e => BRLk(totals.o12 * e), tip: `<b>Ondas 1 + 2: ${BRL(totals.o12)}</b><br>Onda 2 (${BRL(totals.o2)}): implantação do ERP, etiquetadora e leitores.` },
      { value: totals.o12 + o3, segs: [seg1, seg2, seg3], name: `Projeto completo<br><span class="muted">opção ${optA ? 'A · compra' : 'B · locação'}</span>`, top: e => BRLk((totals.o12 + o3) * e), tip: `<b>Com a Onda 3: ${BRL(totals.o12 + o3)}</b><br>Onda 3 (${BRL(o3)}): SSD, memória${optA ? ' e 4 desktops' : '; desktops locados'}.` },
    ], { gap: 4.2, w: 2.3, unit: U });
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(13.2, .02, 2.8), glow(C.orange, { opacity: .16, depthWrite: false })); ceil.position.set(0, BUDGET_CEILING / U, 0); this.inv.add(ceil);
    const cline = new THREE.Mesh(new THREE.BoxGeometry(13.2, .06, .06), glow(C.orange, { opacity: .95 })); cline.position.set(0, BUDGET_CEILING / U, 1.42); this.inv.add(cline);
    const cl = new THREE.Object3D(); cl.position.set(4.9, BUDGET_CEILING / U + .05, 1.42); this.inv.add(cl);
    label('<span class="hl">teto R$ 45 mil</span>', cl, { cls: 'sm' }).el.style.transform = 'translate(-50%,-130%)';
    const parts = OPEX.map(x => ({ id: x.id, v: itemTotal(x) })); if (!optA) parts.push({ id: 'lease', v: totals.lease });
    parts.sort((a, b) => b.v - a.v);
    const tot = sum(parts, p => p.v); const colorOf = id => id === 'lease' ? 0x9FB4E8 : new THREE.Color(OPEX.find(x => x.id === id).color).getHex();
    this.opChart = barChart(this.op, parts.map(p => ({ value: p.v, color: colorOf(p.id), name: OPEX_SHORT[p.id], top: e => BRL(p.v * e).replace(',00', ''), tip: `<b>${p.id === 'lease' ? LEASE_OPTION.item : OPEX.find(x => x.id === p.id).item}</b><br>${BRL(p.v)}/mês · ${(p.v / tot * 100).toFixed(0)}% do mensal` })), { gap: 2.25, w: 1.4, unit: parts[0].v / 6.2 });
    const tl = new THREE.Object3D(); tl.position.set(0, 8.4, 0); this.op.add(tl);
    label(`Mensal recorrente: <b class="hl">${BRL(tot)}</b> · anual ${BRL(tot * 12)}`, tl, { cls: 'big' });
    this.showTab(this.tab, false);
  },
  showTab(t, play = true) {
    this.tab = t; const op = t === 'op';
    this.inv.visible = !op; this.op.visible = op;
    if (play) (op ? this.opChart : this.invChart).play();
  },
  html() {
    const pct = Math.min(100, totals.o12 / BUDGET_CEILING * 100);
    const ondaRows = [1, 2, 3].map(n => { const its = CAPEX.filter(x => x.onda === n); return `<tr class="sub"><td colspan="3">Onda ${n} — ${['', 'Fundação (semanas 1–5)', 'Integração (semanas 6–12)', 'Parque (semanas 15–22)'][n]}</td><td class="n">${BRL(sum(its.filter(x => !x.optA), itemTotal))}</td></tr>` + its.map(x => `<tr><td>${x.item}${x.optA ? ' <span class="tag" style="color:#4C8DFF">opção A</span>' : ''}</td><td class="n">${x.qtd}</td><td class="n">${BRL(x.un)}</td><td class="n">${BRL(itemTotal(x))}</td></tr>`).join(''); }).join('');
    const mo = totals.opex + (optA ? 0 : totals.lease);
    return `<div class="kicker">Desafio 5 · Orçamento</div><h2>Investimento em ondas, mensalidades à parte</h2>
    <div class="row" style="margin:4px 0 6px"><span class="small">4 desktops da Onda 3:</span><div class="seg" id="abSeg"><button data-o="A" class="${optA ? 'on' : ''}">A · Comprar</button><button data-o="B" class="${optA ? '' : 'on'}">B · Locar</button></div></div>
    <div class="tabs"><button data-t="res">Investimento inicial</button><button data-t="cap">Detalhe por item</button><button data-t="op">Custo mensal</button></div>
    <div data-p="res">
      <p class="small">As barras somam as ondas uma a uma. A linha laranja é o teto de R$ 45 mil.</p>
      <div class="small">Ondas 1+2 × teto</div><div class="bar"><i style="width:${pct}%"></i></div>
      <div class="small"><b class="hl">${BRL(totals.o12)}</b> · sobra ${BRL(BUDGET_CEILING - totals.o12)}</div>
      ${stats([[BRLk(totals.o1), 'Onda 1 · Fundação'], [BRLk(totals.o2), 'Onda 2 · Integração'], [BRLk(totals.o3base + (optA ? totals.pc4 : 0)), 'Onda 3 · Parque']])}
      <p class="small">A Onda 3 fica acima do teto inicial, como o enunciado admite, e só é liberada depois de medidos os ganhos das Ondas 1–2. Com a opção B, o investimento total cai para ${BRL(totals.o12 + totals.o3base)}, mas o mensal sobe ${BRL(totals.lease)}.</p>
    </div>
    <div data-p="cap" hidden><table><thead><tr><th>Item</th><th class="n">Qtd</th><th class="n">Unit.</th><th class="n">Total</th></tr></thead><tbody>${ondaRows}
      <tr class="tot"><td colspan="3">Ondas 1 + 2 (dentro do teto)</td><td class="n">${BRL(totals.o12)}</td></tr>
      <tr class="tot"><td colspan="3">Total com Onda 3 — opção A</td><td class="n">${BRL(totals.o12 + totals.o3base + totals.pc4)}</td></tr>
      <tr class="tot"><td colspan="3">Total com Onda 3 — opção B</td><td class="n">${BRL(totals.o12 + totals.o3base)}</td></tr></tbody></table></div>
    <div data-p="op" hidden>
      <p class="small">Orçamento separado, como pede o enunciado. As barras crescem do maior para o menor custo.</p>
      ${stats([[BRL(mo), 'por mês'], [BRLk(mo * 12), 'por ano'], [BRL(OPEX[0].un), 'suporte por PC']])}
      <table><thead><tr><th>Serviço</th><th class="n">Qtd</th><th class="n">Unit.</th><th class="n">Mês</th></tr></thead><tbody>
      ${OPEX.map(x => `<tr><td>${x.item}<div class="small">${x.unit}</div></td><td class="n">${x.qtd}</td><td class="n">${BRL(x.un)}</td><td class="n">${BRL(itemTotal(x))}</td></tr>`).join('')}
      ${optA ? '' : `<tr><td>${LEASE_OPTION.item}</td><td class="n">4</td><td class="n">${BRL(LEASE_OPTION.un)}</td><td class="n">${BRL(totals.lease)}</td></tr>`}
      <tr class="tot"><td colspan="3">Total mensal</td><td class="n">${BRL(mo)}</td></tr>
      <tr><td colspan="3">Total anual</td><td class="n">${BRL(mo * 12)}</td></tr></tbody></table>
      <p class="small" style="margin-top:6px">Preços da Microsoft sem impostos. O link de internet atual (500 Mbps) continua e não entra na conta.</p></div>
    <div class="row" style="margin-top:8px"><button class="btn" id="budPlay">▶ Reproduzir gráfico</button></div>`;
  },
  bind(root) {
    const sel = t => { $$('.tabs button', root).forEach(x => x.classList.toggle('on', x.dataset.t === t)); $$('[data-p]', root).forEach(p => p.hidden = p.dataset.p !== t); };
    sel(this.tab);
    $$('.tabs button', root).forEach(b => b.onclick = () => { const was = this.tab === 'op'; sel(b.dataset.t); const now = b.dataset.t === 'op'; this.showTab(b.dataset.t, was !== now); });
    $$('#abSeg button', root).forEach(b => b.onclick = () => { optA = b.dataset.o === 'A'; this.rebuild(); renderPanel(this); (this.tab === 'op' ? this.opChart : this.invChart).play(); });
    $('#budPlay').onclick = () => (this.tab === 'op' ? this.opChart : this.invChart).play();
  },
  enter() { this.tab = 'res'; this.showTab('res'); },
  exit() { this.invChart.stop(); this.opChart.stop(); },
  notes: 'As barras somam as ondas uma a uma: a Onda 1, depois Onda 1 mais Onda 2, ainda abaixo da linha laranja de R$ 45 mil, e por fim o projeto completo. Na aba Custo mensal, o orçamento separado: mais da metade é o suporte com SLA.'
};

/* ---------- 10. IMPLANTAÇÃO ---------- */
const WX = w => (w - 12) * .82;
const S_IMP = {
  chapter: '<b>Desafio 6</b> · Implantação', dot: '6', tip: 'Implantação — cronograma', cam: [-1, 26, 18], target: [-1, 0, 1],
  build() {
    const g = group(this); this.blocks = {};
    const rows = Math.max(...PLAN.map(p => p.row)) + 1; const RZ = r => (r - rows / 2) * 1.2;
    PLAN.forEach(p => {
      const w = p.dur * .82 - .08; const m = box(w, .6, .9, new THREE.MeshStandardMaterial({ color: ONDA_COLOR[p.onda], emissive: ONDA_COLOR[p.onda], emissiveIntensity: .15, roughness: .4 }), WX(p.start) + w / 2, .3 + (p.id === 'p1' ? .7 : 0), RZ(p.row));
      g.add(m); this.blocks[p.id] = m;
      pickable(m, { tip: `<b>${p.title}</b><br>${p.when}`, onClick: () => this.show(p.id) });
      label(p.title, m, { cls: 'sm', offset: [-w / 2, .55, 0] }).el.style.transform = 'translate(0,-50%)';
    });
    FREEZE.forEach(([a, b]) => { const f = box((b - a) * .82, .9, rows * 1.2 + .6, new THREE.MeshBasicMaterial({ color: C.red, transparent: true, opacity: .1, depthWrite: false }), WX(a) + (b - a) * .82 / 2, .45, 0); f.castShadow = f.receiveShadow = false; g.add(f); });
    const fl = new THREE.Object3D(); fl.position.set(WX(FREEZE[0][0]) + .4, 2.1, RZ(-0.6)); g.add(fl); label('<span class="hl-r">fechamento mensal: congelado</span>', fl, { cls: 'sm' });
    for (let w = 0; w < 24; w += 2) { const o = new THREE.Object3D(); o.position.set(WX(w), 0, RZ(rows) + .3); g.add(o); label('S' + (w + 1), o, { cls: 'sm' }); }
    const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(WX(0), .02, RZ(rows) - .2), new THREE.Vector3(WX(24), .02, RZ(rows) - .2)]), new THREE.LineBasicMaterial({ color: 0x8D9AB8 })); g.add(axis);
    this.head = box(.07, 1.2, rows * 1.2 + 1, glow(C.teal, { opacity: .35 }), WX(0), .6, 0); this.head.castShadow = false; g.add(this.head);
    this.week = 0; this.playing = false;
  },
  show(id) {
    const p = PLAN.find(x => x.id === id); Object.entries(this.blocks).forEach(([k, m]) => m.material.emissiveIntensity = k === id ? .9 : .15);
    $('#impDetail').innerHTML = `<div class="detail"><span class="tag" style="color:${ONDA_HEX[p.onda]}">${p.onda ? 'Onda ' + p.onda : 'Preparação'}</span><h3 style="margin-top:6px">${p.title}</h3><dl><dt>Quando</dt><dd>${p.when}</dd><dt>Como</dt><dd>${p.detail}</dd></dl></div>`;
  },
  setWeek(w) {
    this.week = w; this.head.position.x = WX(w);
    const act = PLAN.filter(p => w >= p.start && w < p.start + p.dur);
    Object.entries(this.blocks).forEach(([k, m]) => { const p = PLAN.find(x => x.id === k); m.material.emissiveIntensity = act.includes(p) ? .9 : (w >= p.start + p.dur ? .05 : .2); });
    const el = $('#impNow'); if (el) el.innerHTML = `<b class="hl-t">Semana ${Math.min(24, Math.floor(w) + 1)}</b> — ${act.length ? act.map(a => a.title).join(' · ') : '<span class="muted">estabilização</span>'}${FREEZE.some(([a, b]) => w >= a && w < b) ? ' <span class="tag hl-r">congelamento</span>' : ''}`;
  },
  html: () => `<div class="kicker">Desafio 6 · Implantação</div><h2>24 semanas, sem parar a operação</h2>
    <div class="legend"><span><i style="background:#8D9AB8"></i>Preparação</span><span><i style="background:#FF8A3D"></i>Onda 1</span><span><i style="background:#2EC4B6"></i>Onda 2</span><span><i style="background:#4C8DFF"></i>Onda 3</span><span><i style="background:rgba(255,77,94,.5)"></i>Fechamento mensal</span></div>
    <div class="row" style="margin:8px 0"><button class="btn primary" id="playBtn">▶ Reproduzir cronograma</button><input id="wk" type="range" min="0" max="24" step=".1" value="0" style="flex:1;accent-color:#2EC4B6"></div>
    <div id="impNow" class="small"></div>
    <h3>Regras para não interromper a empresa</h3>
    <ul class="small" style="padding-left:18px;margin:0">
      <li>Obras de rede por zonas, aos <b>sábados após as 12h</b> e depois das 18h.</li>
      <li>A rede antiga só é desligada depois que a nova passa no teste.</li>
      <li><b>Nada muda nos dias de fechamento</b>; os PCs do financeiro são trocados fora dessa janela.</li>
      <li>Go-live do ERP no início do mês, com 2 semanas de conferência em paralelo.</li>
      <li>Upgrade de PCs à noite, em lotes de 3: o usuário chega e a máquina está pronta.</li></ul>
    <div id="impDetail"></div>`,
  bind(root) {
    $('#playBtn').onclick = () => { this.playing = !this.playing; if (this.week >= 23.9) this.week = 0; $('#playBtn').textContent = this.playing ? '❚❚ Pausar' : '▶ Reproduzir cronograma'; };
    $('#wk').oninput = e => { this.playing = false; $('#playBtn').textContent = '▶ Reproduzir cronograma'; this.setWeek(+e.target.value); };
  },
  enter() { this.playing = false; this.setWeek(0); },
  update(t, dt) { if (this.playing) { const w = Math.min(24, this.week + dt * 1.6); this.setWeek(w); const r = $('#wk'); if (r) r.value = w; if (w >= 24) { this.playing = false; $('#playBtn').textContent = '▶ Reproduzir cronograma'; } } },
  notes: 'Reproduzam o cronograma. Na semana 1, ações de custo zero: trocar a senha do Wi-Fi e fazer uma cópia da pasta do financeiro já reduzem o risco hoje. As faixas vermelhas são os fechamentos mensais, em que nada muda.'
};

/* ---------- 11. BENEFÍCIOS E RISCOS ---------- */
const RP = (P, I) => [(P - 3) * 2.4, 0, -(I - 3) * 2.4];
const S_RISK = {
  chapter: '<b>Desafio 7</b> · Benefícios e riscos', dot: '7', tip: 'Benefícios e riscos', cam: [9, 16, 18], target: [0, 1, 0],
  build() {
    const g = group(this); this.balls = {}; this.mitigated = false;
    for (let P = 1; P <= 5; P++) for (let I = 1; I <= 5; I++) { const s = P * I / 25; const col = new THREE.Color().setHSL(.33 - .33 * Math.min(1, s * 1.3), .7, .16 + .1 * s); g.add(box(2.3, .08, 2.3, new THREE.MeshStandardMaterial({ color: col, roughness: .9 }), ...RP(P, I))); }
    const a1 = new THREE.Object3D(); a1.position.set(0, 0, 8.2); g.add(a1); label('PROBABILIDADE →', a1, { cls: 'room' });
    const a2 = new THREE.Object3D(); a2.position.set(-8.2, 0, 0); g.add(a2); label('IMPACTO →', a2, { cls: 'room' });
    const cnt = {}, idx = {};
    RISKS.forEach(r => { cnt['a' + r.P + r.I] = (cnt['a' + r.P + r.I] || 0) + 1; cnt['b' + r.P2 + r.I2] = (cnt['b' + r.P2 + r.I2] || 0) + 1; });
    const off = (key) => { const j = idx[key] = (idx[key] ?? -1) + 1, n = cnt[key]; const a = n > 1 ? j / n * Math.PI * 2 : 0, rad = n > 1 ? .6 : 0; return new THREE.Vector3(Math.cos(a) * rad, 1, Math.sin(a) * rad); };
    RISKS.forEach(r => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(.36, 24, 16), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: C.red, emissiveIntensity: .6 }));
      const p1 = new THREE.Vector3(...RP(r.P, r.I)).add(off('a' + r.P + r.I)); const p2 = new THREE.Vector3(...RP(r.P2, r.I2)).add(off('b' + r.P2 + r.I2));
      m.position.copy(p1); m.userData = { p1, p2 }; g.add(m); this.balls[r.id] = m;
      pickable(m, { tip: `<b>${r.name}</b><br>P${r.P}×I${r.I} → P${r.P2}×I${r.I2}`, onClick: () => this.show(r.id), hoverScale: 1.3 });
      label(r.name, m, { cls: 'sm', offset: [0, .75, 0] });
    });
  },
  setMit(on) {
    this.mitigated = on;
    Object.values(this.balls).forEach(m => { const a = m.position.clone(), b = on ? m.userData.p2 : m.userData.p1; tween(1200, e => { m.position.lerpVectors(a, b, e); m.position.y = 1 + Math.sin(e * Math.PI) * 2; }); m.material.emissive.setHex(on ? C.green : C.red); });
    $$('#mitSeg button').forEach(b => b.classList.toggle('on', (b.dataset.m === 'depois') === on));
  },
  show(id) { const r = RISKS.find(x => x.id === id); $('#riskDetail').innerHTML = `<div class="detail"><h3 style="margin-top:0">${r.name}</h3><dl><dt>Antes</dt><dd>Probabilidade ${r.P} × impacto ${r.I} = <b class="hl-r">${r.P * r.I}</b></dd><dt>Prevenção</dt><dd>${r.mit}</dd><dt>Residual</dt><dd>${r.P2} × ${r.I2} = <b class="hl-g">${r.P2 * r.I2}</b></dd></dl></div>`; },
  html: () => `<div class="kicker">Desafio 7 · Benefícios e riscos</div><h2>O que melhora, e o que pode dar errado</h2>
    <div class="tabs"><button class="on" data-t="ben">Benefícios</button><button data-t="risk">Riscos</button></div>
    <div data-p="ben"><table><thead><tr><th>Indicador</th><th>Hoje</th><th>Meta</th></tr></thead><tbody>
      ${KPIS.map(k => `<tr><td>${k.k}<div class="small">${k.how}</div></td><td class="hl-r">${k.antes}</td><td class="hl-g">${k.meta}</td></tr>`).join('')}</tbody></table>
      <p class="small" style="margin-top:8px">Benefícios indiretos: base pronta para crescer 20% sem refazer a rede, dados confiáveis para decisão e adequação à LGPD (acesso individual e rede de visitantes isolada).</p></div>
    <div data-p="risk" hidden>
      <div class="row" style="margin-bottom:8px"><div class="seg" id="mitSeg"><button data-m="antes" class="on">Sem prevenção</button><button data-m="depois">Com prevenção</button></div></div>
      <p class="small">Clique nas esferas da matriz probabilidade × impacto.</p>
      ${RISKS.map(r => `<button class="card" style="width:100%;margin:3px 0" data-r="${r.id}"><div class="t">${r.name} <span class="hl-r">${r.P * r.I}</span> → <span class="hl-g">${r.P2 * r.I2}</span></div><div class="s">${r.mit}</div></button>`).join('')}
      <div id="riskDetail"></div></div>`,
  bind(root) {
    $$('.tabs button', root).forEach(b => b.onclick = () => { $$('.tabs button', root).forEach(x => x.classList.toggle('on', x === b)); $$('[data-p]', root).forEach(p => p.hidden = p.dataset.p !== b.dataset.t); });
    $$('#mitSeg button', root).forEach(b => b.onclick = () => this.setMit(b.dataset.m === 'depois'));
    $$('[data-r]', root).forEach(b => b.onclick = () => this.show(b.dataset.r));
  },
  enter() { if (this.mitigated) this.setMit(false); },
  update(t) { Object.values(this.balls).forEach((m, i) => m.rotation.y = t + i); },
  notes: 'Cada benefício tem uma meta medível e a forma de medir. Na aba Riscos, cliquem em “Com prevenção”: as esferas descem para a zona verde. O maior risco não é técnico, é a adesão ao ERP, e por isso há usuários-chave e operação em paralelo.'
};

/* ---------- 12. DEFESA ---------- */
const S_DEF = {
  chapter: '<b>Desafio 8</b> · Apresentação executiva', dot: '8', tip: 'Defesa diante da diretoria', cam: [0, 7.5, 17], target: [0, 3, 0],
  build() {
    const g = group(this); this.p = {};
    PERSONAS.forEach((p, i) => {
      const a = (i - 1.5) * .42; const x = Math.sin(a) * 10, z = -Math.cos(a) * 10 + 6;
      const col = new THREE.Color(p.color).getHex();
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 2.2, 32), new THREE.MeshStandardMaterial({ color: 0x141E36, roughness: .4, metalness: .4 })); ped.position.set(x, 1.1, z); g.add(ped);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.32, .05, 8, 48), glow(col)); ring.rotation.x = Math.PI / 2; ring.position.set(x, 2.22, z); g.add(ring);
      const head = new THREE.Mesh(new THREE.SphereGeometry(.55, 24, 16), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .35 })); head.position.set(x, 3.6, z); g.add(head);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(.6, .7, 6, 16), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .2 })); body.position.set(x, 2.75, z); g.add(body);
      [head, body, ped].forEach(m => pickable(m, { tip: `<b>${p.name}</b><br>${p.role}<br><span style="color:#FF8A3D">Clique para ver a resposta</span>`, onClick: () => this.show(p.id) }));
      label(`<b>${p.name.split(' ')[0]}</b><br><span class="muted">${p.role}</span>`, head, { offset: [0, 1.1, 0] });
      this.p[p.id] = { head, ring, body, y: 3.6 };
    });
  },
  show(id) {
    const p = PERSONAS.find(x => x.id === id); const tab = $('.tabs button[data-t="dir"]'); tab && tab.click();
    Object.entries(this.p).forEach(([k, o]) => o.head.material.emissiveIntensity = k === id ? 1.1 : .25);
    this.sel = id;
    $('#perDetail').innerHTML = `<div class="detail"><div class="kicker" style="color:${p.color}">${p.name} · ${p.role}</div><p style="font-style:italic">“${p.quote}”</p><dl><dt>Resposta</dt><dd>${p.answer}</dd><dt>Compromisso</dt><dd class="hl">${p.metric}</dd></dl></div>`;
  },
  html: () => `<div class="kicker">Desafio 8 · Apresentação executiva</div><h2>Uma resposta para cada diretor</h2>
    <div class="tabs"><button class="on" data-t="dir">Diretoria</button><button data-t="rot">Roteiro e equipe</button><button data-t="qa">Perguntas difíceis</button></div>
    <div data-p="dir"><div class="cards">${PERSONAS.map(p => `<button class="card" data-per="${p.id}"><div class="t" style="color:${p.color}">${p.name}</div><div class="s">${p.role}</div></button>`).join('')}</div><div id="perDetail"><p class="small">Clique em um diretor, no painel ou na cena 3D.</p></div></div>
    <div data-p="rot" hidden><table><thead><tr><th>Bloco</th><th>Mensagem</th><th class="n">min</th></tr></thead><tbody>
      ${PRESENTERS.map((pr, k) => { const its = SCRIPT.filter(x => x.by === pr.id); return `<tr class="sub"><td colspan="2">${k + 1}. ${pr.name} <span class="muted">· ${pr.part}</span></td><td class="n">${String(sum(its, x => x.min)).replace('.', ',')}</td></tr>` + its.map(s => `<tr data-goto="${s.slide}" style="cursor:pointer"><td>${s.who}</td><td>${s.txt}</td><td class="n">${String(s.min).replace('.', ',')}</td></tr>`).join(''); }).join('')}
      <tr class="tot"><td colspan="2">Total (+ perguntas)</td><td class="n">${sum(SCRIPT, s => s.min)}</td></tr></tbody></table>
      <p class="small" style="margin-top:6px">Clique numa linha para ir ao slide. O cronômetro no topo marca o tempo (atalho T).</p></div>
    <div data-p="qa" hidden>${QA.map(q => `<details class="acc"><summary>${q.q}</summary><div>${q.a}</div></details>`).join('')}</div>`,
  bind(root) {
    $$('.tabs button', root).forEach(b => b.onclick = () => { $$('.tabs button', root).forEach(x => x.classList.toggle('on', x === b)); $$('[data-p]', root).forEach(p => p.hidden = p.dataset.p !== b.dataset.t); });
    $$('[data-per]', root).forEach(b => b.onclick = () => this.show(b.dataset.per));
    $$('tr[data-goto]', root).forEach(r => r.onclick = () => go_(+r.dataset.goto));
  },
  update(t) { Object.entries(this.p).forEach(([k, o], i) => { o.head.position.y = o.y + Math.sin(t * 1.6 + i) * .08 + (k === this.sel ? .25 : 0); o.ring.rotation.z = t * .5; }); },
  notes: 'Fechamos respondendo a cada diretor com a frase dele. Mariana: não trocamos tudo e cabemos no teto. Carlos: saldo real. Fernanda: PCs novos e backup testado. Roberto: o depósito vem primeiro. Deixamos as perguntas difíceis já preparadas.'
};

/* ---------- 13. ENCERRAMENTO ---------- */
const S_END = {
  chapter: 'Decisão', dot: '✓', tip: 'Encerramento', cover: true, building: 'final', sun: true, cam: [-25, 12, 25], target: [0, 3.5, 0],
  html: () => `<div class="kicker">Decisão pedida hoje</div><h1>Aprovar a <span class="hl">Onda 1</span></h1>
    <p class="lead">Rede, Wi-Fi, backup e PCs do financeiro: ${BRL(totals.o1)}, executados em 5 semanas, junto com a assinatura do contrato de suporte.</p>
    ${stats([[BRLk(totals.o12), 'Ondas 1+2 · dentro do teto'], [BRL(totals.opex), 'mensal recorrente'], ['8 KPIs', 'revisados na semana 24']])}
    <div class="row" style="justify-content:center"><button class="btn" data-go="1">Rever os desafios</button><button class="btn" id="srcBtn2">Ver fontes de preço</button><button class="btn primary" data-go="12">Perguntas</button></div>`,
  bind() { $('#srcBtn2').onclick = openSources; },
  update(t) { building.root.rotation.y = -t * .06; },
  exit() { building.root.rotation.y = 0; },
  notes: 'Pedido objetivo: aprovem a Onda 1 hoje. Em cinco semanas, a rede está estável, os arquivos protegidos e o financeiro com máquinas novas. Obrigado. Ficamos à disposição para perguntas.'
};

const SLIDES = [S_COVER, S_AGENDA, S_DIAG, S_CHAIN, S_PRIO, S_SOL, S_TOPO, S_ERP, S_MKT, S_BUD, S_IMP, S_RISK, S_DEF, S_END];
