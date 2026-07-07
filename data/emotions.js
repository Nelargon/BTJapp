/* Back to Journal — mappa emozioni → archetipi, in italiano e spagnolo.
   I "globi" del check-in e il lessico per riconoscere il testo libero. */

var BTJ_META = {
  it: {
    'architetto': {
      glyph: '🏗️',
      tagline: 'La mente che costruisce scenari e non si ferma',
      keywords: ['preoccup', 'ansi', 'controll', 'scenari', 'futuro', 'catastrof', 'agitat', 'teso', 'tension', 'panic', 'paura', 'stress', 'rimugino sul futuro', 'testa piena', 'non riesco a dormire', 'e se']
    },
    'sognatore': {
      glyph: '✨',
      tagline: 'Vede ciò che non esiste ancora',
      keywords: ['sogn', 'vision', 'irrealizz', 'lontano', 'distan', 'obiettiv', 'realizzare', 'frustrat', 'procrastin', 'paralisi', 'grande', 'potenziale', 'futuro che vedo', 'non concretizzo']
    },
    'tessitore': {
      glyph: '🧵',
      tagline: 'Trasforma tutto in storie e significati',
      keywords: ['senso', 'signific', 'interpret', 'rimugin', 'storia', 'storie', 'capire', 'perché', 'perche', 'confus', 'analizz', 'pattern', 'segnal', 'sottotesto', 'testa che racconta']
    },
    'ladro-di-scintille': {
      glyph: '💡',
      tagline: 'Mille ispirazioni, un filo da trovare',
      keywords: ['idee', 'idea', 'ispirazion', 'dispers', 'distratt', 'concentr', 'mille', 'progett', 'concludo', 'finisco', 'caos', 'salto da', 'inizio e non', 'troppe cose', 'scintill']
    },
    'forgiatore': {
      glyph: '⚒️',
      tagline: 'Vuole diventare qualcuno, senza punirsi',
      keywords: ['disciplin', 'perfezion', 'colpa', 'delus', 'fallit', 'fallim', 'abitudin', 'routine', 'incostante', 'rigido', 'esigente', 'non sono abbastanza', 'severo', 'dovrei', 'in colpa']
    },
    'costruttore': {
      glyph: '🧱',
      tagline: 'Un mattone al giorno, senza colpa',
      keywords: ['costan', 'ricominci', 'mollato', 'mollare', 'abbandon', 'ritmo', 'stanco di', 'demotivat', 'perso il filo', 'saltato', 'interrotto', 'ripartire', 'continuità', 'continuita']
    },
    'viaggiatore': {
      glyph: '🌊',
      tagline: 'Maree dentro: giorni alti e giorni bassi',
      keywords: ['umore', 'alti e bassi', 'altalen', 'giù', 'giu', 'triste', 'malinconi', 'sbalzi', 'marea', 'vuoto', 'spento', 'apatia', 'senza motivo', 'oggi non sono io', 'instabil']
    },
    'sismografo': {
      glyph: '📡',
      tagline: 'Sente tutto, anche ciò che non è suo',
      keywords: ['assorb', 'sensibil', 'sovraccaric', 'sopraffatt', 'troppo', 'empat', 'stimoli', 'rumore', 'pieno di tutto', 'esaust', 'drenat', 'energie degli altri', 'emozioni degli altri', 'spugna']
    },
    'custode': {
      glyph: '🗝️',
      tagline: 'Tiene tutto dentro, senza far rumore',
      keywords: ['dentro', 'trattien', 'trattenut', 'esprimere', 'non dico', 'non riesco a dire', 'sfog', 'peso', 'chiuso', 'nodo', 'ingoi', 'reggo', 'non voglio pesare', 'zitto', 'nascosto', 'blocc']
    }
  },

  es: {
    'architetto': {
      glyph: '🏗️',
      tagline: 'La mente que construye escenarios y no se detiene',
      keywords: ['preocup', 'ansi', 'control', 'escenari', 'futuro', 'catastrof', 'agitad', 'tens', 'panic', 'pánic', 'panic', 'miedo', 'estres', 'estrés', 'no puedo dormir', 'cabeza llena', 'y si', 'y sí']
    },
    'sognatore': {
      glyph: '✨',
      tagline: 'Ve lo que todavía no existe',
      keywords: ['sueñ', 'sueno', 'visi', 'irrealiz', 'lejos', 'distanc', 'objetiv', 'realizar', 'frustra', 'procrastin', 'paralisis', 'parálisis', 'grande', 'potencial', 'futuro que veo', 'no concreto', 'no aterrizo']
    },
    'tessitore': {
      glyph: '🧵',
      tagline: 'Convierte todo en historias y significados',
      keywords: ['sentido', 'signific', 'interpret', 'rumi', 'historia', 'entender', 'por qué', 'porque', 'confus', 'analiz', 'patron', 'patrón', 'señal', 'trasfondo', 'mente que narra']
    },
    'ladro-di-scintille': {
      glyph: '💡',
      tagline: 'Mil chispas, un hilo por encontrar',
      keywords: ['idea', 'inspiraci', 'dispers', 'distraíd', 'distraid', 'concentr', 'mil', 'proyecto', 'concluyo', 'termino', 'caos', 'salto de', 'empiezo y no', 'demasiadas cosas', 'chispa']
    },
    'forgiatore': {
      glyph: '⚒️',
      tagline: 'Quiere convertirse en alguien, sin castigarse',
      keywords: ['disciplin', 'perfeccion', 'culpa', 'decepcion', 'decepción', 'fracas', 'habito', 'hábito', 'rutina', 'inconstan', 'rigid', 'exigente', 'no soy suficiente', 'sever', 'debería', 'deberia', 'en falta']
    },
    'costruttore': {
      glyph: '🧱',
      tagline: 'Un ladrillo al día, sin culpa',
      keywords: ['constanc', 'recomenzar', 'reempezar', 'abandon', 'ritmo', 'cansad', 'desmotivad', 'perdí el hilo', 'perdi el hilo', 'salté', 'salte', 'interrumpid', 'retomar', 'continuidad']
    },
    'viaggiatore': {
      glyph: '🌊',
      tagline: 'Mareas por dentro: días altos y días bajos',
      keywords: ['humor', 'altibaj', 'sube y baja', 'abajo', 'triste', 'melancol', 'cambios de animo', 'cambios de ánimo', 'marea', 'vacío', 'vacio', 'apagad', 'apatía', 'apatia', 'sin motivo', 'hoy no soy yo', 'inestabl']
    },
    'sismografo': {
      glyph: '📡',
      tagline: 'Siente todo, incluso lo que no es suyo',
      keywords: ['absorb', 'sensibl', 'sobrecarg', 'sobrepasad', 'demasiado', 'empat', 'estimulos', 'estímulos', 'ruido', 'lleno de todo', 'agotad', 'drenad', 'energía de los demás', 'energia de los demas', 'emociones ajenas', 'esponja']
    },
    'custode': {
      glyph: '🗝️',
      tagline: 'Guarda todo dentro, sin hacer ruido',
      keywords: ['por dentro', 'me guardo', 'retengo', 'expresar', 'no digo', 'no puedo decir', 'desahog', 'peso', 'cerrad', 'nudo', 'trago', 'aguanto', 'no quiero molestar', 'callad', 'escondid', 'bloque']
    }
  }
};

var BTJ_EMOTIONS = {
  it: [
    { label: 'la testa non si ferma', archetypeId: 'architetto' },
    { label: 'preoccupato per tutto', archetypeId: 'architetto' },
    { label: 'in ansia per il futuro', archetypeId: 'architetto' },

    { label: 'lontano dai miei sogni', archetypeId: 'sognatore' },
    { label: 'vedo tutto, realizzo poco', archetypeId: 'sognatore' },

    { label: 'rimugino su tutto', archetypeId: 'tessitore' },
    { label: 'cerco un senso a ogni cosa', archetypeId: 'tessitore' },

    { label: 'mille idee, zero fili', archetypeId: 'ladro-di-scintille' },
    { label: 'disperso tra i miei progetti', archetypeId: 'ladro-di-scintille' },

    { label: 'deluso di me', archetypeId: 'forgiatore' },
    { label: 'mai abbastanza costante', archetypeId: 'forgiatore' },

    { label: 'stanco di ricominciare', archetypeId: 'costruttore' },
    { label: 'ho perso il ritmo', archetypeId: 'costruttore' },

    { label: 'su e giù senza motivo', archetypeId: 'viaggiatore' },
    { label: 'oggi sono in bassa marea', archetypeId: 'viaggiatore' },

    { label: 'sento tutto, troppo', archetypeId: 'sismografo' },
    { label: 'pieno delle emozioni degli altri', archetypeId: 'sismografo' },

    { label: 'tengo tutto dentro', archetypeId: 'custode' },
    { label: 'pieno, ma non so di cosa', archetypeId: 'custode' }
  ],

  es: [
    { label: 'la cabeza no se detiene', archetypeId: 'architetto' },
    { label: 'preocupado por todo', archetypeId: 'architetto' },
    { label: 'con ansiedad por el futuro', archetypeId: 'architetto' },

    { label: 'lejos de mis sueños', archetypeId: 'sognatore' },
    { label: 'veo todo, realizo poco', archetypeId: 'sognatore' },

    { label: 'le doy vueltas a todo', archetypeId: 'tessitore' },
    { label: 'busco un sentido a cada cosa', archetypeId: 'tessitore' },

    { label: 'mil ideas, ningún hilo', archetypeId: 'ladro-di-scintille' },
    { label: 'disperso entre mis proyectos', archetypeId: 'ladro-di-scintille' },

    { label: 'decepcionado de mí', archetypeId: 'forgiatore' },
    { label: 'nunca lo bastante constante', archetypeId: 'forgiatore' },

    { label: 'cansado de recomenzar', archetypeId: 'costruttore' },
    { label: 'perdí el ritmo', archetypeId: 'costruttore' },

    { label: 'arriba y abajo sin motivo', archetypeId: 'viaggiatore' },
    { label: 'hoy estoy en marea baja', archetypeId: 'viaggiatore' },

    { label: 'siento todo, demasiado', archetypeId: 'sismografo' },
    { label: 'lleno de las emociones de los demás', archetypeId: 'sismografo' },

    { label: 'me guardo todo por dentro', archetypeId: 'custode' },
    { label: 'lleno, pero no sé de qué', archetypeId: 'custode' }
  ]
};
