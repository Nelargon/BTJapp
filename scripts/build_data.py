#!/usr/bin/env python3
"""Consolida data/extracted/*.json y data/extracted-es/*.json en data/archetypes.js.

Uso: python3 scripts/build_data.py
Regenerar cuando cambien los documentos fuente en Drive o sus traducciones.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCES = {
    "it": ROOT / "data" / "extracted",
    "es": ROOT / "data" / "extracted-es",
}
OUTPUT = ROOT / "data" / "archetypes.js"

# Orden de presentación en la app (mismo id en ambos idiomas)
ORDER = [
    "architetto",
    "sognatore",
    "tessitore",
    "ladro-di-scintille",
    "forgiatore",
    "costruttore",
    "viaggiatore",
    "sismografo",
    "custode",
]

HEADER = """/* Back to Journal — contenuto dei 9 archetipi, in italiano e spagnolo.
   GENERATO da scripts/build_data.py a partire da data/extracted/*.json (IT)
   e data/extracted-es/*.json (ES) — estratti/tradotti fedelmente dai documenti
   sorgente su Google Drive.
   Non modificare a mano: rigenerare con `python3 scripts/build_data.py`. */

var BTJ_ARCHETYPES = """


def validate(a: dict, lang: str) -> list[str]:
    problems = []
    for key in ("id", "name", "essence", "description", "days"):
        if not a.get(key):
            problems.append(f"[{lang}] campo mancante o vuoto: {key}")
    days = a.get("days") or []
    if len(days) != 7:
        problems.append(f"[{lang}] attesi 7 giorni, trovati {len(days)}")
    for d in days:
        if not d.get("steps"):
            problems.append(f"[{lang}] giorno {d.get('day')}: nessuno step")
        for s in d.get("steps", []):
            if not s.get("prompt"):
                problems.append(f"[{lang}] giorno {d.get('day')}: step senza prompt")
        if not isinstance(d.get("durationMinutes"), (int, float)) or d["durationMinutes"] <= 0:
            d["durationMinutes"] = 5
    return problems


def load_lang(lang: str) -> list[dict]:
    src = SOURCES[lang]
    archetypes = []
    missing = []
    for slug in ORDER:
        path = src / f"{slug}.json"
        if not path.exists():
            missing.append(slug)
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        data["days"] = sorted(data.get("days", []), key=lambda d: d.get("day", 0))
        problems = validate(data, lang)
        if problems:
            print(f"[{lang}/{slug}] avvisi:", file=sys.stderr)
            for p in problems:
                print(f"  - {p}", file=sys.stderr)
        archetypes.append(data)

    if missing:
        print(f"ERRORE ({lang}): mancano le estrazioni: {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)
    return archetypes


def check_id_alignment(by_lang: dict[str, list[dict]]) -> None:
    ids = {lang: [a["id"] for a in items] for lang, items in by_lang.items()}
    langs = list(ids.keys())
    for lang in langs[1:]:
        if ids[lang] != ids[langs[0]]:
            print(f"ERRORE: gli id non sono allineati tra {langs[0]} ed {lang}", file=sys.stderr)
            print(f"  {langs[0]}: {ids[langs[0]]}", file=sys.stderr)
            print(f"  {lang}: {ids[lang]}", file=sys.stderr)
            sys.exit(1)


def main() -> int:
    by_lang = {lang: load_lang(lang) for lang in SOURCES}
    check_id_alignment(by_lang)

    body = json.dumps(by_lang, ensure_ascii=False, indent=2)
    OUTPUT.write_text(HEADER + body + ";\n", encoding="utf-8")

    for lang, archetypes in by_lang.items():
        total_days = sum(len(a["days"]) for a in archetypes)
        total_steps = sum(len(d["steps"]) for a in archetypes for d in a["days"])
        print(f"OK [{lang}]: {len(archetypes)} archetipi, {total_days} giorni, {total_steps} passi")
    print(f"→ {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
