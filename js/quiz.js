/* Back to Journal — mini bussola (quiz breve).
   Quattro domande sul modo di funzionare, non sui sintomi.
   Ogni opzione pesa su uno o più archetipi; vince il punteggio più alto. */

var BTJQuiz = (function () {
  var QUESTIONS = [
    {
      q: 'In questo momento, la tua testa com’è?',
      options: [
        { label: 'Piena di pensieri che girano in cerchio', weights: { architetto: 2, tessitore: 1 } },
        { label: 'Piena di idee e progetti che si accavallano', weights: { 'ladro-di-scintille': 2, sognatore: 1 } },
        { label: 'Piena di cose che sento e non dico', weights: { custode: 2, sismografo: 1 } }
      ]
    },
    {
      q: 'Cosa ti pesa di più, ultimamente?',
      options: [
        { label: 'La distanza tra dove sono e dove vorrei essere', weights: { sognatore: 2, forgiatore: 1 } },
        { label: 'Non riuscire a essere costante', weights: { costruttore: 2, forgiatore: 1 } },
        { label: 'Gli alti e bassi che non controllo', weights: { viaggiatore: 2, sismografo: 1 } }
      ]
    },
    {
      q: 'Quando succede qualcosa, tu di solito…',
      options: [
        { label: 'Costruisco scenari su cosa potrebbe andare storto', weights: { architetto: 2 } },
        { label: 'Ci costruisco sopra una storia, un significato', weights: { tessitore: 2 } },
        { label: 'Assorbo l’atmosfera e le emozioni di chi c’è', weights: { sismografo: 2, custode: 1 } }
      ]
    },
    {
      q: 'Cosa cerchi, più di tutto?',
      options: [
        { label: 'Sentirmi al sicuro senza dover controllare tutto', weights: { architetto: 2, custode: 1 } },
        { label: 'Qualcosa che regga, giorno dopo giorno', weights: { costruttore: 2, forgiatore: 2 } },
        { label: 'Dare forma a ciò che vedo e sento dentro', weights: { sognatore: 2, 'ladro-di-scintille': 2, tessitore: 1 } }
      ]
    }
  ];

  var scores = {};
  var index = 0;

  return {
    start: function () {
      scores = {};
      index = 0;
    },

    current: function () { return QUESTIONS[index]; },

    progress: function () { return (index + 1) + ' di ' + QUESTIONS.length; },

    /* Registra la risposta; ritorna l'id dell'archetipo vincente quando finito, altrimenti null. */
    answer: function (optionIdx) {
      var opt = QUESTIONS[index].options[optionIdx];
      Object.keys(opt.weights).forEach(function (id) {
        scores[id] = (scores[id] || 0) + opt.weights[id];
      });
      index += 1;
      if (index < QUESTIONS.length) return null;

      var best = null, bestScore = -1;
      Object.keys(scores).forEach(function (id) {
        if (scores[id] > bestScore) { best = id; bestScore = scores[id]; }
      });
      return best || 'architetto';
    }
  };
})();
