# Wiki maintenance (AGENTS)

How this wiki is kept true. It documents `Ruby/` (a single Next.js 16 app).

## Principles

1. **Ground every claim in source.** Before writing a page, read the actual files under `src/`. Cite real paths (`src/app/(api)/api/favorites/route.ts`), not assumptions.
2. **Anchor on code in active use.** If a doc and the code disagree, the code wins — fix the doc and note the drift.
3. **Cross-link with `[[wikilinks]]`.** Each page lists what it depends on / talks to. `index.md` is the entry point.
4. **Markdown/ASCII only** — no binary/diagram assets as model-facing resources.
5. **Keep it model-oriented** — token-efficient, decision-useful; no prose padding.

## When to update

- A new layer/slice/route/endpoint → update [[layers]], [[routing]], and [[data-flow]] (and the relevant area page).
- A data-access change → [[data-flow]] + the `data-layer` skill.
- An auth/session change → [[auth]]. A schema/migration change → [[database-and-migrations]].
- A convention/naming/skill change → [[conventions-and-skills]] and the `app-structure` skill.

## Relationship to skills

The **wiki** is narrative ("what is here and why"); the **skills** (`.claude/skills/`) are prescriptive ("how to build/place/verify"). Skills are the source of truth for rules; the wiki explains and links to them. Keep rules in the skills, not duplicated across many wiki pages.

## Source-of-truth pages

[[index]] · [[architecture]] · [[layers]] · [[routing]] · [[data-flow]] · [[auth]] · [[database-and-migrations]] · [[ui-and-styling]] · [[state-and-forms]] · [[config-and-env]] · [[testing]] · [[conventions-and-skills]]
