/* Colamgram — red social de la prepa del Colegio Americano de Saltillo (Colam High School).
   Todo vive en el navegador (localStorage). Ver README para conectarlo a un servidor real. */

const STORE_KEY = 'colamgram.v1';
const STORY_MS = 5000;
const STORY_TTL = 24 * 60 * 60 * 1000;
const CATEGORIES = ['Todo', 'Eventos', 'Deportes', 'Académico', 'Arte', 'Clubs', 'Vida Colam'];
const PALETTE = ['#1f2a6e', '#4e9a24', '#f08a24', '#2f3f9e', '#6cbf3a', '#c86a12'];
const BANNED = ['idiota', 'estupido', 'estúpido', 'pendejo', 'puto', 'puta', 'mierda', 'naco', 'gordo feo'];

const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.3-9.5C1.5 8 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.6 0 5.7 3.5 4.5 7-1.8 4.9-9.3 9.5-9.3 9.5z"/></svg>';
const ICON_COMMENT = '<svg viewBox="0 0 24 24"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/></svg>';
const ICON_SHARE = '<svg viewBox="0 0 24 24"><path d="M22 3 11 14M22 3l-7 19-4-8-8-4z"/></svg>';
const ICON_SAVE = '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-5-6 5z"/></svg>';
const ICON_GRID = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>';

/* ---------- Datos ---------- */

function art(emoji, title, c1, c2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="480" cy="120" r="160" fill="#fff" opacity=".08"/><circle cx="90" cy="520" r="120" fill="#fff" opacity=".06"/><text x="300" y="300" font-size="190" text-anchor="middle">${emoji}</text><text x="300" y="440" font-family="Montserrat,Arial" font-weight="900" font-size="46" fill="#fff" text-anchor="middle">${title}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function seed() {
  const now = Date.now(), h = 3600e3;
  const users = {
    'colam.oficial': { name: 'Colam High School', bio: 'Cuenta oficial de la prepa del Colegio Americano de Saltillo 💙💚🧡', semester: null, official: true },
    'sociedad.alumnos': { name: 'Sociedad de Alumnos', bio: 'Tu voz en la prepa. Eventos, ideas y más.', semester: null, staff: true },
    'colam.deportes': { name: 'Deportes Colam', bio: 'Resultados, entrenamientos y torneos 🏀⚽🏐', semester: null, staff: true },
    'sofi.garza': { name: 'Sofía Garza', bio: 'Club de arte 🎨 | 5° B', semester: 5, group: 'B' },
    'diego.ramz': { name: 'Diego Ramírez', bio: 'Basket 🏀 | 3° A', semester: 3, group: 'A' },
  };
  const P = (user, img, caption, category, hoursAgo, likes = [], comments = []) =>
    ({ id: uid(), user, img, caption, category, ts: now - hoursAgo * h, likes, comments });
  const posts = [
    P('colam.oficial', art('🎉', 'Semana Colam', '#1f2a6e', '#2f3f9e'), '¡Arranca la #SemanaColam! Concursos, música y comida en el patio central toda la semana. ¡No falten! 💙💚🧡', 'Eventos', 2,
      ['sofi.garza', 'diego.ramz', 'sociedad.alumnos'], [{ user: 'diego.ramz', text: '¡Vamos con todo 3° A! 🔥', ts: now - 1.5 * h }]),
    P('colam.deportes', art('🏀', '¡Ganamos!', '#4e9a24', '#1f2a6e'), 'Victoria 58–41 en el torneo intercolegial. Orgullo #ColamHigh 🏆', 'Deportes', 6,
      ['diego.ramz', 'colam.oficial'], [{ user: 'sofi.garza', text: '¡Felicidades equipo! 👏', ts: now - 5 * h }]),
    P('sofi.garza', art('🎨', 'Mural nuevo', '#f08a24', '#c86a12'), 'Terminamos el mural del pasillo de 5° con el club de arte. ¿Qué les parece? #ArteColam', 'Arte', 20, ['colam.oficial']),
    P('sociedad.alumnos', art('🗳️', 'Buzón de ideas', '#2f3f9e', '#6cbf3a'), 'Déjanos en comentarios qué evento quieres para fin de semestre 👇 #VozColam', 'Clubs', 30, [],
      [{ user: 'sofi.garza', text: '¡Noche de talentos!', ts: now - 28 * h }, { user: 'diego.ramz', text: 'Torneo de fut entre grupos ⚽', ts: now - 27 * h }]),
    P('diego.ramz', art('📚', 'Modo examen', '#1f2a6e', '#141c4d'), 'Estudiando para el parcial de cálculo en la biblioteca 😵‍💫 #VidaColam', 'Académico', 44, ['sofi.garza']),
  ];
  const stories = [
    { id: uid(), user: 'colam.oficial', img: art('📣', 'Hoy: honores 7:30', '#1f2a6e', '#f08a24'), ts: now - 1 * h },
    { id: uid(), user: 'colam.deportes', img: art('⚽', 'Entreno 4 pm', '#4e9a24', '#2f3f9e'), ts: now - 3 * h },
    { id: uid(), user: 'sofi.garza', img: art('🖌️', 'En el taller', '#f08a24', '#1f2a6e'), ts: now - 5 * h },
  ];
  const avisos = [
    { id: uid(), type: 'urgente', title: 'Entrega de boletas', text: 'Viernes a las 13:00 en el auditorio. Asisten alumnos con su padre, madre o tutor.', ts: now - 3 * h },
    { id: uid(), type: 'evento', title: 'Semana Colam', text: 'Del lunes al viernes: concursos por grupo, kermés y cierre con concierto. ¡Prepara tu porra!', ts: now - 26 * h },
    { id: uid(), type: 'general', title: 'Uniforme deportivo', text: 'Recuerda portar el uniforme deportivo completo los días de educación física.', ts: now - 72 * h },
  ];
  return { users, posts, stories, avisos, me: null, saved: {}, seenStories: [], lastAvisosSeen: 0 };
}

let db = load();
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* almacenamiento no disponible */ }
  return seed();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); return true; }
  catch { toast('Ya no hay espacio en este dispositivo. Borra algunas publicaciones.'); return false; }
}

const me = () => db.users[db.me];
const userOf = u => db.users[u] || { name: u };

/* ---------- Utilidades de UI ---------- */

function colorFor(u) { let n = 0; for (const c of u) n = (n * 31 + c.charCodeAt(0)) >>> 0; return PALETTE[n % PALETTE.length]; }
function avatarHTML(u, cls = '') {
  const user = userOf(u);
  if (user.avatar) return `<span class="avatar ${cls}" style="background-image:url('${user.avatar}')"></span>`;
  if (user.official) return `<span class="avatar ${cls}" style="background:#f4f3ef url('assets/logo.png') center/cover"></span>`;
  const initials = (user.name || u).split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return `<span class="avatar ${cls}" style="background:${colorFor(u)}">${esc(initials)}</span>`;
}
function badgeHTML(u) {
  const user = userOf(u);
  if (user.official) return '<span class="badge official">OFICIAL</span>';
  if (user.staff) return '<span class="badge">STAFF</span>';
  return '';
}
function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return 'ahora';
  const m = s / 60 | 0; if (m < 60) return `hace ${m} min`;
  const h = m / 60 | 0; if (h < 24) return `hace ${h} h`;
  const d = h / 24 | 0; if (d < 7) return `hace ${d} d`;
  return new Date(ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}
function richText(t) {
  return esc(t).replace(/#([\wáéíóúñÁÉÍÓÚÑ]+)/g, '<a class="tag" href="#" data-tag="$1">#$1</a>')
               .replace(/@([a-z0-9._]+)/g, '<a class="tag" href="#" data-user="$1">@$1</a>');
}
function isClean(t) { const s = t.toLowerCase(); return !BANNED.some(w => s.includes(w)); }

let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

function resizeImage(file, max = 900) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Solo se permiten imágenes'));
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', 0.78));
    };
    img.onerror = () => reject(new Error('No se pudo leer la imagen'));
    img.src = URL.createObjectURL(file);
  });
}

/* ---------- Navegación ---------- */

let route = { name: 'feed' };
function go(name, params = {}) {
  route = { name, ...params };
  document.querySelectorAll('.bottomnav button').forEach(b => {
    const active = b.dataset.nav === name && !(name === 'profile' && params.user && params.user !== db.me);
    b.classList.toggle('active', active);
  });
  render();
  window.scrollTo(0, 0);
}

function render() {
  const view = $('#view');
  const views = { feed: renderFeed, explore: renderExplore, new: renderNew, avisos: renderAvisos, profile: renderProfile, post: renderSinglePost };
  view.innerHTML = '';
  views[route.name](view);
  refreshChrome();
}

function refreshChrome() {
  $('#navAvatar').outerHTML = avatarHTML(db.me, 'nav-avatar').replace('class="avatar nav-avatar"', 'class="nav-avatar" id="navAvatar"');
  $('#avisoDot').hidden = !db.avisos.some(a => a.ts > db.lastAvisosSeen);
}

/* ---------- Feed ---------- */

function activeStories() {
  const fresh = db.stories.filter(s => Date.now() - s.ts < STORY_TTL);
  const byUser = new Map();
  for (const s of fresh.sort((a, b) => a.ts - b.ts)) {
    if (!byUser.has(s.user)) byUser.set(s.user, []);
    byUser.get(s.user).push(s);
  }
  return byUser;
}

function renderFeed(view) {
  const stories = activeStories();
  const mine = stories.get(db.me);
  let html = `<div class="stories">
    <button class="story" data-story="${mine ? esc(db.me) : ''}" data-add-story="${mine ? '' : '1'}">
      <span class="${mine ? 'ring' : 'add'}">${avatarHTML(db.me)}</span><small>Tu historia</small>
    </button>`;
  for (const [u, list] of stories) {
    if (u === db.me) continue;
    const seen = list.every(s => db.seenStories.includes(s.id));
    html += `<button class="story" data-story="${esc(u)}"><span class="ring ${seen ? 'seen' : ''}">${avatarHTML(u)}</span><small>${esc(u)}</small></button>`;
  }
  html += '</div>';
  const posts = [...db.posts].sort((a, b) => b.ts - a.ts);
  html += posts.length ? posts.map(postHTML).join('') : '<p class="empty">Todavía no hay publicaciones. ¡Sé el primero!</p>';
  view.innerHTML = html;
}

function postHTML(p) {
  const liked = p.likes.includes(db.me);
  const saved = !!db.saved[p.id];
  const n = p.likes.length;
  const lastComments = p.comments.slice(-2);
  return `<article class="post" data-id="${p.id}">
    <div class="post-head">
      <button data-user="${esc(p.user)}">${avatarHTML(p.user)}</button>
      <div class="who"><button data-user="${esc(p.user)}"><b>${esc(p.user)}</b></button>${badgeHTML(p.user)}
        <small>${p.category ? `<span class="chip-cat">${esc(p.category)}</span> · ` : ''}${timeAgo(p.ts)}</small></div>
      <button class="more" data-act="menu" aria-label="Opciones">⋯</button>
    </div>
    <div class="post-media" data-act="dbl"><img src="${p.img}" alt="Publicación de ${esc(p.user)}" loading="lazy" draggable="false">${HEART.replace('<svg', '<svg class="burst"')}</div>
    <div class="post-actions">
      <button data-act="like" class="${liked ? 'liked' : ''}" aria-label="Me gusta">${HEART}</button>
      <button data-act="comments" aria-label="Comentar">${ICON_COMMENT}</button>
      <button data-act="share" aria-label="Compartir">${ICON_SHARE}</button>
      <button data-act="save" class="save ${saved ? 'saved' : ''}" aria-label="Guardar">${ICON_SAVE}</button>
    </div>
    <div class="post-body">
      <div class="likes">${n} ${n === 1 ? 'me gusta' : 'me gusta'}</div>
      ${p.caption ? `<p><b>${esc(p.user)}</b> ${richText(p.caption)}</p>` : ''}
      ${p.comments.length > 2 ? `<button class="view-comments" data-act="comments">Ver los ${p.comments.length} comentarios</button>` : ''}
      ${lastComments.map(c => `<p><b>${esc(c.user)}</b> ${richText(c.text)}</p>`).join('')}
    </div>
  </article>`;
}

function renderSinglePost(view) {
  const p = db.posts.find(x => x.id === route.id);
  view.innerHTML = p ? postHTML(p) : '<p class="empty">Esta publicación ya no existe.</p>';
}

function updatePost(id) {
  const el = document.querySelector(`.post[data-id="${id}"]`);
  const p = db.posts.find(x => x.id === id);
  if (el && p) el.outerHTML = postHTML(p);
}

function toggleLike(p, forceOn = false) {
  const i = p.likes.indexOf(db.me);
  if (i >= 0 && !forceOn) p.likes.splice(i, 1);
  else if (i < 0) p.likes.push(db.me);
  save(); updatePost(p.id);
}

function postMenu(p) {
  const own = p.user === db.me;
  const choice = prompt(own ? 'Escribe 1 para BORRAR tu publicación, 2 para editar la descripción.' : 'Escribe 1 para REPORTAR esta publicación a la coordinación.');
  if (choice === '1' && own && confirm('¿Borrar esta publicación?')) {
    db.posts = db.posts.filter(x => x.id !== p.id); delete db.saved[p.id]; save(); render(); toast('Publicación eliminada');
  } else if (choice === '2' && own) {
    const text = prompt('Nueva descripción:', p.caption);
    if (text !== null) {
      if (!isClean(text)) return toast('Cuida tu lenguaje 💙 Respeto ante todo.');
      p.caption = text.trim().slice(0, 500); save(); updatePost(p.id);
    }
  } else if (choice === '1') {
    p.reports = [...new Set([...(p.reports || []), db.me])]; save(); toast('Gracias. Coordinación revisará la publicación.');
  }
}

/* ---------- Comentarios ---------- */

let sheetPost = null;
function openComments(p) {
  sheetPost = p;
  $('#commentAvatar').outerHTML = avatarHTML(db.me, 'sm').replace('class="avatar sm"', 'class="avatar sm" id="commentAvatar"');
  drawComments();
  $('#sheet').hidden = false;
  setTimeout(() => $('#commentForm input').focus(), 250);
}
function drawComments() {
  const p = sheetPost;
  const items = (p.caption ? [{ user: p.user, text: p.caption, ts: p.ts }] : []).concat(p.comments);
  $('#commentList').innerHTML = items.length
    ? items.map(c => `<li>${avatarHTML(c.user, 'sm')}<div><b>${esc(c.user)}</b> ${richText(c.text)}<small>${timeAgo(c.ts)}</small></div></li>`).join('')
    : '<li class="empty">Aún no hay comentarios.</li>';
}
$('#commentForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.text, text = input.value.trim();
  if (!text) return;
  if (!isClean(text)) return toast('Cuida tu lenguaje 💙 Respeto ante todo.');
  sheetPost.comments.push({ user: db.me, text, ts: Date.now() });
  save(); input.value = ''; drawComments(); updatePost(sheetPost.id);
  $('#commentList').scrollTop = 1e6;
});
$('#sheetClose').onclick = () => { $('#sheet').hidden = true; };
$('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') $('#sheet').hidden = true; });

/* ---------- Historias ---------- */

const story = { queue: [], users: [], ui: 0, i: 0, timer: null, start: 0 };
function openStories(startUser) {
  const all = activeStories();
  story.users = [...all.keys()];
  story.ui = Math.max(0, story.users.indexOf(startUser));
  story.i = 0;
  $('#storyViewer').hidden = false;
  showStory();
}
function showStory() {
  const u = story.users[story.ui];
  const list = activeStories().get(u);
  if (!list) return closeStories();
  const s = list[story.i];
  if (!db.seenStories.includes(s.id)) { db.seenStories.push(s.id); save(); }
  $('#storyImg').src = s.img;
  $('#storyUser').textContent = u;
  $('#storyTime').textContent = timeAgo(s.ts);
  $('#storyAvatar').outerHTML = avatarHTML(u, 'sm').replace('class="avatar sm"', 'class="avatar sm" id="storyAvatar"');
  $('#storyBars').innerHTML = list.map((_, k) => `<span><i style="width:${k < story.i ? 100 : 0}%"></i></span>`).join('');
  const bar = $('#storyBars').children[story.i].firstChild;
  cancelAnimationFrame(story.timer);
  story.start = performance.now();
  const tick = t => {
    const k = (t - story.start) / STORY_MS;
    bar.style.width = Math.min(100, k * 100) + '%';
    if (k >= 1) nextStory(); else story.timer = requestAnimationFrame(tick);
  };
  story.timer = requestAnimationFrame(tick);
}
function nextStory() {
  const len = activeStories().get(story.users[story.ui]).length;
  if (story.i < len - 1) story.i++;
  else if (story.ui < story.users.length - 1) { story.ui++; story.i = 0; }
  else return closeStories();
  showStory();
}
function prevStory() {
  if (story.i > 0) story.i--;
  else if (story.ui > 0) { story.ui--; story.i = activeStories().get(story.users[story.ui]).length - 1; }
  showStory();
}
function closeStories() {
  cancelAnimationFrame(story.timer);
  $('#storyViewer').hidden = true;
  if (route.name === 'feed') render();
}
$('#storyNext').onclick = nextStory;
$('#storyPrev').onclick = prevStory;
$('#storyClose').onclick = closeStories;
document.addEventListener('keydown', e => {
  if ($('#storyViewer').hidden) return;
  if (e.key === 'ArrowRight') nextStory();
  if (e.key === 'ArrowLeft') prevStory();
  if (e.key === 'Escape') closeStories();
});

/* ---------- Explorar ---------- */

let exploreCat = 'Todo', exploreQuery = '';
function renderExplore(view) {
  view.innerHTML = `<div class="search"><input type="search" id="q" placeholder="Buscar alumnos o #hashtags" value="${esc(exploreQuery)}"></div>
    <div class="chips">${CATEGORIES.map(c => `<button data-cat="${c}" class="${c === exploreCat ? 'on' : ''}">${c}</button>`).join('')}</div>
    <div id="results"></div>`;
  const q = $('#q');
  q.addEventListener('input', () => { exploreQuery = q.value; drawResults(); });
  drawResults();
}
function drawResults() {
  const box = $('#results');
  const q = exploreQuery.trim().toLowerCase();
  let html = '';
  if (q && !q.startsWith('#')) {
    const users = Object.entries(db.users).filter(([u, x]) => u.includes(q) || (x.name || '').toLowerCase().includes(q));
    html += users.map(([u, x]) => `<button class="user-row" data-user="${esc(u)}">${avatarHTML(u)}<div><b>${esc(u)}</b>${badgeHTML(u)}
      <small>${esc(x.name)}${x.semester ? ` · ${x.semester}° ${esc(x.group || '')}` : ''}</small></div></button>`).join('');
  }
  let posts = [...db.posts].sort((a, b) => b.likes.length - a.likes.length || b.ts - a.ts);
  if (exploreCat !== 'Todo') posts = posts.filter(p => p.category === exploreCat);
  if (q.startsWith('#')) posts = posts.filter(p => (p.caption || '').toLowerCase().includes(q));
  html += posts.length ? `<div class="grid">${posts.map(p => `<button data-open="${p.id}"><img src="${p.img}" alt="" loading="lazy"></button>`).join('')}</div>`
    : (html ? '' : '<p class="empty">Nada por aquí todavía.</p>');
  box.innerHTML = html;
}

/* ---------- Nueva publicación / historia ---------- */

let draft = { kind: 'post', img: null };
function renderNew(view) {
  view.innerHTML = `<form class="composer" id="composer">
    <h2>Crear</h2>
    <div class="toggle"><button type="button" data-kind="post" class="${draft.kind === 'post' ? 'on' : ''}">Publicación</button>
      <button type="button" data-kind="story" class="${draft.kind === 'story' ? 'on' : ''}">Historia</button></div>
    <label class="drop">${draft.img ? `<img src="${draft.img}" alt="Vista previa">` : `<div><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg><p>Toca para elegir una foto</p></div>`}
      <input type="file" accept="image/*" id="file"></label>
    ${draft.kind === 'post' ? `<textarea name="caption" maxlength="500" placeholder="Escribe una descripción… usa #hashtags y @menciones"></textarea>
      <label>Categoría <select name="category">${CATEGORIES.slice(1).map(c => `<option>${c}</option>`).join('')}</select></label>` : '<p class="rules">Tu historia desaparece en 24 horas.</p>'}
    <p class="rules">Recuerda los valores Colam: <b>honestidad, compromiso, respeto y responsabilidad</b>. No publiques fotos de otras personas sin su permiso.</p>
    <button class="btn green" ${draft.img ? '' : 'disabled'}>${draft.kind === 'post' ? 'Compartir' : 'Subir historia'}</button>
  </form>`;
  $('#file').addEventListener('change', async e => {
    const f = e.target.files[0]; if (!f) return;
    try { draft.img = await resizeImage(f); renderNew(view); }
    catch (err) { toast(err.message); }
  });
  view.querySelectorAll('[data-kind]').forEach(b => b.onclick = () => { draft.kind = b.dataset.kind; renderNew(view); });
  $('#composer').addEventListener('submit', e => {
    e.preventDefault();
    if (!draft.img) return;
    if (draft.kind === 'story') {
      db.stories.push({ id: uid(), user: db.me, img: draft.img, ts: Date.now() });
      if (!save()) { db.stories.pop(); return; }
      toast('¡Historia publicada!');
    } else {
      const caption = e.target.caption.value.trim();
      if (!isClean(caption)) return toast('Cuida tu lenguaje 💙 Respeto ante todo.');
      db.posts.push({ id: uid(), user: db.me, img: draft.img, caption, category: e.target.category.value, ts: Date.now(), likes: [], comments: [] });
      if (!save()) { db.posts.pop(); return; }
      toast('¡Publicado!');
    }
    draft = { kind: 'post', img: null };
    go('feed');
  });
}

/* ---------- Avisos ---------- */

function renderAvisos(view) {
  const labels = { urgente: 'Importante', evento: 'Evento', general: 'Aviso' };
  const avisos = [...db.avisos].sort((a, b) => b.ts - a.ts);
  const activity = [];
  for (const p of db.posts.filter(p => p.user === db.me)) {
    for (const u of p.likes) if (u !== db.me) activity.push({ p, html: `<b>${esc(u)}</b> le dio me gusta a tu publicación.`, u, ts: p.ts });
    for (const c of p.comments) if (c.user !== db.me) activity.push({ p, html: `<b>${esc(c.user)}</b> comentó: ${esc(c.text)}`, u: c.user, ts: c.ts });
  }
  activity.sort((a, b) => b.ts - a.ts);
  view.innerHTML = `<div class="avisos">
    <h2 class="section-title">Avisos de la prepa</h2>
    ${me().official || me().staff ? `<form id="avisoForm" class="aviso"><input name="title" placeholder="Título del aviso" required style="width:100%;padding:8px;margin-bottom:6px">
      <textarea name="text" placeholder="Mensaje" required style="width:100%;padding:8px"></textarea>
      <select name="type"><option value="general">Aviso</option><option value="evento">Evento</option><option value="urgente">Importante</option></select>
      <button class="btn primary" style="margin-top:6px">Publicar aviso</button></form>` : ''}
    ${avisos.map(a => `<div class="aviso ${a.type}"><small>${labels[a.type]} · ${timeAgo(a.ts)}</small><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div>`).join('')}
    <h2 class="section-title" style="margin-top:10px">Tu actividad</h2>
    ${activity.length ? activity.slice(0, 30).map(a => `<button class="activity" data-open="${a.p.id}">${avatarHTML(a.u, 'sm')}<span style="text-align:left">${a.html}</span><img src="${a.p.img}" alt=""></button>`).join('')
      : '<p class="empty">Cuando alguien reaccione a tus publicaciones lo verás aquí.</p>'}
  </div>`;
  const f = $('#avisoForm');
  if (f) f.addEventListener('submit', e => {
    e.preventDefault();
    db.avisos.push({ id: uid(), type: f.type.value, title: f.title.value.trim(), text: f.text.value.trim(), ts: Date.now() });
    save(); render(); toast('Aviso publicado');
  });
  db.lastAvisosSeen = Date.now(); save();
}

/* ---------- Perfil ---------- */

let profileTab = 'posts', editing = false;
function renderProfile(view) {
  const u = route.user || db.me;
  const user = userOf(u);
  const own = u === db.me;
  const posts = db.posts.filter(p => p.user === u).sort((a, b) => b.ts - a.ts);
  const likes = posts.reduce((n, p) => n + p.likes.length, 0);
  const shown = own && profileTab === 'saved' ? db.posts.filter(p => db.saved[p.id]) : posts;
  view.innerHTML = `<div class="profile">
    <div class="profile-top">${avatarHTML(u, 'lg')}
      <div class="stats"><div><b>${posts.length}</b><small>publicaciones</small></div><div><b>${likes}</b><small>me gusta</small></div>
        <div><b>${user.semester ? user.semester + '°' : '★'}</b><small>${user.semester ? 'semestre' : 'Colam'}</small></div></div></div>
    <div class="profile-info"><b>${esc(user.name)}</b>${badgeHTML(u)}<br>
      ${user.semester ? `<span class="grade">Prepa · ${user.semester}° semestre · Grupo ${esc(user.group || '')}</span><br>` : ''}
      ${esc(user.bio || '')}</div>
    ${own ? (editing ? `<form class="edit-form" id="editForm">
        <label class="btn ghost" style="text-align:center">Cambiar foto de perfil<input type="file" accept="image/*" id="avatarFile" hidden></label>
        <input name="name" value="${esc(user.name)}" maxlength="40" required>
        <textarea name="bio" maxlength="150" placeholder="Tu biografía">${esc(user.bio || '')}</textarea>
        <div class="profile-btns"><button type="button" class="btn" id="cancelEdit">Cancelar</button><button class="btn primary" style="background:var(--navy)">Guardar</button></div>
      </form>` : `<div class="profile-btns"><button class="btn" id="editBtn">Editar perfil</button><button class="btn" id="logoutBtn">Cerrar sesión</button></div>`) : ''}
    ${own ? `<div class="tabs"><button data-tab="posts" class="${profileTab === 'posts' ? 'on' : ''}" aria-label="Publicaciones">${ICON_GRID}</button>
      <button data-tab="saved" class="${profileTab === 'saved' ? 'on' : ''}" aria-label="Guardados">${ICON_SAVE}</button></div>` : '<div class="tabs"></div>'}
  </div>
  ${shown.length ? `<div class="grid">${shown.map(p => `<button data-open="${p.id}"><img src="${p.img}" alt="" loading="lazy"></button>`).join('')}</div>`
    : `<p class="empty">${profileTab === 'saved' && own ? 'Aún no guardas publicaciones.' : 'Sin publicaciones todavía.'}</p>`}`;

  if (!own) return;
  view.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { profileTab = b.dataset.tab; render(); });
  if (editing) {
    $('#cancelEdit').onclick = () => { editing = false; render(); };
    $('#avatarFile').addEventListener('change', async e => {
      const f = e.target.files[0]; if (!f) return;
      try { me().avatar = await resizeImage(f, 300); save(); render(); } catch (err) { toast(err.message); }
    });
    $('#editForm').addEventListener('submit', e => {
      e.preventDefault();
      const bio = e.target.bio.value.trim();
      if (!isClean(bio + ' ' + e.target.name.value)) return toast('Cuida tu lenguaje 💙 Respeto ante todo.');
      me().name = e.target.name.value.trim(); me().bio = bio; editing = false; save(); render();
    });
  } else {
    $('#editBtn').onclick = () => { editing = true; render(); };
    $('#logoutBtn').onclick = () => { if (confirm('¿Cerrar sesión?')) logout(); };
  }
}

/* ---------- Eventos globales ---------- */

let lastTap = 0;
document.addEventListener('click', e => {
  const t = e.target.closest('[data-nav],[data-user],[data-tag],[data-open],[data-story],[data-add-story],[data-cat],[data-act]');
  if (!t) return;
  if (t.dataset.nav) return go(t.dataset.nav);
  if (t.dataset.user) { e.preventDefault(); editing = false; profileTab = 'posts'; return go('profile', { user: t.dataset.user }); }
  if (t.dataset.tag) { e.preventDefault(); exploreQuery = '#' + t.dataset.tag; exploreCat = 'Todo'; return go('explore'); }
  if (t.dataset.open) return go('post', { id: t.dataset.open });
  if (t.dataset.addStory) { draft = { kind: 'story', img: null }; return go('new'); }
  if (t.dataset.story) return openStories(t.dataset.story);
  if (t.dataset.cat) { exploreCat = t.dataset.cat; document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b === t)); return drawResults(); }

  const postEl = t.closest('.post');
  const p = postEl && db.posts.find(x => x.id === postEl.dataset.id);
  if (!p) return;
  switch (t.dataset.act) {
    case 'like': return toggleLike(p);
    case 'comments': return openComments(p);
    case 'save': db.saved[p.id] ? delete db.saved[p.id] : (db.saved[p.id] = true); save(); updatePost(p.id);
      return toast(db.saved[p.id] ? 'Guardado en tu perfil' : 'Eliminado de guardados');
    case 'share': return sharePost(p);
    case 'menu': return postMenu(p);
    case 'dbl': {
      const now = Date.now();
      if (now - lastTap < 320) {
        const burst = t.querySelector('.burst'); burst.classList.remove('go'); void burst.offsetWidth; burst.classList.add('go');
        if (!p.likes.includes(db.me)) setTimeout(() => toggleLike(p, true), 650);
      }
      lastTap = now;
    }
  }
});

async function sharePost(p) {
  const text = `${p.user} en Colamgram: ${p.caption || ''}`;
  try {
    if (navigator.share) await navigator.share({ title: 'Colamgram', text });
    else { await navigator.clipboard.writeText(text); toast('Copiado al portapapeles'); }
  } catch { /* el usuario canceló */ }
}

/* ---------- Acceso con correo de la escuela ---------- */

const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const EMAIL_KEY = 'colamgram.emailForSignIn';
let pendingEmail = null;
let firebase = null;

function isSchoolEmail(email) {
  return /^[^\s@]+@[^\s@]+$/.test(email) && SCHOOL_DOMAINS.some(d => email.endsWith('@' + d.toLowerCase()));
}

async function loadFirebase() {
  if (!FIREBASE_CONFIG) return null;
  if (!firebase) {
    const [{ initializeApp }, m] = await Promise.all([
      import(FIREBASE_SDK + 'firebase-app.js'),
      import(FIREBASE_SDK + 'firebase-auth.js'),
    ]);
    firebase = { auth: m.getAuth(initializeApp(FIREBASE_CONFIG)), m };
    firebase.auth.languageCode = 'es';
  }
  return firebase;
}

function showAuthStep(step) {
  $('#emailForm').hidden = step !== 'email';
  $('#linkSent').hidden = step !== 'sent';
  $('#authForm').hidden = step !== 'profile';
}

// Ya se comprobó que el correo es de la escuela: entra, o crea su perfil la primera vez.
function onEmailVerified(email) {
  const username = Object.keys(db.users).find(u => db.users[u].email === email);
  if (username) { db.me = username; save(); return start(); }
  pendingEmail = email;
  $('#verifiedEmail').textContent = email;
  const f = $('#authForm');
  if (!f.username.value) f.username.value = email.split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 20);
  showAuthStep('profile');
}

$('#emailInput').placeholder = 'tu.nombre@' + SCHOOL_DOMAINS[0];
$('#demoNote').hidden = !!FIREBASE_CONFIG;

$('#emailForm').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#emailError'), btn = e.target.querySelector('button');
  const email = e.target.email.value.trim().toLowerCase();
  err.textContent = '';
  if (!isSchoolEmail(email)) return void (err.textContent = `Usa tu correo de la escuela (@${SCHOOL_DOMAINS.join(', @')}).`);
  if (!FIREBASE_CONFIG) return onEmailVerified(email);
  btn.disabled = true;
  try {
    const { auth, m } = await loadFirebase();
    await m.sendSignInLinkToEmail(auth, email, { url: location.href.split(/[?#]/)[0], handleCodeInApp: true });
    try { localStorage.setItem(EMAIL_KEY, email); } catch { /* sin almacenamiento */ }
    $('#sentTo').textContent = email;
    showAuthStep('sent');
  } catch {
    err.textContent = 'No se pudo enviar el enlace. Revisa tu conexión e inténtalo de nuevo.';
  } finally {
    btn.disabled = false;
  }
});

$('#changeEmail').onclick = () => showAuthStep('email');

$('#authForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, err = $('#authError');
  const username = f.username.value.trim().toLowerCase();
  if (!pendingEmail) return showAuthStep('email');
  if (!/^[a-z0-9._]{3,20}$/.test(username)) return void (err.textContent = 'Usuario inválido: usa minúsculas, números, punto o guion bajo.');
  if (!isClean(username + ' ' + f.name.value)) return void (err.textContent = 'Elige un nombre de usuario respetuoso.');
  if (db.users[username]) return void (err.textContent = 'Ese usuario ya está ocupado, elige otro.');
  db.users[username] = { email: pendingEmail, name: f.name.value.trim(), semester: +f.semester.value, group: f.group.value, bio: '' };
  db.me = username;
  pendingEmail = null;
  save();
  start();
});

// Si el alumno llega desde el enlace del correo, termina el inicio de sesión.
async function completeEmailLink() {
  const fb = await loadFirebase().catch(() => null);
  if (!fb || !fb.m.isSignInWithEmailLink(fb.auth, location.href)) return false;
  let email = null;
  try { email = localStorage.getItem(EMAIL_KEY); } catch { /* sin almacenamiento */ }
  email = (email || prompt('Confirma tu correo de la escuela:') || '').trim().toLowerCase();
  try {
    if (!isSchoolEmail(email)) throw new Error('dominio');
    await fb.m.signInWithEmailLink(fb.auth, email, location.href);
    try { localStorage.removeItem(EMAIL_KEY); } catch { /* sin almacenamiento */ }
    history.replaceState(null, '', location.pathname);
    onEmailVerified(email);
    return true;
  } catch {
    history.replaceState(null, '', location.pathname);
    $('#emailError').textContent = 'El enlace no es válido o ya expiró. Pide uno nuevo.';
    return false;
  }
}

async function logout() {
  db.me = null;
  save();
  const fb = await loadFirebase().catch(() => null);
  if (fb) await fb.m.signOut(fb.auth).catch(() => {});
  showAuthStep('email');
  start();
}

function start() {
  const logged = db.me && db.users[db.me];
  $('#auth').hidden = !!logged;
  $('#app').hidden = !logged;
  if (logged) go('feed');
}

showAuthStep('email');
start();
if (!db.me) completeEmailLink();
