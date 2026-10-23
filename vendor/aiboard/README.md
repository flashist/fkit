# aiboard's web page — a copy, for `fkit board`

`index.html` here is aiboard's web page, **copied unmodified**. `fkit board` serves it over the
project's `ai-agents/` tree, read-only ([ADR-058](../../ai-agents/knowledge-base/decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md)).

| | |
|---|---|
| Source repo | `flashist/aiboard` |
| Source path | `aiboard/web/index.html` |
| Commit | `a1592dcdf1b63803fb2fb4d33ecf9081c75a6f51` |
| sha256 | `3b32c9e8f0311a73ab87a7de2af790534294f04af1eac25c5d757ef29b1a0dc6` |
| Size | 33,899 bytes |
| Copied | 2026-10-20 |
| Licence | MIT — aiboard's own, in [`LICENSE`](LICENSE) beside this file |

**Do not edit `index.html`.** To refresh it, copy it again, byte-for-byte, from a named aiboard
commit (`git -C <aiboard> cat-file blob <commit>:aiboard/web/index.html > index.html`), then update
the commit, sha256, size and date above.

**It does not follow aiboard.** Later changes to aiboard's page reach fkit only when someone copies
them in as above. Until then fkit serves the version named here.

**Interim.** This copy lives only until fkit's built-in board takes `fkit board` over: task 0444
re-points the command and task 0467 retires the read-only reader (ADR-058 §6). It is one of two
copies of aiboard's page in fkit's plans; the other is task 0422's port, and ADR-058 accepts both.
