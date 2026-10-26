'use strict';
/* =========================================================
   Reels 教學短影音工作室 — 互動邏輯
   - specs：提示詞欄位與選項（可自行增減）
   - specGroups：欄位在組合器中的分組
   - settingDefs：顯示與操作設定
   ========================================================= */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const root = document.documentElement;

/* ---------- 分類配色（依 examples.json 中分類出現順序） ---------- */
const palettes = [
  ['#3b5bfd', '#14237a'], ['#7b4dff', '#2c1a80'], ['#00a6a6', '#0b3d5c'], ['#ff4f2e', '#8a1238'], ['#c9822e', '#5a2a12'],
  ['#2fa36b', '#0d4a3a'], ['#ff5f8f', '#8b1a5a'], ['#f0a020', '#b5480e'], ['#557089', '#1b2733'], ['#d94bd0', '#4a1f8a']
];
const iconIds = ['atom', 'sigma', 'cpu', 'globe', 'landmark', 'leaf', 'heart-pulse', 'book-open', 'shield', 'palette'];
const icon = (id, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

/* ---------- 提示詞欄位 [key, 中文, English, 選項] ---------- */
const specs = [
  ['style', '畫面風格', 'Visual style', ['科技資訊圖表', '電影寫實', '3D 卡通動畫', '新聞播報', '日系動漫', '手繪白板', '紀錄片', '動態資訊卡', '極簡設計', '微電影', '復古底片', '水彩插畫', '黏土動畫', '賽博龐克', '商業廣告', 'Vlog']],
  ['mood', '呈現氛圍', 'Mood', ['專業有趣', '好奇探索', '震撼驚奇', '緊張懸疑', '清新活力', '理性思辨', '溫馨鼓勵', '熱血勵志', '輕鬆幽默', '寧靜療癒']],
  ['ratio', '畫面比例', 'Aspect ratio', ['9:16（1080×1920）', '4:5（1080×1350）', '1:1（1080×1080）', '16:9（1920×1080）']],
  ['music', '配樂音效', 'Music', ['輕快電子音樂', 'Lo-fi', '史詩電影配樂', '鋼琴抒情', '新聞警示音', '科技合成器', '木吉他', '自然環境音', '古典音樂', '無配樂']],
  ['voice', '旁白語音', 'Narration', ['親切教師', '專業新聞主播', '活潑青年', '沉穩男聲', '溫柔女聲', '紀錄片旁白', '無旁白']],
  ['pace', '影片節奏', 'Pacing', ['中速流暢', '快節奏', '慢節奏', '音樂踩點', '情緒遞進', '前快後慢']],
  ['camera', '鏡頭語言', 'Camera', ['推近與特寫', '電影式多角度', '環繞運鏡', '第一人稱 POV', '俯瞰空拍', '動態縮放', '固定鏡頭']],
  ['lighting', '光線效果', 'Lighting', ['柔和自然光', '電影側光', '晨曦柔光', '霓虹光', '高對比舞台光', '黃金時刻']],
  ['color', '色彩風格', 'Color', ['高彩度明亮', '科技藍紫', '藍橘電影色調', '清新粉彩', '自然色彩', '黑金高級', '復古暖色']],
  ['subtitle', '字幕形式', 'Subtitles', ['繁體中文逐字字幕', '繁體中文關鍵字動態字幕', '繁英雙語字幕', '新聞資訊卡片', '無字幕']],
  ['structure', '敘事結構', 'Narrative', ['問題→解答→總結', '迷思→證據→澄清', '懸念→線索→揭曉', '情境→衝突→解法', '現象→原理→應用', '數據→分析→結論', '步驟→演示→回顧']],
  ['length', '影片長度', 'Duration', ['30 秒', '45 秒', '60 秒', '90 秒', '15 秒', '120 秒', '180 秒']],
  ['hook', '開場鉤子', 'Hook', ['震撼事實', '反問句', '迷思挑戰', '懸疑問題', '直接展示結果', '數字衝擊']],
  ['ending', '結尾行動', 'Ending', ['重點總結＋思考提問', '引導留言', '邀請收藏', '預告下一集', '引導追蹤', '自然結束']],
  ['character', '人物主體', 'Subject', ['無人物，以圖解為主', '真人教師', '虛擬主持人', '3D 動畫角色', '數位代言人', '實物特寫']],
  ['transition', '轉場效果', 'Transitions', ['柔和淡入淡出', '直接切換', '滑動轉場', '縮放轉場', '匹配剪接', '故障特效']],
  ['animation', '動畫方式', 'Animation', ['資訊圖表動畫', '角色動畫', '手繪動畫', '數據視覺化', '物件運動', '關鍵字動畫']],
  ['shotCount', '分鏡數量', 'Shot count', ['6 鏡', '4 鏡', '8 鏡', '10 鏡', '12 鏡']],
  ['language', '影片語言', 'Language', ['繁體中文（台灣）', '繁體中文＋英文術語', '英文', '繁英雙語']],
  ['output', '輸出格式', 'Output', ['MP4 / 1080p / 30fps', 'MP4 / 4K / 30fps', 'MP4 / 1080p / 60fps', '分段素材＋剪輯清單']]
];
const specGroups = [
  ['敘事節奏', 'table', ['structure', 'hook', 'ending', 'pace', 'length', 'shotCount']],
  ['視覺畫面', 'palette', ['style', 'mood', 'color', 'lighting', 'camera', 'character', 'animation', 'transition']],
  ['聲音字幕', 'msg', ['music', 'voice', 'subtitle', 'language']],
  ['輸出規格', 'download', ['ratio', 'output']]
];
// 「隨機搭配風格」只動這些欄位，不影響片長與結構
const shuffleKeys = ['style', 'mood', 'color', 'lighting', 'camera', 'music', 'transition', 'animation'];
const specLabel = Object.fromEntries(specs.map(s => [s[0], s[1]]));
const defaults = Object.fromEntries(specs.map(s => [s[0], s[3][0]]));
const DEFAULT_TOPIC = '絕對零度為什麼是 -273.15°C？', DEFAULT_AUDIENCE = '高中學生與一般觀眾';

/* ---------- 設定 ---------- */
const settingDefs = [
  ['theme', '色系', 'Theme', ['跟隨系統', '亮色', '暗色']],
  ['font', '字體', 'Font size', ['縮小', '標準', '放大']],
  ['sound', '音效', 'Sound', ['開啟', '關閉']],
  ['uiLanguage', '介面語言', 'Language', ['繁體中文', '英文']],
  ['device', '裝置模擬', 'Device', ['自動', '手機', '平板', '電腦']],
  ['layout', '版面模擬', 'Layout', ['自動', '直式', '橫式']],
  ['fullscreen', '全螢幕', 'Fullscreen', ['關閉', '開啟']]
];
const settingDefaults = { fullscreen: '關閉', sound: '開啟', device: '自動', layout: '自動', uiLanguage: '繁體中文', font: '標準', theme: '跟隨系統' };

const safelyRead = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback } catch { return fallback } };
const safelyWrite = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { } };
let settings = { ...settingDefaults, ...safelyRead('reels-settings', {}) };
let favorites = new Set(safelyRead('reels-favorites', []));
let examples = [], categoryColor = {}, categoryIcon = {};
let query = '', category = '全部', onlyFavorites = false, page = 1, sort = 'id', selected = null, appliedId = null;
let deferredInstall = null, audioContext, lastFocus = null;
const PAGE_SIZE = 12;

/* ---------- 介面雙語 ---------- */
const dict = {
  navExamples: ['範例庫', 'Examples'], navStudio: ['提示詞組合器', 'Prompt builder'], navGuide: ['製作檢核', 'Checklist'],
  heroEyebrow: ['高中教學 · 科普解說 · 國際新聞', 'Teaching · Science · Global news'],
  heroTitle: ['讓每一堂課，<br>都能變成<em>精彩短影音</em>', 'Turn every lesson<br>into an <em>engaging Reel</em>'],
  heroDesc: ['100 個靈感範例、20 個製作參數。挑一個題目、調整風格與節奏，就能得到可直接貼給 AI 影片工具的完整提示詞與分鏡表。', '100 curated ideas and 20 production parameters. Pick a topic, tune the style and pacing, and get a complete prompt and storyboard for any AI video tool.'],
  ctaStudio: ['開始製作提示詞', 'Build a prompt'], ctaBrowse: ['瀏覽 100 個範例', 'Browse 100 ideas'],
  statExamples: ['精選範例', 'Ideas'], statCategories: ['主題分類', 'Categories'], statParams: ['製作參數', 'Parameters'],
  flow: ['七步驟影片製作流程', '7-step video workflow'], examples: ['100 個教學短影音範例', '100 educational video ideas'],
  studioTitle: ['AI 影片提示詞組合器', 'AI video prompt builder'], guide: ['短影音製作檢核表', 'Short-video checklist'],
  settings: ['顯示與操作設定', 'Display & controls']
};

/* ---------- 小工具 ---------- */
function escapeHTML(t) { return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }
function highlight(text) {
  const safe = escapeHTML(text);
  if (!query) return safe;
  const q = escapeHTML(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`);
}
function beep(freq = 720) {
  if (settings.sound !== '開啟') return;
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    const o = audioContext.createOscillator(), g = audioContext.createGain(), t = audioContext.currentTime;
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(.025, t); g.gain.exponentialRampToValueAtTime(.001, t + .09);
    o.connect(g); g.connect(audioContext.destination); o.start(); o.stop(t + .09);
  } catch { }
}
let toastTimer;
function toast(message, ok = true) {
  const el = $('#toast');
  el.innerHTML = (ok ? icon('check') : '') + `<span>${escapeHTML(message)}</span>`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
  beep();
}
const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const colorVars = cat => { const [a, b] = categoryColor[cat] || palettes[0]; return `--c1:${a};--c2:${b}` };

/* ---------- 設定 ---------- */
function resolvedTheme() {
  if (settings.theme === '暗色') return 'dark';
  if (settings.theme === '亮色') return 'light';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applySettings() {
  root.classList.remove('device-phone', 'device-tablet', 'device-desktop', 'layout-portrait', 'layout-landscape', 'font-small', 'font-large');
  const d = { '手機': 'phone', '平板': 'tablet', '電腦': 'desktop' }[settings.device];
  if (d) root.classList.add('device-' + d);
  if (settings.layout === '直式') root.classList.add('layout-portrait');
  if (settings.layout === '橫式') root.classList.add('layout-landscape');
  if (settings.font === '縮小') root.classList.add('font-small');
  if (settings.font === '放大') root.classList.add('font-large');
  const theme = resolvedTheme();
  root.dataset.theme = theme;
  $('#themeToggle use').setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  $$('meta[name="theme-color"]').forEach(m => m.content = theme === 'dark' ? '#111114' : '#f7f5f0');
  const en = settings.uiLanguage === '英文';
  root.lang = en ? 'en' : 'zh-Hant';
  for (const el of $$('[data-i18n]')) { const v = dict[el.dataset.i18n]; if (v) el.innerHTML = v[en ? 1 : 0] }
  safelyWrite('reels-settings', settings);
}
function renderSettings() {
  $('#settingsFields').innerHTML = settingDefs.map(([k, label, en, opts]) => `
    <div class="setting-row" role="group" aria-label="${label}">
      <span class="lbl">${label}<small>${en}</small></span>
      <div class="seg">${opts.map(o => `<button type="button" data-setting="${k}" data-value="${o}" aria-pressed="${settings[k] === o}">${o}</button>`).join('')}</div>
    </div>`).join('');
}
async function changeSetting(k, v) {
  settings[k] = v;
  if (k === 'fullscreen') {
    try {
      if (v === '開啟' && !document.fullscreenElement) await root.requestFullscreen();
      else if (v === '關閉' && document.fullscreenElement) await document.exitFullscreen();
    } catch { settings.fullscreen = '關閉'; toast('瀏覽器不允許進入全螢幕', false) }
  }
  applySettings(); renderSettings(); beep();
  $(`[data-setting="${k}"][data-value="${settings[k]}"]`)?.focus();
}

/* ---------- 視窗（Modal） ---------- */
function openModal(id) {
  lastFocus = document.activeElement;
  const m = $(id); m.hidden = false; document.body.style.overflow = 'hidden';
  m.querySelector('[data-close]')?.focus();
}
function closeModal(id) {
  $(id).hidden = true;
  if ($$('.modal-backdrop').every(m => m.hidden)) document.body.style.overflow = '';
  lastFocus?.focus?.();
}
function trapFocus(e) {
  const m = $$('.modal-backdrop').find(x => !x.hidden); if (!m || e.key !== 'Tab') return;
  const f = [...m.querySelectorAll('button:not(:disabled),[href],input,select,textarea')].filter(x => x.offsetParent);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

/* ---------- 流程 ---------- */
function renderFlow() {
  const stages = [['主題輸入', '本站完成'], ['參數選擇', '本站完成'], ['提示詞＋分鏡', '本站完成'], ['AI 腳本', 'AI 工具'], ['影片生成', 'AI 工具'], ['配音字幕', '剪輯軟體'], ['影片輸出', '剪輯軟體']];
  $('#flowSteps').innerHTML = stages.map(([l, who], i) => `<li class="flow-step ${i < 3 ? 'here' : ''}"><span class="step-dot">${i + 1}</span><b>${l}</b><small>${who}</small></li>`).join('');
}

/* ---------- 範例瀏覽 ---------- */
function filtered() {
  const s = query.toLocaleLowerCase();
  let out = examples.filter(x =>
    (category === '全部' || x.category === category) &&
    (!onlyFavorites || favorites.has(x.id)) &&
    (!s || [x.title, x.category, x.style, x.mood, x.summary, x.structure, x.hook, ...x.tags].join(' ').toLocaleLowerCase().includes(s)));
  if (sort === 'title') out.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'));
  if (sort === 'duration') out.sort((a, b) => a.duration - b.duration || a.id - b.id);
  return out;
}
function renderCategories() {
  const cats = ['全部', ...Object.keys(categoryColor)];
  $('#categories').innerHTML = cats.map(c => {
    const n = c === '全部' ? examples.length : examples.filter(x => x.category === c).length;
    const sw = c === '全部' ? '' : `<span class="swatch" style="${colorVars(c)}"></span>`;
    return `<button class="category" data-category="${escapeHTML(c)}" aria-pressed="${c === category}">${sw}${escapeHTML(c)}<span class="n">${n}</span></button>`;
  }).join('');
}
function cardHTML(x) {
  const fav = favorites.has(x.id);
  return `<article class="card" style="${colorVars(x.category)}">
    <div class="thumb" data-detail="${x.id}" role="button" tabindex="-1" aria-hidden="true">
      <div class="thumb-top"><span class="no">#${String(x.id).padStart(3, '0')}</span><span class="dur">${icon('play', 'fill')}${fmtTime(x.duration)}</span></div>
      <span class="hook">${escapeHTML(x.hook)}</span>
      ${icon(categoryIcon[x.category], 'big')}
    </div>
    <div class="card-body">
      <span class="card-cat"><span class="swatch"></span>${highlight(x.category)}</span>
      <h3><button data-detail="${x.id}">${highlight(x.title)}</button></h3>
      <div class="tags"><span>${highlight(x.style)}</span><span>${highlight(x.mood)}</span><span>${highlight(x.structure)}</span></div>
    </div>
    <div class="card-actions">
      <button class="btn outline" data-detail="${x.id}">預覽</button>
      <button class="btn primary" data-use="${x.id}">套用</button>
      <button class="fav" data-fav="${x.id}" aria-pressed="${fav}" aria-label="${fav ? '移除收藏' : '加入收藏'}：${escapeHTML(x.title)}">${icon('star')}</button>
    </div>
  </article>`;
}
function renderCards() {
  const result = filtered(), maxPage = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
  page = Math.min(maxPage, Math.max(page, 1));
  const parts = [];
  if (category !== '全部') parts.push(category);
  if (onlyFavorites) parts.push('收藏');
  if (query) parts.push(`「${query}」`);
  $('#resultCount').textContent = `${parts.length ? parts.join(' · ') + '：' : '共 '}${result.length} 個範例`;
  $('#cards').innerHTML = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(cardHTML).join('');
  $('#emptyState').hidden = result.length !== 0;
  $('#emptyText').textContent = onlyFavorites && !favorites.size ? '還沒有收藏的範例。點卡片上的 ☆ 就能加入收藏。' : '找不到符合條件的範例。試著更換關鍵字或分類。';
  $('#favCount').textContent = favorites.size;
  renderPagination(maxPage, result.length);
}
function renderPagination(maxPage, total) {
  const nav = $('#pagination');
  if (total <= PAGE_SIZE) { nav.innerHTML = ''; return }
  const nums = [];
  for (let i = 1; i <= maxPage; i++) {
    if (i === 1 || i === maxPage || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums.at(-1) !== '…') nums.push('…');
  }
  nav.innerHTML = `<button data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''} aria-label="上一頁">${icon('left')}</button>` +
    nums.map(n => n === '…' ? '<span class="muted">…</span>' : `<button data-page="${n}" ${n === page ? 'aria-current="page"' : ''}>${n}</button>`).join('') +
    `<button data-page="${page + 1}" ${page >= maxPage ? 'disabled' : ''} aria-label="下一頁">${icon('right')}</button>`;
}
function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  safelyWrite('reels-favorites', [...favorites]);
  renderCards();
  $(`[data-fav="${id}"]`)?.classList.add('pop');
  if (!$('#detailModal').hidden && selected?.id === id) renderDetailFav();
  toast(favorites.has(id) ? '已加入收藏' : '已移除收藏');
}

/* ---------- 詳情 ---------- */
function exampleData(x) {
  return { ...defaults, style: x.style, mood: x.mood, structure: x.structure, length: `${x.duration} 秒`, shotCount: x.duration >= 60 ? '8 鏡' : '6 鏡' };
}
function renderDetailFav() {
  const fav = favorites.has(selected.id);
  $('#detailFav').innerHTML = `${icon('star')}<span>${fav ? '已收藏' : '收藏'}</span>`;
  $('#detailFav').setAttribute('aria-pressed', fav);
  $('#detailFav').classList.toggle('toggle', true);
}
function detail(id) {
  const list = filtered();
  selected = examples.find(x => x.id === id); if (!selected) return;
  const x = selected, idx = list.findIndex(y => y.id === id);
  const modal = $('#detailModal .modal');
  modal.setAttribute('style', colorVars(x.category));
  $('#detailCover').innerHTML = `<span class="hook">「${escapeHTML(x.hook)}」</span>${icon(categoryIcon[x.category], 'big')}`;
  $('#detailKicker').textContent = `#${String(x.id).padStart(3, '0')} · ${x.category}`;
  $('#detailTitle').textContent = x.title;
  const shots = storyboard(exampleData(x));
  $('#detailContent').innerHTML = `
    <p class="detail-summary">${escapeHTML(x.summary)}</p>
    <dl class="spec-grid">
      <div><dt>影片長度</dt><dd>${x.duration} 秒</dd></div>
      <div><dt>畫面風格</dt><dd>${escapeHTML(x.style)}</dd></div>
      <div><dt>呈現氛圍</dt><dd>${escapeHTML(x.mood)}</dd></div>
      <div><dt>敘事結構</dt><dd>${escapeHTML(x.structure)}</dd></div>
      <div><dt>建議分鏡</dt><dd>${shots.length} 鏡</dd></div>
      <div><dt>主題分類</dt><dd>${escapeHTML(x.category)}</dd></div>
    </dl>
    <h3>分鏡節奏預覽</h3>
    ${timelineHTML(shots, x.duration)}
    <ol class="shot-list" style="margin-top:12px">${shots.map(shotHTML).join('')}</ol>`;
  $('#detailPrev').disabled = idx <= 0;
  $('#detailNext').disabled = idx < 0 || idx >= list.length - 1;
  $('#detailPrev').onclick = () => idx > 0 && detail(list[idx - 1].id);
  $('#detailNext').onclick = () => idx < list.length - 1 && detail(list[idx + 1].id);
  renderDetailFav();
  if ($('#detailModal').hidden) openModal('#detailModal');
  $('#detailModal .modal').scrollTop = 0;
}
function useExample(id) {
  const x = examples.find(y => y.id === id); if (!x) return;
  $('#topicInput').value = x.title;
  const d = exampleData(x);
  for (const k of ['style', 'mood', 'length', 'structure', 'shotCount']) setValue(k, d[k]);
  $('#customInput').value = `開場第一句：「${x.hook}」；加入概念示意動畫、可驗證的資料來源與一題學生思考題。`;
  appliedId = x.id;
  buildPrompt();
  if (!$('#detailModal').hidden) closeModal('#detailModal');
  $('#studio').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  toast(`已套用範例 #${x.id}`);
}
function randomPick() {
  const pool = filtered().length ? filtered() : examples;
  const x = pool[Math.floor(Math.random() * pool.length)];
  if (x) detail(x.id);
}

/* ---------- 提示詞組合器 ---------- */
function setValue(k, val) {
  const el = $(`[data-prompt="${k}"]`);
  if (el && [...el.options].some(o => o.value === val)) el.value = val;
}
function renderFields() {
  const byKey = Object.fromEntries(specs.map(s => [s[0], s]));
  $('#promptFields').innerHTML = specGroups.map(([name, ic, keys], gi) => `
    <details class="group" ${gi < 2 ? 'open' : ''}>
      <summary><span class="gi">${icon(ic)}</span>${name}<small data-summary="${gi}"></small>${icon('down', 'chev')}</summary>
      <div class="group-body">${keys.map(k => {
        const [, zh, , opts] = byKey[k];
        return `<label class="field" data-field="${k}"><span class="field-label">${zh}</span><select data-prompt="${k}">${opts.map(v => `<option value="${escapeHTML(v)}">${escapeHTML(v)}</option>`).join('')}</select></label>`;
      }).join('')}</div>
    </details>`).join('');
  $$('[data-prompt]').forEach(e => e.addEventListener('change', () => { buildPrompt(); beep(640) }));
}
function promptData() { return Object.fromEntries(specs.map(s => [s[0], $(`[data-prompt="${s[0]}"]`).value])) }

/* 依敘事結構把分鏡分配到「鉤子 → 各段落 → 結尾」 */
const phaseColors = ['#3b5bfd', '#7b4dff', '#00a6a6', '#2fa36b'];
function storyboard(d) {
  const duration = parseInt(d.length) || 30, count = Math.max(3, parseInt(d.shotCount) || 6);
  const phases = d.structure.split('→'), middle = count - 2, P = phases.length;
  const shots = [];
  for (let i = 0; i < count; i++) {
    const start = Math.round(i * duration / count * 10) / 10, end = Math.round((i + 1) * duration / count * 10) / 10;
    let phase, task, color;
    if (i === 0) { phase = '開場鉤子'; task = `用「${d.hook}」在 3 秒內拋出核心問題，畫面直接呈現最吸睛的元素。`; color = 'var(--accent)' }
    else if (i === count - 1) { phase = '結尾'; task = `${d.ending}；用一句話收斂本片重點。`; color = '#55525c' }
    else {
      const m = i - 1, a = Math.floor(m * P / middle), b = Math.max(a + 1, Math.floor((m + 1) * P / middle));
      const ps = phases.slice(a, b);
      phase = ps.join('＋'); color = phaseColors[a % phaseColors.length];
      // 同一段落跨多鏡時，依序給「建立 → 深化 → 銜接」不同任務
      const k = shots.filter(s => s.phase === phase).length;
      task = [
        `以${d.animation}建立核心畫面，一鏡只講一個重點。`,
        `補充可查證的資料、實例或對照，深化理解。`,
        `用比較或示意收束本段，自然銜接下一段。`
      ][Math.min(k, 2)];
    }
    shots.push({ no: i + 1, start, end, phase, task, color, visual: `${d.style}；${d.camera}；${d.lighting}`, audio: d.music });
  }
  return shots;
}
function timelineHTML(shots, total) {
  return `<div class="timeline" role="img" aria-label="分鏡時間軸">${shots.map(s => `<span style="flex:${s.end - s.start};background:${s.color}" title="第 ${s.no} 鏡 · ${escapeHTML(s.phase)}">${s.no}</span>`).join('')}</div>`;
}
function shotHTML(s) {
  return `<li class="shot"><span class="t"><b>${s.no}</b>${s.start}–${s.end}s</span><span class="phase"><i style="background:${s.color}"></i>${escapeHTML(s.phase)}</span><p>${escapeHTML(s.task)}</p></li>`;
}
function storyboardRows() {
  const rows = [['鏡頭', '開始秒數', '結束秒數', '敘事段落', '敘事任務', '畫面與運鏡', '旁白字幕', '音效']];
  for (const s of storyboard(promptData())) rows.push([s.no, s.start, s.end, s.phase, s.task, s.visual, '依照題目撰寫正確且可理解的解說，不捏造資料', s.audio]);
  return rows;
}
function buildPrompt() {
  const d = promptData(), topic = $('#topicInput').value.trim() || '請提供影片主題', audience = $('#audienceInput').value.trim() || '高中學生', notes = $('#customInput').value.trim();
  const shots = storyboard(d);
  const parts = [
    `你是一位高中教學影片導演、科學傳播編劇與分鏡設計師。請規劃可實際製作的 Reels 直式教學短影音。`,
    `【核心任務】\n影片主題：${topic}\n目標觀眾：${audience}`,
    `【視覺與聲音設定】\n${specs.map(([k, label]) => `${label}：${d[k]}`).join('\n')}`,
    `【敘事與教學要求】\n1. 影片開頭 3 秒使用「${d.hook}」引發好奇。\n2. 依「${d.structure}」設計具有學習目標的短片，控制在 ${d.length}。\n3. 使用簡單準確的高中程度語言，必要時解釋專有名詞。\n4. 對科普、國際事件、歷史與數據等可核查資訊，附來源名稱、發布或事件日期、查證狀態；不得虛構引言或統計數據。\n5. 對涉及當代國際新聞的主題，先核實最新進展，明確區分事實、觀點與推測。`,
    `【建議分鏡節奏】\n${shots.map(s => `第 ${s.no} 鏡（${s.start}–${s.end} 秒）${s.phase}：${s.task}`).join('\n')}`,
    `【請依序提供】\nA. 影片定位、學習目標、開場鉤子（一句話）。\nB. 完整逐字旁白稿（${d.language}）。\nC. ${d.shotCount}分鏡表，包含開始／結束秒數、場景畫面、主角動作、構圖運鏡、轉場、每鏡字幕、旁白、配樂音效。\nD. 每鏡可直接輸入影片生成工具的視覺提示詞。\nE. 配音字幕同步建議、平台發布文案、封面標題及 3 個主題標籤。\nF. 影片完成前的事實查核與品質檢查表。`,
    `【品質與安全限制】\n影片主要內容放在畫面安全區，避開各平台上／下／右側介面。維持角色、物件、視覺風格與光線的一致性。避免字幕錯字、變形、閃爍、聲畫不同步。使用有授權的音樂、圖片、影片素材；必要時註明 AI 生成。若生成工具無法完成長片，請改成短鏡頭逐段生成，再剪輯合成。僅在實際輸出成功後才稱為完成 MP4。`,
    ...(notes ? [`【額外指示】\n${notes}`] : [])
  ];
  const text = parts.join('\n\n');
  $('#promptOutput').innerHTML = escapeHTML(text).replace(/【[^】]+】/g, m => `<span class="h">${m}</span>`);
  $('#promptLength').textContent = `${text.length.toLocaleString()} 字元 · ${shots.length} 鏡`;
  $('#mobileBarInfo').textContent = `${d.length} · ${shots.length} 鏡 · ${text.length.toLocaleString()} 字`;
  $('#boardTimeline').outerHTML = timelineHTML(shots).replace('class="timeline"', 'class="timeline" id="boardTimeline"');
  $('#boardList').innerHTML = shots.map(shotHTML).join('');
  // 分組摘要與「已修改」標記
  specGroups.forEach(([, , keys], gi) => { const el = $(`[data-summary="${gi}"]`); if (el) el.textContent = keys.slice(0, 2).map(k => d[k]).join(' · ') });
  for (const [k] of specs) $(`[data-field="${k}"]`)?.classList.toggle('changed', d[k] !== defaults[k]);
  const ap = $('#appliedFrom');
  const x = appliedId && examples.find(y => y.id === appliedId);
  ap.hidden = !(x && $('#topicInput').value.trim() === x.title);
  if (!ap.hidden) ap.innerHTML = `${icon('sparkle')}<span>已套用範例 #${String(x.id).padStart(3, '0')}・${escapeHTML(x.category)}</span>`;
  safelyWrite('reels-studio', { topic: $('#topicInput').value, audience: $('#audienceInput').value, custom: notes, values: d, appliedId });
  return text;
}
function restoreStudio() {
  const s = safelyRead('reels-studio', null);
  $('#topicInput').value = s?.topic ?? DEFAULT_TOPIC;
  $('#audienceInput').value = s?.audience ?? DEFAULT_AUDIENCE;
  $('#customInput').value = s?.custom ?? '';
  appliedId = s?.appliedId ?? null;
  for (const [k, v] of Object.entries({ ...defaults, ...(s?.values || {}) })) setValue(k, v);
}
function resetPrompt() {
  for (const [k, v] of Object.entries(defaults)) setValue(k, v);
  $('#topicInput').value = DEFAULT_TOPIC; $('#audienceInput').value = DEFAULT_AUDIENCE; $('#customInput').value = '';
  appliedId = null; buildPrompt(); toast('已恢復預設參數');
}
function shuffleStyle() {
  for (const k of shuffleKeys) { const opts = specs.find(s => s[0] === k)[3]; setValue(k, opts[Math.floor(Math.random() * opts.length)]) }
  buildPrompt(); toast('已隨機搭配視覺與聲音風格');
}
function selectTab(which) {
  const isPrompt = which === 'prompt';
  $('#tabPrompt').setAttribute('aria-selected', isPrompt); $('#tabBoard').setAttribute('aria-selected', !isPrompt);
  $('#tabPrompt').tabIndex = isPrompt ? 0 : -1; $('#tabBoard').tabIndex = isPrompt ? -1 : 0;
  $('#panePrompt').hidden = !isPrompt; $('#paneBoard').hidden = isPrompt;
}

/* ---------- 匯出 ---------- */
function download(name, content, type) {
  const blob = new Blob([content], { type }), url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copyText(t, btn) {
  let ok = true;
  try { await navigator.clipboard.writeText(t) } catch {
    const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select(); ok = document.execCommand('copy'); ta.remove();
  }
  toast(ok ? '提示詞已複製，可以貼到 AI 影片工具了' : '無法複製，請手動選取文字', ok);
  if (ok && btn) {
    const html = btn.innerHTML; btn.classList.add('done'); btn.innerHTML = `${icon('check')}<span>已複製</span>`;
    setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = html }, 1600);
  }
}
const fileStem = () => ($('#topicInput').value.trim() || 'reels').replace(/[\\/:*?"<>|？]/g, '').slice(0, 30);
function exportCSV() {
  const csv = '﻿' + storyboardRows().map(row => row.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  download(`${fileStem()}-分鏡.csv`, csv, 'text/csv;charset=utf-8'); toast('已匯出分鏡 CSV');
}

/* ---------- Hero 手機輪播 ---------- */
let heroIndex = 0, heroTimer = null;
function heroShow(x) {
  const screen = $('#heroScreen'), stage = $('.hero-stage');
  const [a, b] = categoryColor[x.category];
  for (const el of [screen, stage]) { el.style.setProperty('--c1', a); el.style.setProperty('--c2', b) }
  $('#heroCat').textContent = x.category; $('#heroDur').textContent = fmtTime(x.duration);
  $('#heroIcon').setAttribute('href', '#i-' + categoryIcon[x.category]);
  $('#heroHook').textContent = x.hook; $('#heroTitle').textContent = x.title; $('#heroMeta').textContent = `${x.style} · ${x.mood}`;
  screen.classList.remove('swap'); void screen.offsetWidth; screen.classList.add('swap');
  const bars = $$('.reel-progress i'), cur = heroIndex % bars.length;
  bars.forEach((bar, i) => { bar.className = i < cur ? 'done' : i === cur ? 'run' : '' });
}
function startHero() {
  if (!examples.length) return;
  const picks = [...examples].sort(() => Math.random() - .5);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  heroShow(picks[0]);
  if (reduce) return;
  heroTimer = setInterval(() => { if (document.hidden) return; heroIndex++; heroShow(picks[heroIndex % picks.length]) }, 3600);
}

/* ---------- 綁定事件 ---------- */
function attach() {
  renderFlow(); renderFields(); restoreStudio(); buildPrompt(); applySettings();
  $('#statParams').textContent = specs.length;

  ['topicInput', 'audienceInput', 'customInput'].forEach(id => $('#' + id).addEventListener('input', buildPrompt));
  let searchTimer;
  $('#searchInput').addEventListener('input', e => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { query = e.target.value.trim(); page = 1; renderCards() }, 120) });
  $('#sortSelect').onchange = e => { sort = e.target.value; page = 1; renderCards() };
  $('#favoriteFilter').onclick = () => { onlyFavorites = !onlyFavorites; $('#favoriteFilter').setAttribute('aria-pressed', onlyFavorites); page = 1; renderCards(); beep() };
  $('#clearFilters').onclick = () => { query = ''; $('#searchInput').value = ''; category = '全部'; onlyFavorites = false; $('#favoriteFilter').setAttribute('aria-pressed', false); page = 1; renderCategories(); renderCards() };
  $('#randomPick').onclick = randomPick;

  $('#categories').addEventListener('click', e => {
    const b = e.target.closest('[data-category]'); if (!b) return;
    category = b.dataset.category; page = 1; renderCategories(); renderCards(); beep();
  });
  $('#cards').addEventListener('click', e => {
    const t = e.target.closest('[data-detail],[data-use],[data-fav]'); if (!t) return;
    if (t.dataset.fav) toggleFavorite(+t.dataset.fav);
    else if (t.dataset.use) useExample(+t.dataset.use);
    else detail(+t.dataset.detail);
  });
  $('#pagination').addEventListener('click', e => {
    const b = e.target.closest('[data-page]'); if (!b || b.disabled) return;
    page = +b.dataset.page; renderCards(); $('#examples').scrollIntoView();
  });

  $('#settingsOpen').onclick = () => { renderSettings(); openModal('#settingsModal'); beep() };
  $('#settingsFields').addEventListener('click', e => { const b = e.target.closest('[data-setting]'); if (b) changeSetting(b.dataset.setting, b.dataset.value) });
  $('#settingsReset').onclick = () => { settings = { ...settingDefaults }; applySettings(); renderSettings(); toast('設定已恢復預設') };
  $('#themeToggle').onclick = () => { settings.theme = resolvedTheme() === 'dark' ? '亮色' : '暗色'; applySettings(); beep() };
  $$('[data-close]').forEach(b => b.addEventListener('click', () => closeModal('#' + b.closest('.modal-backdrop').id)));
  $('#detailUse').onclick = () => selected && useExample(selected.id);
  $('#detailFav').onclick = () => selected && toggleFavorite(selected.id);
  $('#detailCover').onclick = null;

  $('#resetPrompt').onclick = resetPrompt;
  $('#shuffleStyle').onclick = shuffleStyle;
  $('#tabPrompt').onclick = () => selectTab('prompt');
  $('#tabBoard').onclick = () => selectTab('board');
  $('.tabs').addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const p = $('#tabPrompt').getAttribute('aria-selected') === 'true'; selectTab(p ? 'board' : 'prompt'); (p ? $('#tabBoard') : $('#tabPrompt')).focus() } });
  $('#copyPrompt').onclick = () => copyText(buildPrompt(), $('#copyPrompt'));
  $('#mobileCopy').onclick = () => copyText(buildPrompt(), $('#mobileCopy'));
  $('#downloadPrompt').onclick = () => { download(`${fileStem()}-提示詞.txt`, '﻿' + buildPrompt(), 'text/plain;charset=utf-8'); toast('已下載文字檔') };
  $('#downloadStoryboard').onclick = exportCSV;

  $$('.modal-backdrop').forEach(m => m.addEventListener('mousedown', e => { if (e.target === m) closeModal('#' + m.id) }));
  document.addEventListener('keydown', e => {
    const open = $$('.modal-backdrop').find(m => !m.hidden);
    if (e.key === 'Escape' && open) return closeModal('#' + open.id);
    if (e.key === 'Tab') return trapFocus(e);
    if (open?.id === 'detailModal' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { (e.key === 'ArrowLeft' ? $('#detailPrev') : $('#detailNext')).click(); return }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if (e.key === '/' && !typing && !open) { e.preventDefault(); $('#searchInput').focus(); $('#examples').scrollIntoView({ block: 'start' }) }
  });
  document.addEventListener('fullscreenchange', () => { settings.fullscreen = document.fullscreenElement ? '開啟' : '關閉'; applySettings(); if (!$('#settingsModal').hidden) renderSettings() });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applySettings);

  // 頂列陰影、導覽高亮、手機複製列
  const topbar = $('#topbar');
  addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 8), { passive: true });
  const navLinks = $$('[data-nav]');
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === en.target.id));
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['examples', 'studio', 'guide'].forEach(id => io.observe($('#' + id)));
  const narrow = matchMedia('(max-width: 980px)'), bar = $('#mobileBar');
  let studioVisible = false;
  const syncBar = () => { bar.hidden = false; bar.classList.toggle('show', studioVisible && narrow.matches) };
  new IntersectionObserver(([en]) => { studioVisible = en.isIntersecting; syncBar() }, { threshold: .05 }).observe($('.controls'));
  narrow.addEventListener?.('change', syncBar);
}

async function init() {
  attach();
  try {
    const r = await fetch('data/examples.json');
    if (!r.ok) throw Error(r.status);
    examples = await r.json();
    if (!Array.isArray(examples) || !examples.length) throw Error('範例資料格式異常');
    [...new Set(examples.map(x => x.category))].forEach((c, i) => {
      categoryColor[c] = palettes[i % palettes.length];
      const ic = examples.find(x => x.category === c).icon;
      categoryIcon[c] = iconIds.includes(ic) ? ic : iconIds[i % iconIds.length];
    });
    $('#statExamples').textContent = examples.length;
    $('#statCategories').textContent = Object.keys(categoryColor).length;
    renderCategories(); renderCards(); buildPrompt(); startHero();
  } catch (e) {
    $('#emptyState').hidden = false; $('#clearFilters').hidden = true;
    $('#emptyText').textContent = '範例資料載入失敗。請使用本機伺服器或 GitHub Pages 開啟網站（不可直接以 file:// 開啟）。';
    console.error(e);
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(console.warn);
  $('#offlineLabel').hidden = navigator.onLine;
  addEventListener('online', () => $('#offlineLabel').hidden = true);
  addEventListener('offline', () => $('#offlineLabel').hidden = false);
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; $('#installBtn').hidden = false });
  $('#installBtn').onclick = async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $('#installBtn').hidden = true };
  addEventListener('appinstalled', () => toast('App 安裝成功'));
}
init();
