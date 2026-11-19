/* ================= GLOBAL STATE & FUNCTIONS ================= */
let masteredIds = JSON.parse(localStorage.getItem('mastered_vocab_ids')) || [];

let vocabQueue = [];
let queueIdx = 0;
let vocabMode = 'quiz';
let currentVocab = null;
let isReviewingMastered = false;

let lessons = JSON.parse(localStorage.getItem('custom_lessons')) || LESSONS_DATA;
let currentLesson = lessons[0];
let currentDictIdx = 0;

let currentTense = 'pres_simple';
let filteredGrammar = [];
let grammarIdx = 0;

let speakIdx = 0;
let currentSpeak = SPEAKING_DATA[0];

let mistakes = JSON.parse(localStorage.getItem('eng_mistakes')) || [];

/* ================= DRAWER MENU & NAVIGATION ================= */
function openMenu() {
  const drawer = document.getElementById('drawer-menu');
  const backdrop = document.getElementById('menu-backdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
}

function closeMenu() {
  const drawer = document.getElementById('drawer-menu');
  const backdrop = document.getElementById('menu-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
}

function toggleMenu() {
  const drawer = document.getElementById('drawer-menu');
  if (!drawer) return;
  if (drawer.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

function switchTab(tabId, btnEl) {
  document.querySelectorAll('.tab-content').forEach((tc) => tc.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));

  const targetEl = document.getElementById('tab-' + tabId);
  if (targetEl) targetEl.classList.add('active');
  if (btnEl) btnEl.classList.add('active');

  if (tabId === 'vocab-store') renderVocabStore('unmastered');
  if (tabId === 'notebook') renderNotebook();

  closeMenu();
}

window.onload = function () {
  initVocabQueue();
  initLessonSelect();
  initGrammar();
  renderSpeaking();
  renderVerbs(IRREGULAR_VERBS);
};

/* --- 1. VOCAB QUEUE LOGIC --- */
function getPoolSource() {
  const lvl = document.getElementById('vocab-level').value;
  const top = document.getElementById('vocab-topic').value;
  let pool = VOCAB_DATA.filter(
    (v) =>
      (lvl === 'all' || v.level === lvl) &&
      (top === 'all' || v.topic === top) &&
      !masteredIds.includes(v.id)
  );
  if (pool.length === 0) {
    pool = VOCAB_DATA.filter((v) => (lvl === 'all' || v.level === lvl) && (top === 'all' || v.topic === top));
  }
  return pool;
}

function initVocabQueue() {
  isReviewingMastered = false;
  document.getElementById('vocab-mode-title').innerText = 'Cài đặt bài học từ vựng';
  document.getElementById('normal-vocab-filters').style.display = 'grid';
  document.getElementById('vocab-mode-switcher').style.display = 'grid';
  document.getElementById('exit-review-btn').style.display = 'none';
  document.getElementById('master-action-btn').style.display = 'inline-flex';

  const pool = getPoolSource().sort(() => 0.5 - Math.random());
  vocabQueue = pool.slice(0, 10);
  queueIdx = 0;
  renderVocab();
}

function startReviewMastered() {
  const masteredWords = VOCAB_DATA.filter((v) => masteredIds.includes(v.id));
  if (masteredWords.length === 0) {
    return alert('Chưa có từ nào được đánh dấu là Đã thuộc để ôn tập!');
  }
  isReviewingMastered = true;
  vocabQueue = [...masteredWords].sort(() => 0.5 - Math.random());
  queueIdx = 0;

  document.getElementById('vocab-mode-title').innerText = `🔄 Đang ôn tập toàn bộ từ Đã thuộc (${vocabQueue.length} từ)`;
  document.getElementById('normal-vocab-filters').style.display = 'none';
  document.getElementById('vocab-mode-switcher').style.display = 'none';
  document.getElementById('exit-review-btn').style.display = 'block';
  document.getElementById('master-action-btn').style.display = 'none';

  switchTab('vocab', document.querySelectorAll('.nav-btn')[0]);
  renderVocab();
}

function exitReviewMode() {
  initVocabQueue();
}

function setVocabMode(mode) {
  vocabMode = mode;
  document.getElementById('mode-quiz-btn').className = mode === 'quiz' ? 'btn btn-primary' : 'btn btn-secondary';
  document.getElementById('mode-type-btn').className = mode === 'type' ? 'btn btn-primary' : 'btn btn-secondary';
  document.getElementById('v-quiz-area').style.display = mode === 'quiz' ? 'block' : 'none';
  document.getElementById('v-type-area').style.display = mode === 'type' ? 'block' : 'none';
  renderVocab();
}

function renderVocab() {
  if (vocabQueue.length === 0) {
    document.getElementById('v-prompt').innerText = '🎉 Hoàn thành danh sách!';
    document.getElementById('v-phonetic').innerText = isReviewingMastered
      ? 'Bạn đã ôn tập xong tất cả từ đã thuộc.'
      : 'Hệ thống đang tải hàng đợi mới.';
    document.getElementById('vocab-counter').innerText = '0/0';
    if (!isReviewingMastered) setTimeout(initVocabQueue, 1500);
    return;
  }
  currentVocab = vocabQueue[queueIdx % vocabQueue.length];
  document.getElementById('vocab-counter').innerText = `${(queueIdx % vocabQueue.length) + 1}/${vocabQueue.length}`;
  document.getElementById('v-badge').innerText = `Bậc ${currentVocab.level} • ${currentVocab.topic.toUpperCase()}`;
  document.getElementById('v-feedback').className = 'feedback-box';

  speakText(currentVocab.en);

  if (vocabMode === 'quiz') {
    document.getElementById('v-prompt').innerText = currentVocab.en;
    document.getElementById('v-phonetic').innerText = currentVocab.phonetic;
    const others = VOCAB_DATA.filter((x) => x.id !== currentVocab.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const choices = [...others, currentVocab].sort(() => 0.5 - Math.random());
    const letters = ['A', 'B', 'C', 'D'];
    document.getElementById('v-quiz-area').innerHTML = choices
      .map(
        (c, i) =>
          `<button class="option-btn" onclick="checkQuizVocab(this, ${c.id === currentVocab.id})"><b>${letters[i]}.</b> ${c.vi}</button>`
      )
      .join('');
  } else {
    document.getElementById('v-prompt').innerText = currentVocab.vi;
    document.getElementById('v-phonetic').innerText = '(Gõ từ tiếng Anh tương ứng)';
    document.getElementById('v-input').value = '';
  }
}

function checkQuizVocab(btn, isCorrect) {
  const fb = document.getElementById('v-feedback');
  if (isCorrect) {
    btn.classList.add('correct');
    fb.className = 'feedback-box show fb-ok';
    fb.innerHTML = `✅ Chính xác! <b>${currentVocab.en}</b> = ${currentVocab.vi}`;
    speakText(currentVocab.en);
  } else {
    btn.classList.add('wrong');
    fb.className = 'feedback-box show fb-err';
    fb.innerHTML = `❌ Sai rồi! Đáp án đúng là: <b>${currentVocab.vi}</b>`;
    addMistake(`Từ vựng: ${currentVocab.en} -> ${currentVocab.vi}`);
  }
}

function checkTypedVocab() {
  const val = document.getElementById('v-input').value.trim().toLowerCase();
  const ans = currentVocab.en.toLowerCase();
  const fb = document.getElementById('v-feedback');
  if (val === ans) {
    fb.className = 'feedback-box show fb-ok';
    fb.innerHTML = `✅ Tuyệt vời! <b>${currentVocab.en}</b> ${currentVocab.phonetic}`;
    speakText(currentVocab.en);
  } else {
    fb.className = 'feedback-box show fb-err';
    fb.innerHTML = `❌ Chưa đúng. Từ chuẩn là: <b>${currentVocab.en}</b> ${currentVocab.phonetic}`;
    addMistake(`Gõ từ: ${currentVocab.vi} -> ${currentVocab.en}`);
  }
}

function nextVocabQueue() {
  queueIdx++;
  renderVocab();
}

function markCurrentAsMastered() {
  if (!currentVocab) return;
  if (!masteredIds.includes(currentVocab.id)) {
    masteredIds.push(currentVocab.id);
    localStorage.setItem('mastered_vocab_ids', JSON.stringify(masteredIds));
  }
  vocabQueue.splice(queueIdx % vocabQueue.length, 1);

  const pool = getPoolSource().filter((v) => !vocabQueue.some((q) => q.id === v.id));
  if (pool.length > 0) {
    const nextWord = pool[Math.floor(Math.random() * pool.length)];
    vocabQueue.push(nextWord);
  }

  if (vocabQueue.length === 0) {
    initVocabQueue();
  } else {
    queueIdx = queueIdx % vocabQueue.length;
    renderVocab();
  }
}

/* --- KHO TỪ VỰNG & ÔN TẬP --- */
function renderVocabStore(filterType) {
  const listEl = document.getElementById('vocab-store-list');
  const titleEl = document.getElementById('store-list-title');
  const statsEl = document.getElementById('store-stats');

  statsEl.innerText = `${VOCAB_DATA.length} tổng số`;
  const targetList = VOCAB_DATA.filter((v) =>
    filterType === 'mastered' ? masteredIds.includes(v.id) : !masteredIds.includes(v.id)
  );

  titleEl.innerText =
    filterType === 'mastered' ? `📚 Từ đã thuộc (${targetList.length})` : `📖 Từ chưa thuộc (${targetList.length})`;

  if (targetList.length === 0) {
    listEl.innerHTML = `<p style="text-align:center; padding:20px; color:var(--muted);">Không có từ nào trong mục này.</p>`;
    return;
  }

  listEl.innerHTML = targetList
    .map(
      (v) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid var(--border);">
        <div>
          <b>${v.en}</b> <span style="font-size:12px; color:var(--muted);">${v.phonetic}</span><br/>
          <span style="font-size:13px; color:var(--primary);">${v.vi}</span> <span class="tag">Bậc ${v.level}</span>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-sm btn-secondary" onclick="speakText('${v.en}')">🔊 Nghe</button>
          <button class="btn btn-sm ${masteredIds.includes(v.id) ? 'btn-success' : 'btn-secondary'}" onclick="toggleStoreMaster(${v.id}, '${filterType}')">
            ${masteredIds.includes(v.id) ? 'Đã thuộc' : 'Chưa thuộc'}
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

function toggleStoreMaster(id, filterType) {
  const idx = masteredIds.indexOf(id);
  if (idx > -1) {
    masteredIds.splice(idx, 1);
  } else {
    masteredIds.push(id);
  }
  localStorage.setItem('mastered_vocab_ids', JSON.stringify(masteredIds));
  renderVocabStore(filterType);
  if (!isReviewingMastered) initVocabQueue();
}

/* --- 2. DICTATION (AI AUDIO) --- */
function initLessonSelect() {
  const sel = document.getElementById('lesson-select');
  if (sel) sel.innerHTML = lessons.map((l, idx) => `<option value="${idx}">${l.title}</option>`).join('');
  loadSelectedLesson();
}

function loadSelectedLesson() {
  const idx = document.getElementById('lesson-select') ? document.getElementById('lesson-select').value : 0;
  currentLesson = lessons[idx];
  currentDictIdx = 0;
  updateDictUI();
}

function updateDictUI() {
  const prog = document.getElementById('dict-progress');
  if (prog) prog.innerText = `${currentLesson.title} • Câu ${currentDictIdx + 1} / ${currentLesson.sentences.length}`;
  const inp = document.getElementById('dict-input');
  if (inp) inp.value = '';
  const res = document.getElementById('dict-result');
  if (res) res.style.display = 'none';
  const scriptBox = document.getElementById('full-script-box');
  if (scriptBox) {
    scriptBox.innerHTML = currentLesson.sentences
      .map(
        (s, i) =>
          `<div class="script-item ${i === currentDictIdx ? 'active-line' : ''}" onclick="jumpToDict(${i})">
          <b>#${i + 1}:</b> ${s.en} <br/><span style="color:var(--muted)">🇻🇳 ${s.vi}</span>
        </div>`
      )
      .join('');
  }
}

function playCurrentAudio(rate) {
  const item = currentLesson.sentences[currentDictIdx];
  if (item) speakText(item.en, rate);
}

function jumpToDict(i) {
  currentDictIdx = i;
  updateDictUI();
  playCurrentAudio(1.0);
}
function nextDictSentence() {
  if (currentDictIdx < currentLesson.sentences.length - 1) {
    currentDictIdx++;
    updateDictUI();
    playCurrentAudio(1.0);
  }
}
function prevDictSentence() {
  if (currentDictIdx > 0) {
    currentDictIdx--;
    updateDictUI();
    playCurrentAudio(1.0);
  }
}
function toggleFullScript() {
  const box = document.getElementById('full-script-box');
  if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}
function handleDictKey(e) {
  if (e.ctrlKey) {
    e.preventDefault();
    playCurrentAudio(1.0);
  }
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    checkDictation();
  }
}

function checkDictation() {
  const item = currentLesson.sentences[currentDictIdx];
  const userWords = document.getElementById('dict-input').value.trim().split(/\s+/);
  const rawTarget = item.en.split(/\s+/);

  const html = rawTarget
    .map((w, i) => {
      const cleanT = w.replace(/[.,!?]/g, '').toLowerCase();
      const cleanU = (userWords[i] || '').replace(/[.,!?]/g, '').toLowerCase();
      if (cleanT === cleanU) return `<span class="word-ok">${w}</span>`;
      return `<span class="word-err">${userWords[i] || '___'}</span> <span class="word-ok">(${w})</span>`;
    })
    .join(' ');

  const res = document.getElementById('dict-result');
  res.style.display = 'block';
  res.innerHTML = `<div>${html}</div><div style="margin-top:6px; font-size:13px; color:var(--muted)">🇻🇳 ${item.vi}</div>`;
}

function toggleAddLessonForm() {
  const f = document.getElementById('add-lesson-form');
  if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

function saveCustomLesson() {
  const title = document.getElementById('new-lesson-title').value.trim();
  const rawLines = document.getElementById('new-lesson-sentences').value.trim().split('\n');
  if (!title || rawLines.length === 0) return alert('Vui lòng nhập đủ thông tin!');

  const sentences = rawLines
    .map((l) => {
      const parts = l.split('|');
      return { en: (parts[0] || '').trim(), vi: (parts[1] || '').trim() };
    })
    .filter((s) => s.en);

  lessons.push({ id: 'custom_' + Date.now(), title, sentences });
  localStorage.setItem('custom_lessons', JSON.stringify(lessons));
  initLessonSelect();
  document.getElementById('lesson-select').value = lessons.length - 1;
  loadSelectedLesson();
  toggleAddLessonForm();
  alert('Đã lưu bài học mới!');
}

/* --- 3. GRAMMAR --- */
function initGrammar() {
  const coreEl = document.getElementById('core-tenses');
  const otherEl = document.getElementById('other-tenses');
  if (coreEl) {
    coreEl.innerHTML = TENSES.filter((t) => t.core)
      .map(
        (t) =>
          `<span class="tense-pill core ${t.id === currentTense ? 'active' : ''}" onclick="selectTense('${t.id}')">${t.name} (300)</span>`
      )
      .join('');
  }
  if (otherEl) {
    otherEl.innerHTML = TENSES.filter((t) => !t.core)
      .map(
        (t) =>
          `<span class="tense-pill ${t.id === currentTense ? 'active' : ''}" onclick="selectTense('${t.id}')">${t.name} (100)</span>`
      )
      .join('');
  }
  selectTense(currentTense);
}

function selectTense(tId) {
  currentTense = tId;
  initGrammarUIOnly();
  const tObj = TENSES.find((t) => t.id === tId);
  if (tObj) {
    document.getElementById('g-tense-name').innerText = tObj.name;
    document.getElementById('g-target-badge').innerText = `Bộ ${tObj.target} câu`;
    document.getElementById('g-formula').innerText = tObj.formula;
  }

  filteredGrammar = GRAMMAR_QUESTIONS.filter((q) => q.tense === tId);
  if (filteredGrammar.length === 0) filteredGrammar = GRAMMAR_QUESTIONS;
  grammarIdx = 0;
  renderGrammarQ();
}

function initGrammarUIOnly() {
  const coreEl = document.getElementById('core-tenses');
  const otherEl = document.getElementById('other-tenses');
  if (coreEl) {
    coreEl.innerHTML = TENSES.filter((t) => t.core)
      .map(
        (t) =>
          `<span class="tense-pill core ${t.id === currentTense ? 'active' : ''}" onclick="selectTense('${t.id}')">${t.name}</span>`
      )
      .join('');
  }
  if (otherEl) {
    otherEl.innerHTML = TENSES.filter((t) => !t.core)
      .map(
        (t) =>
          `<span class="tense-pill ${t.id === currentTense ? 'active' : ''}" onclick="selectTense('${t.id}')">${t.name}</span>`
      )
      .join('');
  }
}

function renderGrammarQ() {
  const qObj = filteredGrammar[grammarIdx % filteredGrammar.length];
  document.getElementById('g-question').innerText = `Câu ${grammarIdx + 1}: ${qObj.q}`;
  document.getElementById('g-feedback').className = 'feedback-box';
  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('g-options').innerHTML = qObj.opts
    .map(
      (opt, idx) =>
        `<button class="option-btn" onclick="checkGrammar(this, ${idx === qObj.ans}, '${opt}')"><b>${letters[idx]}.</b> ${opt}</button>`
    )
    .join('');
}

function checkGrammar(btn, isCorrect, chosenOpt) {
  const qObj = filteredGrammar[grammarIdx % filteredGrammar.length];
  const fb = document.getElementById('g-feedback');
  if (isCorrect) {
    btn.classList.add('correct');
    fb.className = 'feedback-box show fb-ok';
    fb.innerHTML = `✅ Chính xác tuyệt đối!<br/><b>Vì sao đúng:</b> ${qObj.whyRight}`;
  } else {
    btn.classList.add('wrong');
    fb.className = 'feedback-box show fb-err';
    fb.innerHTML = `❌ Chưa chính xác!<br/><b>Phân tích lỗi sai:</b> ${qObj.whyWrong}<br/><br/><b>Bản chất đúng:</b> ${qObj.whyRight}`;
    addMistake(`Ngữ pháp: ${qObj.q} (Bạn chọn sai: ${chosenOpt})`);
  }
}
function nextGrammar() {
  grammarIdx++;
  renderGrammarQ();
}

/* --- 4. SPEAKING --- */
function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.innerText = val;
}

function renderSpeaking() {
  if (!Array.isArray(SPEAKING_DATA) || SPEAKING_DATA.length === 0) return;
  currentSpeak = SPEAKING_DATA[speakIdx % SPEAKING_DATA.length];

  setText('sp-topic', currentSpeak.topic);
  setText('sp-sentence', `"${currentSpeak.en}"`);
  setText('sp-meaning', currentSpeak.vi);
  setText('sp-roleplay-q', currentSpeak.rq);
  setText('sp-roleplay-a', currentSpeak.ra);

  const ansEl = document.getElementById('sp-roleplay-a');
  if (ansEl) ansEl.style.display = 'none';

  const resEl = document.getElementById('sp-result');
  if (resEl) resEl.className = 'feedback-box';
}
function nextSpeaking() {
  speakIdx++;
  renderSpeaking();
}

function startSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return alert('Trình duyệt chưa hỗ trợ nhận diện giọng nói. Hãy dùng Google Chrome!');
  const rec = new SpeechRec();
  rec.lang = 'en-US';
  const micBtn = document.getElementById('mic-btn');
  micBtn.classList.add('mic-pulse');
  micBtn.innerText = '🎙️ Đang nghe...';

  rec.onresult = (e) => {
    const said = e.results[0][0].transcript;
    const fb = document.getElementById('sp-result');
    fb.className = 'feedback-box show fb-ok';
    fb.innerHTML = `🗣️ Bạn đọc: <b>"${said}"</b>`;
  };
  rec.onerror = () => alert('Không nghe rõ, thử lại gần mic hơn.');
  rec.onend = () => {
    micBtn.classList.remove('mic-pulse');
    micBtn.innerText = '🎙️ Bấm để nói';
  };
  rec.start();
}

/* --- 5. VERBS --- */
function renderVerbs(list) {
  const tbody = document.getElementById('verb-table-body');
  if (tbody) {
    tbody.innerHTML = list
      .map((v) => `<tr><td><b>${v.v1}</b></td><td>${v.v2}</td><td>${v.v3}</td><td>${v.vi}</td></tr>`)
      .join('');
  }
}
function filterVerbs() {
  const kw = document.getElementById('verb-search').value.toLowerCase();
  renderVerbs(
    IRREGULAR_VERBS.filter(
      (v) =>
        v.v1.includes(kw) ||
        v.v2.includes(kw) ||
        v.v3.includes(kw) ||
        v.vi.toLowerCase().includes(kw)
    )
  );
}

/* --- 6. NOTEBOOK --- */
function addMistake(text) {
  if (!mistakes.includes(text)) {
    mistakes.unshift(text);
    localStorage.setItem('eng_mistakes', JSON.stringify(mistakes.slice(0, 50)));
  }
}
function clearMistakes() {
  mistakes = [];
  localStorage.removeItem('eng_mistakes');
  renderNotebook();
}
function renderNotebook() {
  const mList = document.getElementById('mistake-list');
  if (mList)
    mList.innerHTML = mistakes.length
      ? mistakes.map((m) => `<div style="padding:6px 0; border-bottom:1px solid #eee;">• ${m}</div>`).join('')
      : 'Chưa có câu sai nào!';
  const cList = document.getElementById('cheatsheet-list');
  if (cList) {
    cList.innerHTML = CHEAT_SHEET.map(
      (c) =>
        `<div style="margin-bottom:10px;">
          <strong style="font-size:13px; color:var(--primary);">${c.cat}</strong>
          ${c.items
            .map(
              (i) => `<div style="padding:5px 8px; background:#f8fafc; border-radius:6px; margin-top:4px; font-size:13px; display:flex; justify-content:space-between;">
            <span>${i}</span> <span style="cursor:pointer;" onclick="speakText('${i.replace(/'/g, "\\'")}')">🔊</span>
          </div>`
            )
            .join('')}
        </div>`
    ).join('');
  }
}

function speakText(text, rate = 1.0) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  window.speechSynthesis.speak(u);
}