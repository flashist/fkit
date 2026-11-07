

- **DRAFT ONLY; product change.** Automatic update checks will decline non-HTTPS transports after Git URL rewriting. Architect/producer re-review and independent adversarial review remain pending.
- **No Build approval.** Planning restraint is instruction-enforced. The owner must approve the full plan and compatibility costs below.

**Implementation**

1. In `claude/fkit-claude.sh`, add `GIT_ALLOW_PROTOCOL=https` to the existing `env` arguments around `_fkit_remote_sha`’s single `git ls-remote` call. Retain `GIT_TERMINAL_PROMPT=0`, HTTP settings, `_fkit_deadline`, redirections, SHA extraction and silent failure handling. Git documents allowlist precedence and enforcement against rewritten URLs; therefore an SSH rewrite is rejected before invoking SSH. [Git environment documentation](https://git-scm.com/docs/git#Documentation/git.txt-GITALLOWPROTOCOL), [rewrite policy](https://git-scm.com/docs/git-config#Documentation/git-config.txt-urlltbasegtinsteadOf).

2. Extend existing `test/update-banner.test.js` with exactly the three process cases below and narrowly scoped fixture support. Ordinary fixtures retain stubbed Git. Correct comments made false by introducing real Git; new or edited comments explain only WHY, in one or two lines.

3. Add an `Unreleased` entry in `CHANGELOG.md` explaining that automatic checks silently decline SSH-rewritten URLs. After approval, record reproduction commands/results, functional verification, exclusions and the owner’s compatibility ruling verbatim in `ai-agents/tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/worklog.md`.

`bin/fkit` already invokes this shared launcher for configured-runtime notifications; no counterpart edit is needed. No generated `.claude/` or `.agents/` edits.

**Owner decision: compatibility costs**

Recommend **HTTPS-only for this optional Git call**. Git configuration remains available, including HTTPS proxy settings. Rewrites selecting SSH, HTTP, Git, file or custom protocols yield no fresh automatic update notice; no curl retry is added.

Custom `core.sshCommand`, `GIT_SSH_COMMAND`, `GIT_SSH`, keys, SSH proxies and wrappers remain configured but are unused when this check rejects SSH. The explicit allowlist replaces inherited `GIT_ALLOW_PROTOCOL` and overrides Git configuration forbidding HTTPS **for this call**. Other Git operations retain their environment and policies.

Alternatives weighed: forcing `GIT_SSH_COMMAND="ssh -o BatchMode=yes"` overrides custom commands; preserving or appending to arbitrary commands cannot guarantee their wrappers/proxies avoid interaction. Ignoring configuration loses proxy settings; rewrite detection plus curl fallback adds branching and changes the excluded curl path. Git also treats SSH variant selection separately. [Git SSH controls](https://git-scm.com/docs/git#Documentation/git.txt-GITSSHCOMMAND), [OpenSSH BatchMode](https://man.openbsd.org/OpenBSD-7.3/ssh_config.5#BatchMode).

**The owner decides whether skipped non-HTTPS notices, unused custom SSH setups and the call-local protocol-policy override are acceptable before Build.**

**Exactly three new top-level cases; one existing file; zero new test files or prove-red cases**

Shared isolation for **all three**: select real Git explicitly; build a clean child environment with fixture HOME/XDG/global configuration, disabled system configuration and a non-repository working directory. Seal PATH and set **`GIT_EXEC_PATH` to a fixture-only directory** containing the synthetic HTTPS helper. Installed Git helpers and real SSH/curl must remain unreachable. Git prepends its execution path, so PATH isolation alone is insufficient. [Git execution-path source](https://github.com/git/git/blob/v2.50.1/exec-cmd.c#L294-L328).

Within each case, run a positive real-Git control against a non-rewritten fixture URL with HTTPS explicitly allowed. Assert the synthetic ref, fixture helper identity token, executable path and invocation log; reset logs before the launcher assertion. SSH cases additionally prove their exact configured sentinel is invoked when SSH is explicitly permitted. These are controls inside the three cases, not additional top-level tests.

The HTTPS helper answers `capabilities\n` with `fetch\n\n`, then `list\n` with `<synthetic-sha> refs/heads/main\n\n`; terminate on Git’s blank line or EOF. Log identity and protocol exchange separately from stdout; reject unexpected commands. No fetch or network operation is needed for `ls-remote`. [Documented helper protocol](https://git-scm.com/docs/gitremote-helpers).

1. **`0520/scp-rewrite`** — isolated HTTPS→SCP-style rewrite, with `GIT_SSH_COMMAND` selecting a harmless invocation sentinel. Unchanged launcher must invoke it; fixed launcher must not. Require exit 0, unchanged help output, empty stderr, no banner and no `.latest` creation. Preserve the existing `.update-check` attempt stamp.

2. **`0520/ssh-url-rewrite`** — explicit `ssh://` rewrite, `core.sshCommand` sentinel, permissive SSH protocol configuration and inherited `GIT_ALLOW_PROTOCOL=ssh`. Prove the configured sentinel works in the positive control; require the fixed launcher to reject SSH before invoking it, with the same silence, continuation and cache assertions as case 1.

3. **`0520/https-preserved-and-scoped`** — no rewrite; synthetic HTTPS helper advertises the remote ref. Include inherited `GIT_ALLOW_PROTOCOL=ssh` and configured `protocol.https.allow=never` to exercise the disclosed override. Require the fixture helper identity, expected banner/`.latest`, visibility of a synthetic `http.proxy` setting, and helper observation of `GIT_ALLOW_PROTOCOL=https`. A curl sentinel serving the version observes the original inherited `GIT_ALLOW_PROTOCOL=ssh`. Verify fixture configuration bytes remain unchanged.

These cases exercise the shipped launcher as a process; no sourcing or mocking `_fkit_remote_sha`. They establish transport selection, configuration visibility, environment scoping and launcher behavior. **Native HTTPS/TLS/proxy operation remains unexecuted; helper success does not prove it.**

**Build sequence and checks, only after owner approval**

1. Reproduce the SSH attempt on unchanged source using the isolated fixture and sentinel—no real authentication, usable keys or network. Record command/output; if no attempt occurs, stop and report.
2. Add the three approved cases. Establish red specifically at the SSH non-invocation assertions, with positive fixture controls passing.
3. Apply the single-call restriction; rerun green.
4. Run the focused banner checks, then the filtered default-equivalent suite and all four existing prove-red cases:

```sh
node --test --test-name-pattern='^(?!0284/(?:git-deadline|term-ignored|no-stray):)' test/update-banner.test.js

node --test --test-name-pattern='^(?!0284/(?:git-deadline|term-ignored|no-stray):)(?!fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$)' test/*.test.js test/board/*.test.js

npm run test:prove-red
sh -n claude/fkit-claude.sh
node --check test/update-banner.test.js
git diff --check
```

The second command preserves `package.json`’s `node --test` flags and both discovery globs, adding only the three named banner exclusions and the exact full-name exclusion for the existing board case. Focused banner coverage should select 15 existing plus three new cases: **18 selected, three deferred**, subject to actual runner reporting. Preserve existing opt-in skips; enable no benchmark.

The additional excluded full name is **`fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile`**, in `test/board/store.test.js:568`. Its mixed measurement/functional coverage is deferred together: task creation after an abandoned break file, removal of the lock-owner and break files, and waiter backoff while the break file ages. Do not split or edit this test, weaken its assertions, or replace it with a new case.

`CONTRIBUTING.md` maps the launcher to the default suite plus prove-red. The filtered command retains the default suite’s other functional coverage; there is no blanket functional-suite deferral. The unfiltered default command and the four named excluded cases are not claimed passed. Report actual pass/fail/skip counts and any additional functional omission explicitly.

Preserve watchdog behavior/constants, installer/curl behavior, throttle, rendering and runtime routing. The November 5 ruling excludes timing measurements, timeout reproductions, benchmarks, load runs and process-observer investigations; none becomes an acceptance gate. No 0537 work, configuration diagnosis, installation, settings changes, placement/dependency changes, commit or push. Dependency 0284 is satisfied per the current brief.

**What’s next?** Lead obtains fresh reviews of this complete draft, then the owner’s full-plan and compatibility decision before Build.

