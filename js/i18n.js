/* Back to Journal — selettore lingua / selector de idioma.
   Persiste la preferenza; fornisce t() per i template e riapplica le
   traduzioni statiche quando la lingua cambia. */

var BTJLang = (function () {
  var KEY = 'btj.lang';
  var SUPPORTED = ['it', 'es'];
  var listeners = [];

  var current = (function () {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    /* il brand nasce italiano, ma il pubblico ispanofono è più ampio:
       partiamo in spagnolo salvo che il browser sia esplicitamente italiano. */
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('it') === 0 ? 'it' : 'es';
  })();

  function t(key, vars) {
    var dict = BTJ_STRINGS[current] || BTJ_STRINGS.it;
    var str = dict[key] != null ? dict[key] : (BTJ_STRINGS.it[key] || key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.split('{' + k + '}').join(vars[k]);
      });
    }
    return str;
  }

  function applyStatic() {
    document.documentElement.setAttribute('lang', current);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === current);
    });
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1 || lang === current) return;
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    applyStatic();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function onChange(fn) { listeners.push(fn); }

  return {
    t: t,
    get: function () { return current; },
    set: set,
    applyStatic: applyStatic,
    onChange: onChange,
    archetypes: function () { return BTJ_ARCHETYPES[current]; },
    meta: function () { return BTJ_META[current]; },
    emotions: function () { return BTJ_EMOTIONS[current]; }
  };
})();
