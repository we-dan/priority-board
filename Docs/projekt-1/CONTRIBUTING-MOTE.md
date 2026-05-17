# Contributing to this Mote-connected repo

This repository is the shared knowledge layer between Mote (a meeting
recorder + task manager used by your PMs, designers, researchers, and
ops teammates) and engineers reading code in their IDE. You don't
need to install Mote to contribute.

## Paths Mote manages

```
README.md                   ← project overview (Mote-managed sections + user prose)
CLAUDE.md                   ← AI agent context (active tasks, recent meetings)
_kund/kontakter.md          ← contacts table (deduped attendees)
_kund/projektoversikt.md    ← project status table
_kund/moten/                ← one markdown file per meeting
tasks.md                    ← GFM checklist of active + completed tasks
docs/                       ← hand-written project documents
.mote/                      ← machine bookkeeping (manifest, contracts)
```

Anything **outside** those paths is yours. Drop a `decisions/` folder,
a `RFCs/`, anything — Mote will never touch it.

Inside Mote-managed files, anything OUTSIDE the `<!-- mote:begin:* -->`
/ `<!-- mote:end:* -->` markers is user prose Mote preserves across
re-renders.

## How to close a task without opening Mote

Two equally-supported gestures — pick whichever fits your workflow.

### 1. Toggle a markdown checkbox

The root `tasks.md` mirrors active + completed tasks as
GitHub-Flavoured-Markdown checkboxes. Flip the checkbox in any editor
(VS Code with `Markdown All in One` toggles on `Ctrl+Shift+Enter`) or
in the GitHub PR review UI, commit, push. Mote picks it up on the
next cycle.

```markdown
- [x] [abc12345] Send design brief to engineering <!-- mote:t/<uuid> -->
```

The `<!-- mote:t/<uuid> -->` anchor is the back-reference Mote uses to
find the task in SQLite. Don't delete it (the task becomes orphaned
in the markdown if you do).

### 2. Reference the task in a commit message

Use any of `closes`, `fixes`, `resolves`, `completes`, `done`, `did`
followed by the task's short id:

```
Wire signup form. Closes abc12345.
```

## How conflicts resolve

When two people edit the same field, Mote merges automatically:

- **Prose** (notes, summaries, doc bodies) → Loro CRDT character-level
  merge. Both edits survive in the merged text.
- **Structural fields** (title, due-date, tags, project assignment)
  → HLC tie-break by the `Mote-Hlc:` commit trailer. Most recent
  writer wins.
- **Set membership** (tasks, docs, meeting attendees) → union by id;
  per-row text merges via Loro.

If Mote can't resolve, the conflicted entity surfaces in the app's
activity feed for the human to fix.

## How not to break things

- **Don't hand-edit `.mote/manifest.json`.** It tracks Mote-authored
  paths for collab-safe orphan cleanup. Touching it can cause your
  teammates' new files to be wrongly deleted on the next mirror cycle.
- **Don't remove the `<!-- mote:t/<uuid> -->` anchors** from task
  lines. Without them Mote can't round-trip your checkbox toggle.
- **Don't delete the `<!-- mote:begin:* -->` markers** — your
  hand-edits inside a managed file are preserved across re-renders
  because Mote knows where its own sections end. Without the markers
  it can't tell.

## Where to ask

If you're the only engineer on the repo and the contract is unclear,
your teammates using Mote can see the activity feed of everything
that happened. Bring it up in your next standup — the person who
wrote the affected note is probably waiting to clarify.
