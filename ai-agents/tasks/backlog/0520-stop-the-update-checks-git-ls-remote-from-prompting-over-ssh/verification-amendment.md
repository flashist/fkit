

**SEPARATE UNAPPROVED OVERLAY — not applied; not independently re-reviewed.**

Replace only the two full Node commands in frozen R2’s “Build sequence and checks” with:

```sh
node --test --test-skip-pattern='^0284/(?:git-deadline|term-ignored|no-stray):' test/update-banner.test.js

node --test --test-skip-pattern='^(?:0284/(?:git-deadline|term-ignored|no-stray):|fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$)' test/*.test.js test/board/*.test.js
```

All other arguments, discovery globs, commands, implementation scope, fixture requirements, deferrals and coverage disclosures remain identical.

Focused coverage remains **15 existing plus three proposed cases: 18 intended selections, three deferred**, subject to actual reporting. Default-equivalent coverage additionally excludes exactly:

`fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile`

Its task-creation, abandoned-break handling, lock-owner/break-file cleanup and waiter-backoff coverage remain deferred together. Existing opt-in skips remain; no benchmark is enabled. No test splitting, assertion weakening, replacement case, new file or new prove-red case.

Runner selection remains unexecuted. Filtered tests can be omitted from runner output; report actual counts without inventing skipped counts. Neither the unfiltered default suite nor the excluded cases is claimed passed.

**Disposition pending at the same full-plan gate:** owner accepts or rejects this exact overlay alongside unchanged R2, its three individually named new cases and its compatibility choice. This proposal grants no execution authority.

