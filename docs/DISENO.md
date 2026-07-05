# Back to Journal — App de journaling terapéutico guiado

> Documento de diseño · v1 · Basado en el contenido de [backtojournal.it](https://www.backtojournal.it/) y las 9 secuencias de arquetipos.

---

## 1. Concepto

**Back to Journal (app)** es una compañera de escritura terapéutica. No es un diario en blanco —la página en blanco es precisamente el enemigo— sino una guía que parte de **cómo te sientes ahora** y te lleva, en 5 minutos, a escribir con una frase de apertura, un gesto de cierre y una explicación de por qué funciona.

La app traduce a producto digital lo que hoy hace la secuencia de emails de 7 días: reconocerte en un arquetipo, darte un ejercicio pequeño cada día, y no pedirte nunca perfección.

### La promesa
> *"No tienes que entender todo. Solo escribir. Cinco minutos. Y basta así."*

### Los tres momentos del loop principal

1. **Check-in** — "Come ti senti adesso?" → globos de emociones flotantes o texto libre.
2. **Rispecchiamento** (espejo) — la app te devuelve lo que sientes con las palabras del arquetipo: *"No hay nada malo en ti. Es tu modo de funcionar."*
3. **Sesión guiada** — frase de apertura + espacio de escritura + timer suave + ritual de cierre + "perché funziona" (base científica).

---

## 2. Principios de diseño (derivados de la voz del brand)

| Principio | Qué significa en la app |
|---|---|
| **Senza pressioni** | Nada de rachas rotas, badges rojos ni culpa. El timer es una invitación, no un límite. |
| **Il ritorno vale più della costanza** | No contamos días consecutivos: contamos *las veces que vuelves* (filosofía del Costruttore di Giorni). Saltar un día no borra nada. |
| **La carta è un posto sicuro** | Privacidad radical: todo se guarda en el dispositivo (localStorage). Nada viaja a un servidor en el prototipo. |
| **Nominare calma** | El primer gesto siempre es poner nombre a lo que hay (Lieberman: nombrar una emoción reduce la activación de la amígdala). |
| **Un mattone solo** | Cada sesión es UN ejercicio pequeño. Nunca se muestran los 7 días como tarea pendiente. |
| **Estética de papel y tinta** | Fondo crema, tipografía serif, transiciones suaves como tinta. La pantalla debe parecer un cuaderno, no una app de productividad. |

---

## 3. Flujo de usuario

```
                    ┌──────────────────────────────┐
                    │  BENVENUTO                   │
                    │  "Come ti senti adesso?"     │
                    │  ○ globos de emociones       │
                    │  ✎ "scrivilo con parole tue" │
                    │  → "conosco il mio archetipo"│
                    │  → "non lo so" (mini quiz)   │
                    └──────┬───────────────────────┘
                           │ emoción elegida / texto reconocido
                           ▼
                    ┌──────────────────────────────┐
                    │  RISPECCHIAMENTO             │
                    │  "Quello che senti ha un     │
                    │   nome" — lectura empática   │
                    │  del arquetipo               │
                    │  CTA: "Iniziamo · 5 minuti"  │
                    └──────┬───────────────────────┘
                           ▼
                    ┌──────────────────────────────┐
                    │  SESSIONE GUIDATA            │
                    │  1. intro del ejercicio      │
                    │  2. frase de apertura        │
                    │     "In questo momento quello│
                    │      che mi preoccupa è…"    │
                    │  3. escritura libre + timer  │
                    │     suave (círculo que       │
                    │     respira)                 │
                    │  4. pasos siguientes (si hay)│
                    └──────┬───────────────────────┘
                           ▼
                    ┌──────────────────────────────┐
                    │  RITUALE DI CHIUSURA         │
                    │  · "cerchia una cosa" → tap  │
                    │    sobre una frase escrita   │
                    │  · card "Perché funziona"    │
                    │    (Pennebaker, Gross, …)    │
                    │  · "Basta così." + preview   │
                    │    de mañana                 │
                    └──────┬───────────────────────┘
                           ▼
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌─────────────────┐      ┌─────────────────┐
     │  PERCORSO       │      │  DIARIO         │
     │  7 giorni +     │      │  entradas       │
     │  contador de    │      │  privadas,      │
     │  "ritorni"      │      │  exportables    │
     └─────────────────┘      └─────────────────┘
```

### 3.1 Check-in: los globos de emociones

Pantalla de entrada. Globos que **flotan con un movimiento de respiración** (animación lenta, orgánica — nada de física frenética). Cada globo es una emoción en primera persona, tal como la diría la persona:

- *"La testa non si ferma"* → L'Architetto delle Preoccupazioni
- *"Lontano dai miei sogni"* → Il Sognatore
- *"Rimugino su tutto"* → Il Tessitore di Storie
- *"Mille idee, zero fili"* → Il Ladro di Scintille
- *"Deluso di me"* → Il Forgiatore di Abitudini
- *"Stanco di ricominciare"* → Il Costruttore di Giorni
- *"Su e giù senza motivo"* → Il Viaggiatore delle Maree
- *"Assorbo tutto"* → Il Sismografo del Sentire
- *"Tengo tutto dentro"* → Il Custode delle Emozioni

(2 globos por arquetipo aprox., 12-14 visibles, rotan al azar en cada visita.)

**Texto libre:** debajo, un campo *"oppure scrivilo con parole tue…"*. Un matcher de palabras clave en italiano (léxico de sinónimos por arquetipo) reconoce la emoción. Si no hay match claro, la app ofrece el mini-quiz o empezar a escribir libremente — nunca un callejón sin salida.

**Mini-quiz** (*"Non so come mi sento"*): 4 preguntas suaves sobre el estilo mental (no sobre síntomas), cada opción suma puntos a arquetipos. Réplica compacta del quiz del sitio.

### 3.2 Rispecchiamento

El momento más importante de la experiencia. Antes de pedir nada, la app **devuelve**: 2-3 frases del arquetipo (extraídas de la MAIL 1 original) que hacen que la persona piense *"sono proprio io"*. Cierra siempre con la fórmula del brand: *"Non c'è niente di sbagliato in te."* Y una sola llamada a la acción: *"Iniziamo — bastano 5 minuti."*

### 3.3 Sesión guiada

- La **frase de apertura** aparece como cabecera del área de escritura (verbatim del contenido original, con sus puntos suspensivos). El cursor ya está esperando.
- **Timer suave**: un círculo que se llena lentamente. Al terminar no suena una alarma: aparece *"Puoi fermarti. O continuare, se ti va."*
- Ejercicios de **varios pasos** (ej. Sognatore: sogno → realtà → passo sporco) se presentan uno a la vez, nunca como formulario.
- **Autoguardado** continuo en localStorage. Si cierras y vuelves, tu texto está.
- Cero fricción: sin formato, sin corrección, sin contador de palabras visible.

### 3.4 Ritual de cierre

Adaptación digital de los gestos físicos del método:
- *"cerchia una sola cosa"* → el texto escrito se divide en frases; la persona **toca una** y queda rodeada con un trazo de tinta.
- *"sottolinea la parola che ti sorprende"* → tap sobre una palabra.
- Después, la card **"Perché funziona"** con la referencia científica del día (Pennebaker, Lieberman, Gross, Aron, Fogg, Oettingen, Amabile…) — la app nunca es esotérica: siempre explica.
- Cierre: *"E basta così."* + anticipo del día siguiente (como en los emails: *"Domani parleremo di…"*).

### 3.5 Percorso y Diario

- **Percorso**: los 7 días del arquetipo como un sendero (no checklist). El día sugerido es el siguiente no completado, pero todos son accesibles. Un contador central: **"Sei tornato N volte"** — nunca "racha de N días".
- **Diario**: entradas guardadas, filtrables por arquetipo/emoción, exportables a `.txt`. Nota fija: *"Tutto resta sul tuo dispositivo."*
- **Cambio de marea**: la persona puede hacer check-in con una emoción distinta cada día — el arquetipo no es una jaula. El check-in decide la sesión de hoy; el percorso recuerda dónde ibas en cada arquetipo.

---

## 4. Modelo de contenido

Todo el contenido vive en `data/` como JSON estructurado, extraído fielmente de los 9 documentos de Drive (frases de apertura verbatim, en italiano original):

```
Archetype {
  id, name, essence, description,      ← MAIL 1 (resultado del quiz)
  strength, shadow, coreNeed, trap,
  journalingMetaphor,                  ← "spazio di decompressione", "ponte", "telaio"…
  howJournalingHelps,
  days: [                              ← MAIL 2..8 = giorni 1..7
    { day, subject, durationMinutes,
      intro, steps: [{prompt, instruction}],
      closingRitual, why, research, tomorrow }
  ],
  closingMessage
}

Emotion { label, archetypeId, keywords[] }   ← globos + matcher de texto libre
```

Este modelo permite añadir arquetipos, traducir la interfaz (los strings de UI están separados del contenido) o servir el contenido desde un backend en el futuro sin tocar la app.

---

## 5. Decisiones técnicas (prototipo v1)

| Decisión | Por qué |
|---|---|
| **SPA estática, vanilla JS, sin build** | Se abre con doble clic en `index.html`, se despliega gratis en GitHub Pages. Cero dependencias que mantener. |
| **localStorage** | Privacidad primero; sin cuentas ni servidor. El diario es tuyo. |
| **Contenido como JS data files** | Evita problemas de CORS al abrir en local; fácil de regenerar desde Drive. |
| **UI en italiano** | El brand y su audiencia son italianos. La arquitectura separa contenido/strings para traducir después. |
| **Mobile-first, responsive** | El journaling pasa en el sofá y en la cama, no en el escritorio. |

## 6. Roadmap sugerido

- **v1 (este prototipo)** — loop completo offline: check-in → sesión → ritual → diario.
- **v1.5** — recordatorio suave opcional (notificación local a la hora que elijas: *"Il quaderno ti aspetta. Se oggi non va, va bene lo stesso."*), PWA instalable, export PDF.
- **v2** — cuentas + sync cifrado; el quiz completo del sitio integrado; secuencias estacionales nuevas.
- **v3** — acompañamiento adaptativo: la app aprende qué ejercicios te desbloquean según tus check-ins (p. ej., con Claude API generando variaciones de prompts dentro de la voz del brand, siempre con revisión editorial).

## 7. Métricas que importan (y las que no)

- ✅ **Ritorni** (sesiones completadas, distintas fechas), tasa de cierre de sesión iniciada, palabras escritas por sesión (solo agregado, nunca leemos contenido).
- ❌ Rachas, DAU forzado, tiempo-en-app como vanity metric. Una sesión buena de 5 minutos es éxito; 40 minutos de scroll no existe aquí.
