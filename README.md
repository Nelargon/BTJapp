# BTJapp — Back to Journal

App de journaling terapéutico guiado, basada en el método y los 9 arquetipos de [backtojournal.it](https://www.backtojournal.it/).

**La idea en una frase:** partes de *cómo te sientes ahora* (globos de emociones o texto libre), la app te reconoce en tu arquetipo y te guía en un ejercicio de escritura de 5 minutos — frase de apertura, timer suave, ritual de cierre y el porqué científico.

📄 El diseño completo está en [`docs/DISENO.md`](docs/DISENO.md).

## Probar la app

No hay build ni dependencias: es una SPA estática.

```bash
# opción 1: abrir directamente
open index.html

# opción 2: servidor local
python3 -m http.server 8000
# → http://localhost:8000
```

Funciona también publicándola tal cual en GitHub Pages / Netlify.

## Estructura

```
index.html            pantallas de la app (check-in, sesión, percorso, diario)
css/app.css           estética papel y tinta, tema claro/oscuro, responsive
js/app.js             orquestador: globos, matcher de texto libre, navegación
js/session.js         motor de la sesión guiada (pasos, timer suave, ritual)
js/quiz.js            mini bussola: 4 preguntas → arquetipo
js/storage.js         persistencia local (localStorage) — privacidad primero
data/emotions.js      globos de emociones + léxico italiano del matcher
data/archetypes.js    contenido de los 9 arquetipos (GENERADO — no editar a mano)
data/extracted/*.json extracciones fieles de los documentos fuente (Drive)
scripts/build_data.py regenera data/archetypes.js desde data/extracted/
```

## Contenido

El contenido (descripciones de arquetipos, frases de apertura de los ejercicios, rituales, referencias científicas) proviene de las secuencias de email de 7 días de Back to Journal, extraído verbatim en italiano. Para actualizarlo: reemplazar los JSON en `data/extracted/` y ejecutar `python3 scripts/build_data.py`.

## Principios

- **Senza pressioni** — sin rachas ni culpa: se cuentan las *veces que vuelves*, nunca los días seguidos que faltaste.
- **Privacidad radical** — todo se guarda en el dispositivo (localStorage); exportable a `.txt`.
- **Un ejercicio pequeño cada vez** — nunca una lista de tareas pendientes.
