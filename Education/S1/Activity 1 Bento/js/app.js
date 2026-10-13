const $ = s => document.querySelector(s);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Header */
const hr = new Date().getHours();
$('#greeting').textContent = (hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening');
$('#today').textContent = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' });

/* Timer */
const MODES = { focus: 25, short: 5, long: 15 };
let mode = 'focus', total = 25 * 60, left = total, tick = null, endAt = 0;
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function drawTimer() {
  $('#clock').textContent = fmt(left);
  $('#bar').style.width = ((total - left) / total * 100) + '%';
  document.title = (tick ? fmt(left) + ' · ' : '') + 'Focus sa Goal';
}
function stop() { clearInterval(tick); tick = null; $('#start').textContent = left < total && left > 0 ? 'Resume' : 'Start'; }
function setMode(m) {
  stop(); mode = m; total = left = MODES[m] * 60;
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === m));
  $('#start').textContent = 'Start'; drawTimer();
}
function finish() {
  stop(); left = 0; drawTimer();
  alert(mode === 'focus' ? 'Focus session done. Take a break.' : 'Break over. Ready to focus?');
  setMode(mode === 'focus' ? 'short' : 'focus');
}
$('#start').addEventListener('click', () => {
  if (tick) { stop(); return; }
  endAt = Date.now() + left * 1000;
  $('#start').textContent = 'Pause';
  tick = setInterval(() => {
    left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    drawTimer(); if (left === 0) finish();
  }, 250);
});
$('#reset').addEventListener('click', () => setMode(mode));
document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

/* To-do */
let todos = load('fh-todos', []);
function drawTodos() {
  $('#todo-list').innerHTML = todos.length ? todos.map((t, i) =>
    `<li class="${t.d ? 'done' : ''}"><input type="checkbox" data-t="${i}" ${t.d ? 'checked' : ''} aria-label="Done: ${esc(t.t)}" style="flex:0 0 auto;accent-color:#8fd4b4"><span class="txt">${esc(t.t)}</span><button class="icon" data-del="${i}" aria-label="Delete task">✕</button></li>`
  ).join('') : '<li class="empty">No tasks yet. Add your first one above.</li>';
}
$('#todo-form').addEventListener('submit', e => { e.preventDefault(); const v = $('#todo-in').value.trim(); if (!v) return; todos.push({ t: v, d: false }); save('fh-todos', todos); $('#todo-in').value = ''; drawTodos(); });
$('#todo-list').addEventListener('click', e => {
  if (e.target.dataset.t !== undefined) todos[e.target.dataset.t].d = e.target.checked;
  else if (e.target.dataset.del !== undefined) todos.splice(e.target.dataset.del, 1);
  else return;
  save('fh-todos', todos); drawTodos();
});

/* Goals (same pattern as the to-do list) */
let goals = load('fh-goals', []).map(g => ({ t: g.t, d: !!g.d }));
function drawGoals() {
  $('#goal-list').innerHTML = goals.length ? goals.map((g, i) =>
    `<li class="${g.d ? 'done' : ''}"><input type="checkbox" data-g="${i}" ${g.d ? 'checked' : ''} aria-label="Done: ${esc(g.t)}" style="flex:0 0 auto;accent-color:#8fd4b4"><span class="txt">${esc(g.t)}</span><button class="icon" data-gdel="${i}" aria-label="Delete goal">✕</button></li>`
  ).join('') : '<li class="empty">Set a goal for this week.</li>';
}
$('#goal-form').addEventListener('submit', e => { e.preventDefault(); const v = $('#goal-in').value.trim(); if (!v) return; goals.push({ t: v, d: false }); save('fh-goals', goals); $('#goal-in').value = ''; drawGoals(); });
$('#goal-list').addEventListener('click', e => {
  if (e.target.dataset.g !== undefined) goals[e.target.dataset.g].d = e.target.checked;
  else if (e.target.dataset.gdel !== undefined) goals.splice(e.target.dataset.gdel, 1);
  else return;
  save('fh-goals', goals); drawGoals();
});

/* Music */
const savedMusic = load('fh-music', null);
if (savedMusic) $('#player').src = savedMusic;
$('#music-form').addEventListener('submit', e => {
  e.preventDefault();
  const m = $('#music-in').value.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track)\/([A-Za-z0-9]+)/);
  if (!m) { alert('Paste a Spotify playlist, album, or track link.'); return; }
  const src = `https://open.spotify.com/embed/${m[1]}/${m[2]}`;
  $('#player').src = src; save('fh-music', src); $('#music-in').value = '';
});

/* Right now: clock + a quote you type yourself */
function drawNow() {
  $('#now-time').textContent = new Date().toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
}
function drawQuote() {
  const q = load('fh-quote', '');
  $('#quote').textContent = q || 'No quote yet. Type one below.';
  $('#quote').classList.toggle('muted', !q);
}
$('#quote-form').addEventListener('submit', e => {
  e.preventDefault(); const v = $('#quote-in').value.trim(); if (!v) return;
  save('fh-quote', v); $('#quote-in').value = ''; drawQuote();
});
drawNow(); drawQuote(); setInterval(drawNow, 15000);

drawTimer(); drawTodos(); drawGoals();
