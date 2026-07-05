#!/usr/bin/env python3
"""Consolida data/extracted/*.json en data/archetypes.js (contenido de la app).

Uso: python3 scripts/build_data.py
Regenerar cuando cambien los documentos fuente en Drive.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTRACTED = ROOT / "data" / "extracted"
OUTPUT = ROOT / "data" / "archetypes.js"

# Orden de presentación en la app
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

HEADER = """/* Back to Journal — contenuto dei 9 archetipi.
   GENERATO da scripts/build_data.py a partire da data/extracted/*.json
   (estratti fedelmente dai documenti sorgente su Google Drive).
   Non modificare a mano: rigenerare con `python3 scripts/build_data.py`. */

var BTJ_ARCHETYPES = """


def validate(a: dict) -> list[str]:
    problems = []
    for key in ("id", "name", "essence", "description", "days"):
        if not a.get(key):
            problems.append(f"campo mancante o vuoto: {key}")
    days = a.get("days") or []
    if len(days) != 7:
        problems.append(f"attesi 7 giorni, trovati {len(days)}")
    for d in days:
        if not d.get("steps"):
            problems.append(f"giorno {d.get('day')}: nessuno step")
        for s in d.get("steps", []):
            if not s.get("prompt"):
                problems.append(f"giorno {d.get('day')}: step senza prompt")
        if not isinstance(d.get("durationMinutes"), (int, float)) or d["durationMinutes"] <= 0:
            d["durationMinutes"] = 5
    return problems


def main() -> int:
    archetypes = []
    missing = []
    for slug in ORDER:
        path = EXTRACTED / f"{slug}.json"
        if not path.exists():
            missing.append(slug)
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        data["days"] = sorted(data.get("days", []), key=lambda d: d.get("day", 0))
        problems = validate(data)
        if problems:
            print(f"[{slug}] avvisi:", file=sys.stderr)
            for p in problems:
                print(f"  - {p}", file=sys.stderr)
        archetypes.append(data)

    if missing:
        print(f"ERRORE: mancano le estrazioni: {', '.join(missing)}", file=sys.stderr)
        return 1

    body = json.dumps(archetypes, ensure_ascii=False, indent=2)
    OUTPUT.write_text(HEADER + body + ";\n", encoding="utf-8")
    total_days = sum(len(a["days"]) for a in archetypes)
    total_steps = sum(len(d["steps"]) for a in archetypes for d in a["days"])
    print(f"OK: {len(archetypes)} archetipi, {total_days} giorni, {total_steps} passi → {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
