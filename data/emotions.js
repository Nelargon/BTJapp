/* Back to Journal — mappa emozioni → archetipi.
   I "globi" del check-in e il lessico per riconoscere il testo libero.
   Le etichette sono in prima persona: come lo direbbe la persona, adesso. */

var BTJ_META = {
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
};

var BTJ_EMOTIONS = [
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
];
