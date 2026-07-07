/* Back to Journal — motore della sessione guidata, bilingue.
   Un esercizio alla volta: intro → passi di scrittura → rituale → chiusura.
   Il timer è morbido: quando finisce non suona, suggerisce. */

var BTJSession = (function () {
  var state = null;
  var timerInterval = null;
  var encourageTimeout = null;

  function el(id) { return document.getElementById(id); }
  function t(key, vars) { return BTJLang.t(key, vars); }

  function esc(text) {
    var d = document.createElement('div');
    d.textContent = text == null ? '' : String(text);
    return d.innerHTML;
  }

  /* trova lo stesso archetipo/giorno nella lingua indicata, tramite id condiviso */
  function findInLang(archetypeId, dayNumber) {
    var list = BTJLang.archetypes();
    var a = null;
    for (var i = 0; i < list.length; i++) { if (list[i].id === archetypeId) { a = list[i]; break; } }
    if (!a) return null;
    var d = null;
    for (var j = 0; j < a.days.length; j++) { if (a.days[j].day === dayNumber) { d = a.days[j]; break; } }
    return d ? { archetype: a, day: d } : null;
  }

  /* ---------- timer morbido ---------- */

  function startTimer(minutes) {
    stopTimer();
    var total = Math.max(1, minutes) * 60;
    state.timerTotal = total;
    state.timerLeft = total;
    el('session-timer').classList.remove('done');
    renderTimer();
    timerInterval = setInterval(function () {
      state.timerLeft -= 1;
      if (state.timerLeft <= 0) {
        state.timerLeft = 0;
        stopTimer();
        el('session-timer').classList.add('done');
        el('timer-label').textContent = '·';
        encourage(t('encourageTimeout'));
        return;
      }
      renderTimer();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function renderTimer() {
    var m = Math.floor(state.timerLeft / 60);
    var s = state.timerLeft % 60;
    el('timer-label').textContent = m + ':' + (s < 10 ? '0' : '') + s;
    var circumference = 119.4;
    var progress = 1 - state.timerLeft / state.timerTotal;
    el('timer-ring').style.strokeDashoffset = String(circumference * (1 - progress));
  }

  /* ---------- incoraggiamenti discreti ---------- */

  function encourage(msg) {
    var box = document.querySelector('.session-encourage');
    if (box) box.textContent = msg;
  }

  function scheduleEncourage(textarea) {
    clearTimeout(encourageTimeout);
    encourageTimeout = setTimeout(function () {
      var keys = textarea.value.trim()
        ? ['encouragePause1', 'encouragePause2', 'encouragePause3']
        : ['encourageEmpty1', 'encourageEmpty2', 'encourageEmpty3'];
      encourage(t(keys[Math.floor(Math.random() * keys.length)]));
    }, textarea.value.trim() ? 35000 : 18000);
  }

  /* ---------- fasi ---------- */

  function start(opts) {
    state = {
      archetype: opts.archetype,
      dayNumber: opts.dayNumber,
      day: opts.day,
      emotionLabel: opts.emotionLabel || '',
      phase: 'intro', /* intro | step | ritual */
      stepIndex: -1,
      responses: opts.day.steps.map(function () { return ''; }),
      startedAt: Date.now(),
      circled: ''
    };

    /* riprendi la bozza se stavi scrivendo proprio questo esercizio */
    var draft = BTJStore.getDraft();
    if (draft && draft.archetypeId === opts.archetype.id && draft.day === opts.dayNumber) {
      state.responses = opts.day.steps.map(function (_, i) { return (draft.responses || [])[i] || ''; });
    }

    el('timer-label').textContent = opts.day.durationMinutes + ':00';
    el('timer-ring').style.strokeDashoffset = '119.4';
    el('session-timer').classList.remove('done');

    renderIntro();
    BTJApp.showScreen('session');
  }

  function renderIntro() {
    state.phase = 'intro';
    var day = state.day;
    el('session-kicker').textContent = t('sessionKicker', { archetype: state.archetype.name, n: state.dayNumber });
    var introHtml = (day.intro || '').split('\n').filter(Boolean)
      .map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');

    el('session-body').innerHTML =
      '<div class="session-card session-intro">' +
        '<p class="step-count">' + esc(day.subject) + '</p>' +
        introHtml +
        '<p class="hint" style="margin-top:14px">' + esc(t('introHint', { n: day.durationMinutes })) + '</p>' +
        '<div class="session-actions">' +
          '<button class="btn btn-primary btn-big" id="btn-step-begin">' + esc(t('beginBtn')) + '</button>' +
        '</div>' +
      '</div>';

    el('btn-step-begin').addEventListener('click', function () {
      startTimer(day.durationMinutes);
      showStep(0);
    });
  }

  function showStep(i) {
    state.phase = 'step';
    state.stepIndex = i;
    var day = state.day;
    var step = day.steps[i];
    var isLast = i === day.steps.length - 1;
    el('session-kicker').textContent = t('sessionKicker', { archetype: state.archetype.name, n: state.dayNumber });
    var stepCount = day.steps.length > 1
      ? '<p class="step-count">' + esc(t('stepCount', { i: i + 1, n: day.steps.length })) + '</p>' : '';

    el('session-body').innerHTML =
      '<div class="session-card">' +
        stepCount +
        (step.instruction ? '<p class="step-instruction">' + esc(step.instruction) + '</p>' : '') +
        '<p class="step-prompt">' + esc(step.prompt) + '</p>' +
        '<textarea class="step-textarea" id="step-textarea" placeholder="' + esc(t('textareaPlaceholder')) + '" ' +
          'autocapitalize="sentences" autocomplete="off" spellcheck="false"></textarea>' +
        '<p class="session-encourage" aria-live="polite"></p>' +
        '<div class="session-actions">' +
          '<button class="btn btn-primary" id="btn-step-next">' + esc(isLast ? t('finishBtn') : t('nextBtn')) + '</button>' +
          '<button class="link-btn" id="btn-step-leave">' + esc(t('leaveLink')) + '</button>' +
        '</div>' +
      '</div>';

    var textarea = el('step-textarea');
    textarea.value = state.responses[i] || '';
    textarea.focus();

    textarea.addEventListener('input', function () {
      state.responses[i] = textarea.value;
      BTJStore.saveDraft({
        archetypeId: state.archetype.id,
        day: state.dayNumber,
        responses: state.responses
      });
      encourage('');
      scheduleEncourage(textarea);
    });
    scheduleEncourage(textarea);

    el('btn-step-next').addEventListener('click', function () {
      state.responses[i] = textarea.value;
      clearTimeout(encourageTimeout);
      if (isLast) {
        finishWriting();
      } else {
        showStep(i + 1);
      }
    });

    el('btn-step-leave').addEventListener('click', function () {
      if (confirm(t('leaveConfirm'))) {
        stopTimer();
        clearTimeout(encourageTimeout);
        BTJStore.clearDraft();
        BTJApp.showScreen('welcome');
      }
    });
  }

  /* ---------- rituale di chiusura ----------
     I gesti del metodo, adattati al digitale (riconoscimento bilingue IT/ES):
     - "cerchia"/"encierra" o "tocca"/"toca" una frase   → tocca una frase
     - "sottolinea"/"subraya" una parola                  → tocca una parola
     - "con una M ... con una A"                          → tocca per marcare: mia / assorbita
     - "chiudi con"/"cierra con" «…»                      → sigillo: la frase chiude la pagina
     - solo "chiudi il quaderno"/"cierra el cuaderno" ecc → nessuna interazione: si passa alla chiusura */

  function classifyRitual(text) {
    var t = text.toLowerCase();
    if (t.indexOf('con una m') !== -1 && t.indexOf('con una a') !== -1) return 'tag-ma';
    if (t.indexOf('cerchia') !== -1 || t.indexOf('encierra') !== -1 ||
        t.indexOf('tocca la') !== -1 || t.indexOf('toca la') !== -1) return 'select-sentence';
    if (t.indexOf('sottolinea') !== -1 || t.indexOf('subraya') !== -1) {
      return (t.indexOf('parola') !== -1 || t.indexOf('palabra') !== -1) ? 'select-word' : 'select-sentence';
    }
    if (t.indexOf('chiudi scrivendo') !== -1 || t.indexOf('chiudi con') !== -1 ||
        t.indexOf('cierra escribiendo') !== -1 || t.indexOf('cierra con') !== -1) return 'seal';
    return 'none';
  }

  function splitFragments(text) {
    var fragments = [];
    var current = '';
    for (var k = 0; k < text.length; k++) {
      current += text[k];
      if ('.!?…;\n'.indexOf(text[k]) !== -1) {
        if (current.trim().length > 1) fragments.push(current.trim());
        current = '';
      }
    }
    if (current.trim().length > 1) fragments.push(current.trim());
    return fragments;
  }

  function splitWords(text) {
    var seen = {};
    var out = [];
    text.split(/[\s.,;:!?…"«»()\[\]¿¡]+/).forEach(function (w) {
      var key = w.toLowerCase();
      if (w.length > 3 && !seen[key]) { seen[key] = true; out.push(w); }
    });
    return out;
  }

  function extractSealPhrase(ritual) {
    var m = ritual.match(/[“"«]([^”"»]+)[”"»]/);
    return m ? m[1].trim() : '';
  }

  function renderSelectRitual(ritual, fragments, isWords) {
    el('ritual-title').textContent = ritual;
    el('ritual-hint').textContent = isWords ? t('ritualHintWord') : t('ritualHintSentence');
    var box = el('ritual-fragments');
    box.className = 'ritual-fragments' + (isWords ? ' words' : '');
    box.innerHTML = '';
    el('btn-ritual-done').disabled = true;

    fragments.slice(0, isWords ? 40 : 24).forEach(function (frag) {
      var b = document.createElement('button');
      b.className = 'fragment' + (isWords ? ' word' : '');
      b.type = 'button';
      b.textContent = frag;
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(box.children, function (c) { c.classList.remove('circled'); });
        b.classList.add('circled');
        state.circled = frag;
        el('btn-ritual-done').disabled = false;
      });
      box.appendChild(b);
    });
    BTJApp.showScreen('ritual');
  }

  function renderTagRitual(ritual, fragments) {
    el('ritual-title').textContent = ritual;
    el('ritual-hint').textContent = t('ritualHintTagMa');
    var box = el('ritual-fragments');
    box.className = 'ritual-fragments';
    box.innerHTML = '';
    el('btn-ritual-done').disabled = true;
    var tags = {};

    function updateCircled() {
      var parts = [];
      fragments.forEach(function (frag, idx) {
        if (tags[idx]) parts.push((tags[idx] === 'M' ? t('tagMia') : t('tagAssorbita')) + ' ' + frag);
      });
      state.circled = parts.join(' · ');
      el('btn-ritual-done').disabled = parts.length === 0;
    }

    fragments.slice(0, 24).forEach(function (frag, idx) {
      var b = document.createElement('button');
      b.className = 'fragment';
      b.type = 'button';
      b.textContent = frag;
      b.addEventListener('click', function () {
        tags[idx] = tags[idx] === 'M' ? 'A' : (tags[idx] === 'A' ? null : 'M');
        b.classList.toggle('tag-m', tags[idx] === 'M');
        b.classList.toggle('tag-a', tags[idx] === 'A');
        updateCircled();
      });
      box.appendChild(b);
    });
    BTJApp.showScreen('ritual');
  }

  function renderSealRitual(ritual, phrase) {
    el('ritual-title').textContent = ritual;
    el('ritual-hint').textContent = t('ritualHintSeal');
    var box = el('ritual-fragments');
    box.className = 'ritual-fragments';
    box.innerHTML = '<p class="seal-phrase">«' + esc(phrase) + '»</p>';
    state.circled = phrase;
    var done = el('btn-ritual-done');
    done.disabled = false;
    done.textContent = t('ritualSealBtn');
    BTJApp.showScreen('ritual');
  }

  function finishWriting() {
    stopTimer();
    state.phase = 'ritual';
    var allText = state.responses.join('\n').trim();
    var ritual = (state.day.closingRitual || '').trim();
    var type = ritual ? classifyRitual(ritual) : 'none';
    el('btn-ritual-done').textContent = t('ritualDone');

    if (type === 'seal') {
      var phrase = extractSealPhrase(ritual);
      if (phrase) { renderSealRitual(ritual, phrase); return; }
      type = 'none';
    }

    if (type === 'none' || !allText) { finishSession(); return; }

    if (type === 'tag-ma') {
      var sentences = splitFragments(allText);
      if (sentences.length < 1) { finishSession(); return; }
      renderTagRitual(ritual, sentences);
      return;
    }

    var isWords = type === 'select-word';
    var fragments = isWords ? splitWords(allText) : splitFragments(allText);
    if (fragments.length < 2) { finishSession(); return; }
    renderSelectRitual(ritual, fragments, isWords);
  }

  function finishSession() {
    if (!state || state.finished) return; /* doppio tocco: una sola pagina */
    state.finished = true;
    state.phase = 'done';
    var day = state.day;
    var entry = {
      id: 'e' + Date.now() + Math.random().toString(36).slice(2, 7),
      ts: Date.now(),
      archetypeId: state.archetype.id,
      day: state.dayNumber,
      emotionLabel: state.emotionLabel,
      steps: day.steps.map(function (s, i) {
        return { prompt: s.prompt, text: (state.responses[i] || '').trim() };
      }),
      circled: state.circled,
      durationSec: Math.round((Date.now() - state.startedAt) / 1000)
    };

    var wroteSomething = entry.steps.some(function (s) { return s.text; });
    if (wroteSomething) BTJStore.saveEntry(entry);
    BTJStore.markDayDone(state.archetype.id, state.dayNumber);
    BTJStore.clearDraft();
    var returns = BTJStore.recordReturn();

    el('closing-why').textContent = day.why || '';
    el('closing-research').textContent = day.research || '';
    var tomorrowCard = el('tomorrow-card');
    var tomorrowKicker = tomorrowCard.querySelector('.card-kicker');
    if (state.dayNumber >= state.archetype.days.length && state.archetype.closingMessage) {
      tomorrowCard.hidden = false;
      tomorrowKicker.textContent = t('pathEndKicker');
      el('closing-tomorrow').textContent = state.archetype.closingMessage;
    } else if (day.tomorrow) {
      tomorrowCard.hidden = false;
      tomorrowKicker.textContent = t('tomorrowKicker');
      el('closing-tomorrow').textContent = day.tomorrow;
    } else {
      tomorrowCard.hidden = true;
    }

    el('closing-returns').textContent = returns === 1 ? t('returnsFirst') : t('returnsN', { n: returns });

    BTJApp.showScreen('closing');
    BTJApp.refreshNavBadges && BTJApp.refreshNavBadges();
  }

  /* ---------- cambio lingua a metà sessione ----------
     Il testo già scritto dall'utente (state.responses) non cambia mai:
     è suo. Cambiano solo i testi dell'archetipo/giorno e dell'interfaccia. */

  function relanguage() {
    if (!state) return;
    var found = findInLang(state.archetype.id, state.dayNumber);
    if (!found) return;
    state.archetype = found.archetype;
    state.day = found.day;

    if (state.phase === 'intro') {
      renderIntro();
    } else if (state.phase === 'step') {
      showStep(state.stepIndex);
    } else if (state.phase === 'ritual') {
      finishWriting();
    }
  }

  /* rituale: bottoni (registrati una sola volta) */
  document.addEventListener('DOMContentLoaded', function () {
    el('btn-ritual-done').addEventListener('click', finishSession);
    el('btn-ritual-skip').addEventListener('click', function () {
      state.circled = '';
      finishSession();
    });
  });

  return { start: start, relanguage: relanguage, isActive: function () { return !!state && state.phase !== 'done'; } };
})();
