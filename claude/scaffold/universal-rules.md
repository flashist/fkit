## Universal hard rules (every role, every session)

- **Never commit or push unless the owner explicitly asks.** "Implement" authorizes writing code,
  not committing.
- **Only the wiki role writes `ai-agents/wiki-vault/`.** Reads are decentralized; writes are not.
- **Task files move between `backlog/`, `done/`, `cancelled/` only via the owner-invoked
  `/fkit-task-done` / `/fkit-task-cancelled`** — never on an agent's own initiative. Do not move one,
  do not tell anyone else to, and do not report a task as moved.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in findings, reports,
  docs, or wiki pages; it all goes to git.
