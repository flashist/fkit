# The web board (repo-local)

`npm run board` starts a **read-only** web board: it serves
[aiboard](https://github.com/flashist/aiboard)'s unmodified UI over fkit's unmodified `ai-agents/`
tree, so the tasks and sprints you'd otherwise read as raw markdown render as cards you can click.
It is the **interim** reader: **fkit's tree stays the single store** until a project moves to the
built-in board (see [Roadmap](../README.md#roadmap)), after which this reader retires
([ADR-052](../ai-agents/knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md);
it began as Track 1 of
[ADR-051](../ai-agents/knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)).

## Running it

```
npm run board                                   # then open http://127.0.0.1:8585/
npm run board -- --port 9000                    # a different port
npm run board -- --aiboard ../aiboard/aiboard/web/index.html
FKIT_AIBOARD=/path/to/aiboard/web/index.html npm run board
node bin/fkit-board.mjs --bench                 # snapshot cost at this repo's real corpus
npm run board -- --root <other-project> --port 9001     # another fkit-using project's ai-agents/
node bin/fkit-board.mjs --bench --root <other-project>  # snapshot cost on that project's tree
```

## Finding aiboard

It finds fkit's root itself — there is nothing to edit before running it. It finds aiboard's
`index.html` in this order: `--aiboard`, then `FKIT_AIBOARD`, then the sibling default
`../aiboard/aiboard/web/index.html`. If none resolve it **exits non-zero naming all three**, rather
than starting and serving a 404.

## Another project's board: `--root <path>`

It reads that project's `ai-agents/` instead of fkit's, still read-only. The path must be a directory
holding both `ai-agents/tasks/` and `ai-agents/sprints/`; if it is not, the reader **exits non-zero
naming what is missing and never falls back to fkit's own tree**. A tree whose boards cannot be read
(a permission error) is refused the same way, naming the unreadable directory. A relative path
resolves from where `node` runs — under `npm run board` that is fkit's checkout, so from anywhere else
pass an absolute path. The startup banner prints the tree it is serving, marked `(--root)`.

- **fkit's own `dashboard.sh` reads every tree, a foreign one included; the target's copy is never
  run.** So the board shows *this* fkit's reading of the target's sprint status. If the target's fkit
  install is older, its own `/fkit-status` may read some boards differently — the banner adds a `note`
  line saying so whenever the target carries a `dashboard.sh` of its own.
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
except the single aiboard `index.html` it was pointed at, and it runs one fkit-local subprocess:
`claude/skills/fkit-status/dashboard.sh select-active`, which is the project's **one** implementation
of the sprint-status grammar. `test/board-reader.test.js` pins all of this, including a check that
`git status --porcelain ai-agents/` is unchanged by a full crawl plus every route.

## Not shipped

Repo-local by construction: `install.sh` copies `claude/` only, so this does not ship to projects that
install fkit, and aiboard is not a dependency of fkit.
