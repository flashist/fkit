# The web board

`fkit board` starts a **read-only** web board: it serves
[aiboard](https://github.com/flashist/aiboard)'s unmodified UI over the project's unmodified
`ai-agents/` tree, so the tasks and sprints you'd otherwise read as raw markdown render as cards you
can click. It is the **interim** reader: **fkit's tree stays the single store** until a project moves
to the built-in board (see [Roadmap](../README.md#roadmap)), after which this reader retires
([ADR-052](../ai-agents/knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md);
it began as Track 1 of
[ADR-051](../ai-agents/knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md),
and ships to every fkit user per
[ADR-058](../ai-agents/knowledge-base/decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md)).

## Running it

In your project's folder — the one holding `ai-agents/`:

```
fkit board                                      # then open http://127.0.0.1:8585/
fkit board --port 9000                          # a different port
fkit board --aiboard /path/to/aiboard/web/index.html
fkit board --root <other-project>               # another fkit-using project's ai-agents/
fkit board --bench                              # snapshot cost on this project's tree
fkit board --help                               # these options, then exit
```

An option it does not know prints the same help and exits non-zero; it starts no server. It needs [Node.js](https://nodejs.org) (tested on Node 24); no other fkit command does. Without
`node` on your `PATH` it says so and exits. An fkit installed before `fkit board` existed answers
"not a role" — run `fkit update` first.

In a checkout of this repo, the same reader runs over fkit's own tree:

```
npm run board                                   # fkit's own ai-agents/
npm run board -- --port 9000
FKIT_AIBOARD=/path/to/aiboard/web/index.html npm run board
node bin/fkit-board.mjs --bench                 # snapshot cost at this repo's real corpus
npm run board -- --root <other-project> --port 9001
```

## Which page it serves

It serves aiboard's `index.html`, chosen in this order: `--aiboard`, then `FKIT_AIBOARD`, then fkit's
own copy in [`vendor/aiboard/`](../vendor/aiboard/README.md), taken unmodified from a named aiboard
commit (the README there names it). A path you give that is not a readable file is an error: it
**exits non-zero naming all three**, rather than falling back to another page. No aiboard checkout is
needed anywhere.

## Which tree it reads

With no `--root` it reads **the folder you run it in**, and refuses — exit non-zero, naming what is
missing — if that folder has no `ai-agents/tasks/` and `ai-agents/sprints/`. It does not walk up to a
parent folder. `--root <path>` reads that project's `ai-agents/` instead, still read-only, with the
same checks; it **never falls back to fkit's own tree**. A tree whose boards cannot be read (a
permission error) is refused the same way, naming the unreadable directory. A relative path resolves
from where you run it — under `fkit board` that is your folder, under `npm run board` it is fkit's
checkout. The startup banner prints the tree it is serving, marked `(--root)` when you named it.

- **fkit's own `dashboard.sh` reads every tree; the project's copy is never run.** So the board shows
  *this* fkit's reading of the project's sprint status. If the project's fkit files are older, its own
  `/fkit-status` may read some boards differently — the banner adds a `note` line saying so whenever
  the project carries a `dashboard.sh` of its own, which every fkit project does.
- `/api/check` also returns `warnings` — e.g. two board files that map to the same board id, where
  one would otherwise silently shadow the other. A warning does not flip `ok`.

## What it listens on, and what it accepts

It binds **`127.0.0.1` only** — never `0.0.0.0` — on port `8585` by default. It serves six GET paths
and nothing else: `/` and its alias `/index.html` (both aiboard's `index.html`, byte-for-byte as
found), `/api/board`, `/api/tasks/<id>`, `/api/sprints/<id>` and `/api/check`.
**Every other method — POST, PUT, PATCH, DELETE, and anything else that is not GET — is refused with a
JSON error.** It holds no credentials and reads no environment beyond `FKIT_AIBOARD`.

## What it writes: nothing

**It writes nothing, anywhere, in any mode, behind any flag.** It opens no file outside `ai-agents/`
except the one page it serves, and it runs one fkit-local subprocess: fkit's own
`claude/skills/fkit-status/dashboard.sh select-active`, which is the project's **one** implementation
of the sprint-status grammar. `fkit board` runs before fkit's update check and project setup, so it
does not touch `.claude/` or `.fkit/` either.

## How it ships

`install.sh` puts the reader at `bin/fkit-board.mjs` and the copied page at `vendor/aiboard/` in the
install folder (`~/.local/share/fkit` by default), beside `claude/`. Node is needed for this command
only. It is interim: task `0444` moves `fkit board` to fkit's built-in board, and task `0467` retires
this reader (ADR-058 §6).
