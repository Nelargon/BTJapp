/* Back to Journal — persistenza locale.
   Tutto resta sul dispositivo: nessun account, nessun server. */

var BTJStore = (function () {
  var KEYS = {
    entries: 'btj.entries',
    progress: 'btj.progress',
    returns: 'btj.returns',
    draft: 'btj.draft',
    lastArchetype: 'btj.lastArchetype',
    lastGreetingDate: 'btj.lastGreetingDate'
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* quota piena o storage disabilitato: l'app continua, senza salvare */
    }
  }

  return {
    getEntries: function () { return read(KEYS.entries, []); },

    saveEntry: function (entry) {
      var entries = read(KEYS.entries, []);
      entries.unshift(entry);
      write(KEYS.entries, entries);
    },

    deleteEntry: function (id) {
      var entries = read(KEYS.entries, []).filter(function (e) { return e.id !== id; });
      write(KEYS.entries, entries);
    },

    getProgress: function () { return read(KEYS.progress, {}); },

    markDayDone: function (archetypeId, day) {
      var progress = read(KEYS.progress, {});
      var p = progress[archetypeId] || { completedDays: [] };
      if (p.completedDays.indexOf(day) === -1) p.completedDays.push(day);
      p.completedDays.sort(function (a, b) { return a - b; });
      progress[archetypeId] = p;
      write(KEYS.progress, progress);
    },

    /* "Ritorni": giorni distinti in cui hai scritto. Mai una streak. */
    recordReturn: function () {
      var r = read(KEYS.returns, { dates: [] });
      var today = new Date().toISOString().slice(0, 10);
      if (r.dates.indexOf(today) === -1) r.dates.push(today);
      write(KEYS.returns, r);
      return r.dates.length;
    },

    getReturns: function () { return read(KEYS.returns, { dates: [] }).dates.length; },

    getDraft: function () { return read(KEYS.draft, null); },
    saveDraft: function (draft) { write(KEYS.draft, draft); },
    clearDraft: function () { try { localStorage.removeItem(KEYS.draft); } catch (e) {} },

    getLastArchetype: function () { return read(KEYS.lastArchetype, null); },
    setLastArchetype: function (id) { write(KEYS.lastArchetype, id); },

    /* saluto speciale del giorno: una sola volta, il primo accesso di ogni giornata */
    getLastGreetingDate: function () { return read(KEYS.lastGreetingDate, null); },
    setLastGreetingDate: function (d) { write(KEYS.lastGreetingDate, d); },

    exportText: function (archetypes) {
      var byId = {};
      (archetypes || []).forEach(function (a) { byId[a.id] = a; });
      var lang = BTJLang.get();
      var dayWord = lang === 'es' ? 'Día' : 'Giorno';
      var circledWord = lang === 'es' ? '✎ Marcado: ' : '✎ Cerchiato: ';
      var lines = [BTJLang.t('exportHeader'), ''];
      this.getEntries().slice().reverse().forEach(function (e) {
        var a = byId[e.archetypeId];
        lines.push('────────────────────────────');
        lines.push(new Date(e.ts).toLocaleString(BTJLang.t('dateLocale')));
        lines.push((a ? a.name : e.archetypeId) + ' — ' + dayWord + ' ' + e.day + (e.emotionLabel ? ' — «' + e.emotionLabel + '»' : ''));
        lines.push('');
        (e.steps || []).forEach(function (s) {
          if (s.prompt) lines.push(s.prompt);
          lines.push(s.text || '');
          lines.push('');
        });
        if (e.circled) lines.push(circledWord + e.circled + '\n');
      });
      return lines.join('\n');
    }
  };
})();
