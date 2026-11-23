/* ============================================================
   NAVEGAÇÃO / LOOP
   ============================================================ */
let cur = -1;
const dotsEl = $('#dots');
SLIDES.forEach((s, i) => {
  const b = document.createElement('button'); b.className = 'dot';
  b.innerHTML = `${s.dot}<span class="tip">${s.tip}</span>`; b.onclick = () => go_(i); dotsEl.appendChild(b);
});

function renderPanel(s) {
  panelInner.innerHTML = s.html.call(s);
  $$('[data-go]', panelInner).forEach(b => b.onclick = () => go_(+b.dataset.go));
  s.bind && s.bind.call(s, panelInner);
}
function go_(i) {
  i = Math.max(0, Math.min(SLIDES.length - 1, i));
  if (i === cur) return;
  const prev = SLIDES[cur], s = SLIDES[i];
  if (prev) { prev.exit && prev.exit.call(prev); if (prev.group) fadeGroup(prev.group, false, 450); }
  cur = i;
  if (s.build && !s.group) s.build.call(s);
  if (s.group) { s.group.userData.k = 0; setOpacity(s.group, 0); fadeGroup(s.group, true, 700); }
  // prédio
  const BR = building.root;
  if (s.building) {
    if (!BR.userData.on) { BR.userData.on = true; building.setMode(s.building, !BR.visible); fadeGroup(BR, true, 700); }
    else building.setMode(s.building);
  } else if (BR.userData.on) { BR.userData.on = false; fadeGroup(BR, false, 450); }
  horizonSun.userData.target = s.sun ? 1 : 0;
  // painel
  const panel = $('#panel'); panelInner.classList.add('out');
  setTimeout(() => {
    panel.classList.toggle('cover', !!s.cover); panelSide = !s.cover; applyViewOffset();
    renderPanel(s); panelInner.scrollTop = 0; panelInner.classList.remove('out');
  }, cur === i && prev ? 220 : 0);
  if (!prev) { panel.classList.toggle('cover', !!s.cover); panelSide = !s.cover; applyViewOffset(); }
  const pr = presenterOf(i); $('#chapter').innerHTML = s.chapter + (pr ? ` <span class="presenter">· ${pr.name.split(' ')[0]}</span>` : '');
  $$('.dot', dotsEl).forEach((d, k) => d.classList.toggle('on', k === i));
  { const k = pr ? pr.slides.indexOf(i) + 1 : 0, nx = pr && PRESENTERS[PRESENTERS.indexOf(pr) + 1];
    $('#notesTxt').innerHTML = (pr ? `<div class="notes-who">${pr.name} · ${k} de ${pr.slides.length}${k === pr.slides.length && nx ? ` · depois: ${nx.name.split(' ')[0]}` : ''}</div>` : '') + `<div>${s.notes || ''}</div>` + (HANDOFF[i] ? `<div style="margin-top:8px"><b>Passagem:</b> ${HANDOFF[i]}</div>` : ''); }
  flyTo(s.cam, s.target, prev ? 1500 : 10);
  s.enter && s.enter.call(s);
  tooltip.classList.remove('on');
  try { history.replaceState(null, '', '#s' + i); } catch (e) { }
  if (i > 0 && !timer.started) startTimer();
}

/* ---------- cronômetro ---------- */
const timer = { started: false, t0: 0, acc: 0, running: false };
function startTimer() { timer.started = timer.running = true; timer.t0 = performance.now(); $('#btnTimer').classList.add('on'); }
function toggleTimer() { if (!timer.running) { timer.running = true; timer.started = true; timer.t0 = performance.now(); $('#btnTimer').classList.add('on'); } else { timer.acc += performance.now() - timer.t0; timer.running = false; $('#btnTimer').classList.remove('on'); } }
function tickTimer() {
  const ms = timer.acc + (timer.running ? performance.now() - timer.t0 : 0); const s = Math.floor(ms / 1000);
  $('#clock').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  $('#btnTimer').classList.toggle('over', s > 15 * 60);
}
$('#btnTimer').onclick = toggleTimer;
$('#btnTimer').ondblclick = () => { timer.acc = 0; timer.t0 = performance.now(); };

/* ---------- notas / fontes / tela cheia ---------- */
$('#btnNotes').onclick = () => { const n = $('#notes'); n.hidden = !n.hidden; $('#btnNotes').classList.toggle('on', !n.hidden); };
function openSources() {
  const used = new Set([...CAPEX.map(x => x.src), ...OPEX.map(x => x.src), 'amazon_nas', 'omie', 'vivo_loc', 'brother', 'sa8']);
  $('#modalBody').innerHTML = `<div class="kicker">Desafio 4 · Referências</div><h2>Fontes de preço (pesquisa em 16/11/2026)</h2>
    <p class="small">Valores de varejo variam diariamente; a compra deve ser precedida de 3 cotações. Composições públicas (ORSE, TRF1) servem de referência de mão de obra.</p>
    <ol style="padding-left:20px;font-size:13.5px">${[...used].map(k => `<li style="margin:5px 0">${srcLink(k)}</li>`).join('')}</ol>`;
  $('#modal').hidden = false;
}
$('#btnSources').onclick = openSources;
$('.modal-x').onclick = () => $('#modal').hidden = true;
$('#modal').onclick = e => { if (e.target.id === 'modal') $('#modal').hidden = true; };
$('#btnFull').onclick = () => { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) { } };
$('.brand').onclick = () => go_(0);
$('#prev').onclick = () => go_(cur - 1);
$('#next').onclick = () => go_(cur + 1);
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go_(cur + 1); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go_(cur - 1); }
  else if (e.key === 'Home') go_(0); else if (e.key === 'End') go_(SLIDES.length - 1);
  else if (e.key.toLowerCase() === 'n') $('#btnNotes').click();
  else if (e.key.toLowerCase() === 't') toggleTimer();
  else if (e.key.toLowerCase() === 'f') $('#btnFull').click();
  else if (e.key === 'Escape') $('#modal').hidden = true;
});
addEventListener('hashchange', () => { const m = location.hash.match(/^#s(\d+)$/); if (m) go_(+m[1]); });

/* ---------- loop ---------- */
const clock = new THREE.Clock();
function frame(now) {
  const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime;
  runTweens(now);
  controls.update();
  building.root.visible && building.update(t);
  const s = SLIDES[cur]; if (s && s.update) s.update.call(s, t, dt);
  const ht = horizonSun.userData.target ?? 0; horizonSun.material.opacity += (ht - horizonSun.material.opacity) * .09;
  renderer.render(scene, camera);
  updateLabels(); tickTimer();
  requestAnimationFrame(frame);
}
const m0 = location.hash.match(/^#s(\d+)$/);
go_(m0 ? +m0[1] : 0);
requestAnimationFrame(frame);
setTimeout(() => $('#loading').classList.add('done'), 300);
window.__go = go_;
