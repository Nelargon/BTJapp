/* Back to Journal — mini bussola (quiz breve), bilingue.
   Quattro domande sul modo di funzionare, non sui sintomi.
   Il testo cambia per lingua; i pesi verso gli archetipi restano identici. */

var BTJQuiz = (function () {
  var QUESTIONS = {
    it: [
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
    ],

    es: [
      {
        q: '¿Cómo está tu cabeza en este momento?',
        options: [
          { label: 'Llena de pensamientos que dan vueltas en círculo', weights: { architetto: 2, tessitore: 1 } },
          { label: 'Llena de ideas y proyectos que se superponen', weights: { 'ladro-di-scintille': 2, sognatore: 1 } },
          { label: 'Llena de cosas que siento y no digo', weights: { custode: 2, sismografo: 1 } }
        ]
      },
      {
        q: '¿Qué es lo que más te pesa, últimamente?',
        options: [
          { label: 'La distancia entre donde estoy y donde querría estar', weights: { sognatore: 2, forgiatore: 1 } },
          { label: 'No lograr ser constante', weights: { costruttore: 2, forgiatore: 1 } },
          { label: 'Los altibajos que no controlo', weights: { viaggiatore: 2, sismografo: 1 } }
        ]
      },
      {
        q: 'Cuando pasa algo, tú normalmente…',
        options: [
          { label: 'Construyo escenarios sobre lo que podría salir mal', weights: { architetto: 2 } },
          { label: 'Le construyo encima una historia, un significado', weights: { tessitore: 2 } },
          { label: 'Absorbo la atmósfera y las emociones de quien está ahí', weights: { sismografo: 2, custode: 1 } }
        ]
      },
      {
        q: '¿Qué buscas, más que nada?',
        options: [
          { label: 'Sentirme seguro sin tener que controlarlo todo', weights: { architetto: 2, custode: 1 } },
          { label: 'Algo que aguante, día tras día', weights: { costruttore: 2, forgiatore: 2 } },
          { label: 'Dar forma a lo que veo y siento por dentro', weights: { sognatore: 2, 'ladro-di-scintille': 2, tessitore: 1 } }
        ]
      }
    ]
  };

  var scores = {};
  var index = 0;

  function questions() { return QUESTIONS[BTJLang.get()] || QUESTIONS.it; }

  return {
    start: function () {
      scores = {};
      index = 0;
    },

    current: function () { return questions()[index]; },

    progress: function () { return BTJLang.t('quizProgress', { i: index + 1, n: questions().length }); },

    /* Registra la risposta; ritorna l'id dell'archetipo vincente quando finito, altrimenti null. */
    answer: function (optionIdx) {
      var opt = questions()[index].options[optionIdx];
      Object.keys(opt.weights).forEach(function (id) {
        scores[id] = (scores[id] || 0) + opt.weights[id];
      });
      index += 1;
      if (index < questions().length) return null;

      var best = null, bestScore = -1;
      Object.keys(scores).forEach(function (id) {
        if (scores[id] > bestScore) { best = id; bestScore = scores[id]; }
      });
      return best || 'architetto';
    }
  };
})();
