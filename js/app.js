/* Back to Journal — orchestratore dell'app.
   Check-in emotivo → rispecchiamento → sessione → percorso/diario. */

var BTJApp = (function () {
  var currentEmotionLabel = '';

  /* Sessione di scrittura libera, per chi non si riconosce (ancora) in un archetipo. */
  var FREE_ARCHETYPE = {
    id: 'libero',
    name: 'Scrittura libera',
    essence: 'Nessuna etichetta. Solo spazio.',
    description: 'A volte non serve un nome. Serve solo un posto dove mettere quello che c’è.',
    days: [{
      day: 1,
      subject: 'Scarico libero',
      durationMinutes: 5,
      intro: 'Oggi non analizziamo nulla. Non risolviamo. Non sistemiamo.\nFacciamo solo spazio.',
      steps: [{
        prompt: 'In questo momento, dentro di me c’è…',
        instruction: 'Scrivi tutto. Senza ordine. Senza filtri. Non deve avere un filo logico.'
      }],
      closingRitual: 'Rileggi e tocca una sola frase. Non la più importante. Quella che ti sorprende di più.',
      why: 'Le emozioni che non hanno un nome non smettono di esistere: continuano a lavorare sotto la superficie. Metterle in parole le ferma sulla carta.',
      research: 'James Pennebaker (University of Texas): la scrittura espressiva riduce il carico cognitivo e abbassa i livelli di stress.',
      tomorrow: ''
    }],
    closingMessage: ''
  };

  function allArchetypes() { return BTJ_ARCHETYPES.concat([FREE_ARCHETYPE]); }

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
    shuffled(BTJ_EMOTIONS).forEach(function (e) {
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
    var scores = {};
    Object.keys(BTJ_META).forEach(function (id) {
      if (!byId(id)) return;
      BTJ_META[id].keywords.forEach(function (kw) {
        if (t.indexOf(normalize(kw)) !== -1) scores[id] = (scores[id] || 0) + 1;
      });
    });
    var ranked = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    return { ranked: ranked, scores: scores };
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
      feedback.innerHTML = 'Grazie per averlo scritto. Non ho trovato una corrispondenza precisa — puoi provare la ' +
        '<button class="inline-link" id="fb-quiz">piccola bussola</button> oppure ' +
        '<button class="inline-link" id="fb-free">iniziare a scrivere così come sei</button>.';
      el('fb-quiz').addEventListener('click', startQuiz);
      el('fb-free').addEventListener('click', function () {
        startSessionFor(FREE_ARCHETYPE, currentEmotionLabel);
      });
    }
  }

  function renderCandidates(ids, emotionLabel) {
    var list = el('candidate-list');
    list.innerHTML = '';
    ids.forEach(function (id) {
      var a = byId(id);
      if (!a) return;
      var meta = BTJ_META[id] || {};
      var b = document.createElement('button');
      b.className = 'candidate';
      b.type = 'button';
      b.innerHTML = '<span class="c-name">' + (meta.glyph ? meta.glyph + ' ' : '') + esc(a.name) + '</span>' +
                    '<span class="c-line">' + esc(meta.tagline || a.essence || '') + '</span>';
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

    el('mirror-kicker').textContent = emotionLabel
      ? '«' + emotionLabel + '» — quello che senti ha un nome'
      : 'Quello che senti ha un nome';
    el('mirror-name').textContent = a.name;
    el('mirror-essence').textContent = a.essence || '';

    var paragraphs = (a.description || '').split('\n').filter(Boolean);
    el('mirror-text').innerHTML = paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');

    var day = nextDayFor(a);
    el('btn-start-session').textContent = 'Iniziamo — bastano ' + day.durationMinutes + ' minuti';
    el('mirror-cta-sub').textContent = 'Giorno ' + day.day + ' · ' + (day.subject || '');
    el('btn-start-session').onclick = function () { startSessionFor(a, currentEmotionLabel); };

    showScreen('mirror');
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
    BTJ_ARCHETYPES.forEach(function (a) {
      var meta = BTJ_META[a.id] || {};
      var b = document.createElement('button');
      b.className = 'archetype-card';
      b.type = 'button';
      b.innerHTML = '<span class="a-glyph" aria-hidden="true">' + (meta.glyph || '✎') + '</span>' +
                    '<span class="a-name">' + esc(a.name) + '</span>' +
                    '<span class="a-line">' + esc(meta.tagline || '') + '</span>';
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
      ? 'Il quaderno ti aspetta. Senza fretta.'
      : (returns === 1 ? 'Sei tornato 1 volta.' : 'Sei tornato ' + returns + ' volte.');

    var progress = BTJStore.getProgress();
    var last = BTJStore.getLastArchetype();
    var visible = BTJ_ARCHETYPES.filter(function (a) {
      return progress[a.id] || a.id === last;
    });
    if (visible.length === 0) visible = BTJ_ARCHETYPES.slice(0, 3);
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
      var meta = BTJ_META[a.id] || {};
      chip.textContent = (meta.glyph ? meta.glyph + ' ' : '') + a.name;
      chip.addEventListener('click', function () {
        journeySelected = a.id;
        renderJourney();
      });
      picker.appendChild(chip);
    });
    var allChip = document.createElement('button');
    allChip.className = 'journey-chip';
    allChip.type = 'button';
    allChip.textContent = '+ tutti gli archetipi';
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
          '<span class="day-sub">' + d.durationMinutes + ' minuti</span>' +
        '</span>' +
        (!done && d.day === suggested ? '<span class="day-tag">oggi</span>' : '');
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
      listBox.innerHTML = '<p class="diary-empty">Ancora nessuna pagina. La prima è la più leggera: inizia da come ti senti.</p>';
      return;
    }
    listBox.innerHTML = '';
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
          '<span class="entry-date">' + new Date(e.ts).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }) + '</span>' +
          '<span class="entry-title">' + esc(a ? a.name : '') + ' · G' + e.day + '</span>' +
          (e.emotionLabel ? '<span class="entry-emotion">«' + esc(e.emotionLabel) + '»</span>' : '') +
        '</summary>' +
        '<div class="entry-body">' +
          stepsHtml +
          (e.circled ? '<p class="entry-circled">✎ ' + esc(e.circled) + '</p>' : '') +
          '<div class="entry-tools"><button class="link-btn entry-delete">elimina</button></div>' +
        '</div>';
      details.querySelector('.entry-delete').addEventListener('click', function () {
        if (confirm('Eliminare questa pagina? Non potrà essere recuperata.')) {
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

  /* ---------- avvio ---------- */

  function greeting() {
    var h = new Date().getHours();
    if (h >= 5 && h < 13) return 'Buongiorno.';
    if (h >= 13 && h < 18) return 'Buon pomeriggio.';
    if (h >= 18 && h < 23) return 'Buonasera.';
    return 'È tardi. O forse è presto. Va bene comunque.';
  }

  document.addEventListener('DOMContentLoaded', function () {
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

    showScreen('welcome');
  });

  return {
    showScreen: showScreen,
    goToMirror: goToMirror
  };
})();
