/* Back to Journal — orchestratore dell'app, bilingue (IT/ES).
   Check-in emotivo → rispecchiamento → sessione → percorso/diario. */

var BTJApp = (function () {
  var currentEmotionLabel = '';
  var currentScreen = 'welcome';

  /* Sessione di scrittura libera, per chi non si riconosce (ancora) in un archetipo. */
  function freeArchetype() {
    var t = BTJLang.t;
    return {
      id: 'libero',
      name: t('freeArchetypeName'),
      essence: t('freeArchetypeEssence'),
      description: t('freeArchetypeDescription'),
      days: [{
        day: 1,
        subject: t('freeDaySubject'),
        durationMinutes: 5,
        intro: t('freeDayIntro'),
        steps: [{ prompt: t('freeDayPrompt'), instruction: t('freeDayInstruction') }],
        closingRitual: t('freeDayRitual'),
        why: t('freeDayWhy'),
        research: t('freeDayResearch'),
        tomorrow: ''
      }],
      closingMessage: ''
    };
  }

  function allArchetypes() { return BTJLang.archetypes().concat([freeArchetype()]); }

  function byId(id) {
    var found = null;
    allArchetypes().forEach(function (a) { if (a.id === id) found = a; });
    return found;
  }

  function el(id) { return document.getElementById(id); }

  function esc(text) {
    var d = document.createElement('div');
    d.textContent = text == null ? '' : String(text);
    return d.innerHTML;
  }

  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* ---------- navigazione ---------- */

  var SCREENS = ['welcome', 'candidates', 'quiz', 'archetypes', 'mirror', 'session', 'ritual', 'closing', 'journey', 'diary'];

  function showScreen(name) {
    currentScreen = name;
    SCREENS.forEach(function (s) {
      var node = el('screen-' + s);
      if (node) node.hidden = (s !== name);
    });
    /* niente distrazioni mentre si scrive */
    el('bottomnav').hidden = (name === 'session' || name === 'ritual');
    document.querySelectorAll('.nav-btn').forEach(function (b) {
      b.classList.toggle('active',
        (b.dataset.nav === name) ||
        (b.dataset.nav === 'welcome' && ['welcome', 'candidates', 'quiz', 'archetypes', 'mirror'].indexOf(name) !== -1));
    });
    if (name === 'welcome') renderBubbles();
    if (name === 'journey') renderJourney();
    if (name === 'diary') renderDiary();
    window.scrollTo(0, 0);
  }

  /* ---------- check-in: globi ---------- */

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function renderBubbles() {
    el('freetext-feedback').hidden = true;
    el('freetext-input').value = '';
    var field = el('bubble-field');
    field.innerHTML = '';
    /* al massimo un globo per archetipo alla volta: varietà garantita */
    var seen = {};
    var picks = [];
    shuffled(BTJLang.emotions()).forEach(function (e) {
      if (!seen[e.archetypeId] && byId(e.archetypeId)) {
        seen[e.archetypeId] = true;
        picks.push(e);
      }
    });
    shuffled(picks).forEach(function (e, i) {
      var b = document.createElement('button');
      b.className = 'bubble';
      b.type = 'button';
      b.setAttribute('role', 'listitem');
      b.textContent = e.label;
      b.style.setProperty('--float-dur', (4 + (i % 5) * 0.7) + 's');
      b.style.setProperty('--float-delay', ((i % 7) * -0.9) + 's');
      b.addEventListener('click', function () { goToMirror(e.archetypeId, e.label); });
      field.appendChild(b);
    });
  }

  /* ---------- check-in: testo libero ---------- */

  function matchFreeText(text) {
    var t = normalize(text);
    var meta = BTJLang.meta();
    var scores = {};
    Object.keys(meta).forEach(function (id) {
      if (!byId(id)) return;
      meta[id].keywords.forEach(function (kw) {
        if (t.indexOf(normalize(kw)) !== -1) scores[id] = (scores[id] || 0) + 1;
      });
    });
    var ranked = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    return { ranked: ranked, scores: scores };
  }

  function bindFreetextFeedback() {
    var qBtn = el('fb-quiz');
    var fBtn = el('fb-free');
    if (qBtn) qBtn.addEventListener('click', startQuiz);
    if (fBtn) fBtn.addEventListener('click', function () {
      startSessionFor(freeArchetype(), currentEmotionLabel);
    });
  }

  function handleFreeText() {
    var input = el('freetext-input');
    var text = input.value.trim();
    var feedback = el('freetext-feedback');
    if (!text) { input.focus(); return; }

    var match = matchFreeText(text);
    var ranked = match.ranked;
    currentEmotionLabel = text.length > 60 ? text.slice(0, 57) + '…' : text;

    /* se il primo archetipo domina nettamente, non chiediamo conferma */
    var clearWinner = ranked.length === 1 ||
      (ranked.length > 1 && match.scores[ranked[0]] >= match.scores[ranked[1]] + 2);

    if (clearWinner) {
      feedback.hidden = true;
      goToMirror(ranked[0], currentEmotionLabel);
    } else if (ranked.length > 1) {
      feedback.hidden = true;
      renderCandidates(ranked.slice(0, 3), currentEmotionLabel);
    } else {
      feedback.hidden = false;
      feedback.innerHTML = BTJLang.t('freetextNoMatch');
      bindFreetextFeedback();
    }
  }

  function renderCandidates(ids, emotionLabel) {
    var list = el('candidate-list');
    list.innerHTML = '';
    var meta = BTJLang.meta();
    ids.forEach(function (id) {
      var a = byId(id);
      if (!a) return;
      var m = meta[id] || {};
      var b = document.createElement('button');
      b.className = 'candidate';
      b.type = 'button';
      b.innerHTML = '<span class="c-name">' + (m.glyph ? m.glyph + ' ' : '') + esc(a.name) + '</span>' +
                    '<span class="c-line">' + esc(m.tagline || a.essence || '') + '</span>';
      b.addEventListener('click', function () { goToMirror(id, emotionLabel); });
      list.appendChild(b);
    });
    showScreen('candidates');
  }

  /* ---------- rispecchiamento ---------- */

  function nextDayFor(archetype) {
    var progress = BTJStore.getProgress()[archetype.id];
    var completed = progress ? progress.completedDays : [];
    for (var i = 0; i < archetype.days.length; i++) {
      if (completed.indexOf(archetype.days[i].day) === -1) return archetype.days[i];
    }
    /* percorso completo: si può sempre tornare — riparti da dove vuoi */
    return archetype.days[archetype.days.length - 1];
  }

  function goToMirror(archetypeId, emotionLabel) {
    var a = byId(archetypeId);
    if (!a) return;
    currentEmotionLabel = emotionLabel || '';
    BTJStore.setLastArchetype(a.id);
    renderMirror(a);
    showScreen('mirror');
  }

  function renderMirror(a) {
    el('mirror-kicker').textContent = currentEmotionLabel
      ? BTJLang.t('mirrorKickerWithEmotion', { emotion: currentEmotionLabel })
      : BTJLang.t('mirrorKickerDefault');
    el('mirror-name').textContent = a.name;
    el('mirror-essence').textContent = a.essence || '';

    var paragraphs = (a.description || '').split('\n').filter(Boolean);
    el('mirror-text').innerHTML = paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');

    var day = nextDayFor(a);
    el('btn-start-session').textContent = BTJLang.t('mirrorCta', { n: day.durationMinutes });
    el('mirror-cta-sub').textContent = BTJLang.t('mirrorCtaSub', { n: day.day, subject: day.subject || '' });
    el('btn-start-session').onclick = function () { startSessionFor(a, currentEmotionLabel); };
  }

  function startSessionFor(archetype, emotionLabel) {
    var day = nextDayFor(archetype);
    BTJSession.start({
      archetype: archetype,
      day: day,
      dayNumber: day.day,
      emotionLabel: emotionLabel || ''
    });
  }

  /* ---------- griglia archetipi ---------- */

  function renderArchetypeGrid() {
    var grid = el('archetype-grid');
    grid.innerHTML = '';
    var meta = BTJLang.meta();
    BTJLang.archetypes().forEach(function (a) {
      var m = meta[a.id] || {};
      var b = document.createElement('button');
      b.className = 'archetype-card';
      b.type = 'button';
      b.innerHTML = '<span class="a-glyph" aria-hidden="true">' + (m.glyph || '✎') + '</span>' +
                    '<span class="a-name">' + esc(a.name) + '</span>' +
                    '<span class="a-line">' + esc(m.tagline || '') + '</span>';
      b.addEventListener('click', function () { goToMirror(a.id, ''); });
      grid.appendChild(b);
    });
  }

  /* ---------- quiz ---------- */

  function startQuiz() {
    BTJQuiz.start();
    renderQuizQuestion();
    showScreen('quiz');
  }

  function renderQuizQuestion() {
    var q = BTJQuiz.current();
    el('quiz-progress').textContent = BTJQuiz.progress();
    el('quiz-question').textContent = q.q;
    var box = el('quiz-options');
    box.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var b = document.createElement('button');
      b.className = 'quiz-option';
      b.type = 'button';
      b.textContent = opt.label;
      b.addEventListener('click', function () {
        var result = BTJQuiz.answer(i);
        if (result) {
          goToMirror(result, '');
        } else {
          renderQuizQuestion();
        }
      });
      box.appendChild(b);
    });
  }

  /* ---------- percorso ---------- */

  var journeySelected = null;

  function renderJourney() {
    var returns = BTJStore.getReturns();
    el('returns-banner').textContent = returns === 0
      ? BTJLang.t('returnsBannerZero')
      : (returns === 1 ? BTJLang.t('returnsBannerOne') : BTJLang.t('returnsBannerN', { n: returns }));

    var archetypes = BTJLang.archetypes();
    var meta = BTJLang.meta();
    var progress = BTJStore.getProgress();
    var last = BTJStore.getLastArchetype();
    var visible = archetypes.filter(function (a) {
      return progress[a.id] || a.id === last;
    });
    if (visible.length === 0) visible = archetypes.slice(0, 3);
    if (!journeySelected || !byId(journeySelected)) {
      journeySelected = (last && byId(last) && last !== 'libero') ? last : visible[0].id;
    }
    if (visible.filter(function (a) { return a.id === journeySelected; }).length === 0) {
      var sel = byId(journeySelected);
      if (sel) visible.unshift(sel);
    }

    var picker = el('journey-archetype-picker');
    picker.innerHTML = '';
    visible.forEach(function (a) {
      var chip = document.createElement('button');
      chip.className = 'journey-chip' + (a.id === journeySelected ? ' active' : '');
      chip.type = 'button';
      var m = meta[a.id] || {};
      chip.textContent = (m.glyph ? m.glyph + ' ' : '') + a.name;
      chip.addEventListener('click', function () {
        journeySelected = a.id;
        renderJourney();
      });
      picker.appendChild(chip);
    });
    var allChip = document.createElement('button');
    allChip.className = 'journey-chip';
    allChip.type = 'button';
    allChip.textContent = BTJLang.t('allArchetypesChip');
    allChip.addEventListener('click', function () { renderArchetypeGrid(); showScreen('archetypes'); });
    picker.appendChild(allChip);

    var a = byId(journeySelected);
    var completed = (progress[a.id] || { completedDays: [] }).completedDays;
    var suggested = nextDayFor(a).day;

    var daysBox = el('journey-days');
    daysBox.innerHTML = '';
    var list = document.createElement('div');
    list.className = 'day-list';
    a.days.forEach(function (d) {
      var done = completed.indexOf(d.day) !== -1;
      var item = document.createElement('button');
      item.className = 'day-item' + (done ? ' done' : '') + (!done && d.day === suggested ? ' suggested' : '');
      item.type = 'button';
      item.innerHTML =
        '<span class="day-dot">' + (done ? '✓' : d.day) + '</span>' +
        '<span class="day-info">' +
          '<span class="day-name">' + esc(d.subject) + '</span>' +
          '<span class="day-sub">' + esc(BTJLang.t('dayMinutes', { n: d.durationMinutes })) + '</span>' +
        '</span>' +
        (!done && d.day === suggested ? '<span class="day-tag">' + esc(BTJLang.t('dayToday')) + '</span>' : '');
      item.addEventListener('click', function () {
        BTJSession.start({ archetype: a, day: d, dayNumber: d.day, emotionLabel: '' });
      });
      list.appendChild(item);
    });
    daysBox.appendChild(list);
  }

  /* ---------- diario ---------- */

  function renderDiary() {
    var listBox = el('diary-list');
    var entries = BTJStore.getEntries();
    if (entries.length === 0) {
      listBox.innerHTML = '<p class="diary-empty">' + esc(BTJLang.t('diaryEmpty')) + '</p>';
      return;
    }
    listBox.innerHTML = '';
    var dayLabel = BTJLang.t('entryDayLabel');
    var dateLocale = BTJLang.t('dateLocale');
    entries.forEach(function (e) {
      var a = byId(e.archetypeId);
      var details = document.createElement('details');
      details.className = 'entry';
      var stepsHtml = (e.steps || []).filter(function (s) { return s.text; }).map(function (s) {
        return '<div class="entry-step">' +
          '<p class="entry-prompt">' + esc(s.prompt) + '</p>' +
          '<p class="entry-text">' + esc(s.text) + '</p>' +
        '</div>';
      }).join('');
      details.innerHTML =
        '<summary>' +
          '<span class="entry-date">' + new Date(e.ts).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long' }) + '</span>' +
          '<span class="entry-title">' + esc(a ? a.name : '') + ' · ' + dayLabel + e.day + '</span>' +
          (e.emotionLabel ? '<span class="entry-emotion">«' + esc(e.emotionLabel) + '»</span>' : '') +
        '</summary>' +
        '<div class="entry-body">' +
          stepsHtml +
          (e.circled ? '<p class="entry-circled">✎ ' + esc(e.circled) + '</p>' : '') +
          '<div class="entry-tools"><button class="link-btn entry-delete">' + esc(BTJLang.t('entryDelete')) + '</button></div>' +
        '</div>';
      details.querySelector('.entry-delete').addEventListener('click', function () {
        if (confirm(BTJLang.t('entryDeleteConfirm'))) {
          BTJStore.deleteEntry(e.id);
          renderDiary();
        }
      });
      listBox.appendChild(details);
    });
  }

  function exportDiary() {
    var text = BTJStore.exportText(allArchetypes());
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'back-to-journal-diario.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /* ---------- cambio lingua ---------- */

  function rerenderCurrentScreen() {
    if (BTJSession.isActive() && (currentScreen === 'session' || currentScreen === 'ritual')) {
      BTJSession.relanguage();
      return;
    }
    if (currentScreen === 'mirror') {
      var last = BTJStore.getLastArchetype();
      var a = byId(last) || byId('architetto');
      if (a) renderMirror(a);
      return;
    }
    if (currentScreen === 'archetypes') { renderArchetypeGrid(); return; }
    if (currentScreen === 'quiz') { renderQuizQuestion(); return; }
    /* welcome/candidates/journey/diary si ridisegnano già dentro showScreen */
    showScreen(currentScreen);
  }

  /* ---------- avvio ---------- */

  function greeting() {
    var h = new Date().getHours();
    if (h >= 5 && h < 13) return BTJLang.t('greetingMorning');
    if (h >= 13 && h < 18) return BTJLang.t('greetingAfternoon');
    if (h >= 18 && h < 23) return BTJLang.t('greetingEvening');
    return BTJLang.t('greetingLate');
  }

  document.addEventListener('DOMContentLoaded', function () {
    BTJLang.applyStatic();
    el('greeting').textContent = greeting();

    el('btn-home').addEventListener('click', function () { showScreen('welcome'); });
    el('btn-shuffle').addEventListener('click', renderBubbles);
    el('btn-freetext').addEventListener('click', handleFreeText);
    el('freetext-input').addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') handleFreeText();
    });

    el('btn-know-archetype').addEventListener('click', function () {
      renderArchetypeGrid();
      showScreen('archetypes');
    });
    el('btn-quiz').addEventListener('click', startQuiz);
    el('btn-quiz-2').addEventListener('click', startQuiz);
    el('btn-quiz-back').addEventListener('click', function () { showScreen('welcome'); });
    el('btn-archetypes-back').addEventListener('click', function () { showScreen('welcome'); });
    el('btn-candidates-back').addEventListener('click', function () { showScreen('welcome'); });
    el('btn-mirror-back').addEventListener('click', function () { showScreen('welcome'); });

    el('btn-closing-journey').addEventListener('click', function () { showScreen('journey'); });
    el('btn-closing-home').addEventListener('click', function () { showScreen('welcome'); });

    el('btn-export').addEventListener('click', exportDiary);

    document.querySelectorAll('.nav-btn').forEach(function (b) {
      b.addEventListener('click', function () { showScreen(b.dataset.nav); });
    });

    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.addEventListener('click', function () { BTJLang.set(b.dataset.lang); });
    });
    BTJLang.onChange(function () {
      el('greeting').textContent = greeting();
      rerenderCurrentScreen();
    });

    showScreen('welcome');
  });

  return {
    showScreen: showScreen,
    goToMirror: goToMirror
  };
})();
