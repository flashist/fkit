# Worklog — 0168: Remediate the dead brief paths in closed `review.md` ledger headers

Task: 0168 — [brief](./brief.md) · plan: [plan.md](./plan.md) (blob `84eba6635341c87b9780f75841ebcf776ce2c0dd`, confirmed at build start)

Built 2026-08-26 by the `fkit-sprint-ship-loop` Build worker (fkit-coder spawn under the declared-approval marker; owner approved the plan + D1–D4 via `AskUserQuestion` in the driver's live session, plan §7). HEAD at build: `493cecd`.

## Decision log

**none.** No fix was applied without asking and no obvious-winner call was made — every edit is the approved plan's steps 1–6 with D1 (dead-only, 67) + D2 (link form) + D3 (insert `0080`'s line 3) + D4 (no skill edits), as written.

**Process-review Round 1 (2026-08-26, Process-review worker, standing approval per ADR-032 / ADR-019 discipline):** two fixes applied without asking, both to this file's own prose; no obvious-winner call.
- **R1** → `worklog.md` freeze-table row "Line 1 `# Review — <slug>` titles": replaced the parenthetical "(plan cited 46 across the corpus; 24 sit inside this set)" with the re-measured statement (24 no-ID titles corpus-wide, all in set; the plan's 46 is the broader not-`# Review — NNNN` class, 34 in / 12 out). Qualified: verified by first-hand re-measure (both classes counted; see Process-review section), mechanical wording in the task's own record, inside the approved plan (plan §2 step 5 "record … the freeze list"), no ruled outcome and no `done/*/review.md` byte touched.
- **R3 (Round 2)** → same two worklog lines: "counted a broader class" reworded as *label and number disagree; broader-class reading is inferred* (one clause each). Qualified: verified first-hand against `plan.md:24-27` + `:56`, mechanical wording in the task's own record, in-plan, nothing outside `worklog.md`/`review.md` changed.
- **R2** → `worklog.md` Residuals bullet: "41 distinct dead path tokens" → "41 per-ledger-distinct … (37 distinct corpus-wide — 4 tokens each appear in 2 ledgers)". Qualified: verified by first-hand re-measure with `classify.py`'s `PATH_RE` (28 / 41 / 37 reproduce), mechanical label fix in the task's own record, in-plan, nothing outside the worklog changed.

## Step 1 — re-measure (2026-08-26, HEAD `493cecd`)

Classifier: `classify.py` (text below). Method as plan §1: first `Task:` line above the first `## ` heading in every `ai-agents/tasks/done/*/review.md`; form by shape (href / code span / bare / none); named path by **existence test on disk**; href targets tested separately against the ledger's folder.

Every bucket equals plan §1 — no delta, gate passed.

**Axis 1 — named path** (121 folders)

| Bucket | Plan §1 | Measured |
|---|---|---|
| dead — `backlog/<NNNN>-<slug>/brief.md` (variant 1) | 44 | **44** |
| dead — `backlog/<slug>.md` flat (variant 2) | 14 | **14** |
| dead — `done/<slug>.md` flat (variant 3) | 9 | **9** |
| live — `done/<NNNN>-<slug>/brief.md` | 51 | **51** |
| href whose label is `brief.md` (`0177`, `0254`) | 2 | **2** |
| no `Task:` header (`0080`) | 1 | **1** |
| sum | 121 | **121** |

**Axis 2 — form**

| Form | Plan §1 | Measured | dead / live split |
|---|---|---|---|
| href | 6 | **6** | 4 dead-label (`0001` `0010` `0022` `0039`) + 2 label-`brief.md` (`0177` `0254`); all 6 targets resolve |
| code span | 76 | **76** | 50 dead / 26 live |
| bare | 38 | **38** | 13 dead / 25 live |
| none | 1 | **1** | `0080` |
| sum | 121 | **121** | 67 dead = 63 Gap A (non-href) + 4 Gap B (href) |

Other gate facts: all 120 `Task:` headers on **line 3**; no ledger has two `Task:` lines; no CRLF; every one of the 121 folders has `brief.md`; the plan's reproducible one-liner returns **67**; `git status --porcelain` over the 67 + `0080` is **empty** (all 68 tracked and clean). The three dirty/untracked `done/` ledgers — `0203` (M), `0204` (??), `0325` (??) — are all live-header and outside the set.

**Dead set (67), by folder ID:**
0001 0003 0008 0010 0017 0020 0022 0023 0036 0039 0048 0049 0052 0054 0055 0070 0072 0074 0075 0079 0082 0086 0087 0101 0102 0103 0122 0123 0124 0125 0126 0132 0133 0136 0141 0142 0143 0147 0148 0150 0151 0153 0157 0158 0159 0160 0161 0162 0167 0171 0174 0190 0191 0195 0198 0200 0202 0218 0241 0246 0248 0252 0253 0256 0259 0268 0306

Plus `0080` (D3 insert) → **68 files written**.

Special shapes confirmed: 4 hrefs (Gap B); `0160` ID-already-present; 4 trailers (`0008` `(Sprint 2, priority 70)`, `0017` ``(task 75, ID `0017`) —``, `0052` `(task 43)`, `0101` ``(ID `0101`)``).

### classify.py

```python
#!/usr/bin/env python3
"""Classify the Task: header of every ai-agents/tasks/done/*/review.md (both axes)."""
import glob, os, re, sys, collections
ROOT = '/Users/mark.dolbyrev/Workspace/fkit'
os.chdir(ROOT)
PATH_RE = re.compile(r'ai-agents/tasks/[A-Za-z0-9./_-]+\.md')
HREF_RE = re.compile(r'\[(?P<label>[^\]]*)\]\((?P<target>[^)]*)\)')
rows = []
for f in sorted(glob.glob('ai-agents/tasks/done/*/review.md')):
    folder = f.split('/')[3]
    fid = folder[:4]
    data = open(f, 'rb').read()
    crlf = b'\r\n' in data
    lines = data.decode('utf-8').split('\n')
    # first line starting 'Task:' above first '## '
    task_lineno = None
    ntask = 0
    for i, l in enumerate(lines):
        if l.startswith('## '):
            break
        if l.startswith('Task:'):
            ntask += 1
            if task_lineno is None:
                task_lineno = i + 1
    hdr = lines[task_lineno - 1] if task_lineno else ''
    # form
    m = HREF_RE.search(hdr)
    if task_lineno is None:
        form = 'none'
    elif m:
        form = 'href'
    elif '`' in hdr:
        form = 'code'
    else:
        form = 'bare'
    # named path
    if form == 'href':
        label = m.group('label')
        pm = PATH_RE.search(label)
        target = m.group('target')
        target_ok = os.path.exists(os.path.join(os.path.dirname(f), target))
    else:
        pm = PATH_RE.search(hdr)
        target = None; target_ok = None
    named = pm.group(0) if pm else None
    if named is None:
        if form == 'href':
            bucket = 'href-label-brief' if 'brief.md' in m.group('label') else 'href-nopath'
        elif form == 'none':
            bucket = 'none'
        else:
            bucket = 'nopath'
    elif os.path.exists(named):
        bucket = 'live'
    else:
        if re.match(r'ai-agents/tasks/backlog/\d{4}-[^/]+/brief\.md$', named): bucket = 'dead-v1'
        elif re.match(r'ai-agents/tasks/backlog/[^/]+\.md$', named): bucket = 'dead-v2'
        elif re.match(r'ai-agents/tasks/done/[^/]+\.md$', named): bucket = 'dead-v3'
        else: bucket = 'dead-other'
    brief_ok = os.path.exists(os.path.join(os.path.dirname(f), 'brief.md'))
    rows.append(dict(f=f, fid=fid, line=task_lineno, ntask=ntask, crlf=crlf, form=form,
                     named=named, bucket=bucket, target=target, target_ok=target_ok,
                     brief_ok=brief_ok, hdr=hdr))
mode = sys.argv[1] if len(sys.argv) > 1 else 'summary'
if mode == 'summary':
    print('folders:', len(rows))
    print('axis1:', dict(collections.Counter(r['bucket'] for r in rows)))
    print('axis2:', dict(collections.Counter(r['form'] for r in rows)))
    print('form x dead/live:', dict(collections.Counter((r['form'], 'dead' if r['bucket'].startswith('dead') else r['bucket']) for r in rows)))
    print('lines:', dict(collections.Counter(r['line'] for r in rows)))
    print('multi Task:', [r['fid'] for r in rows if r['ntask'] > 1])
    print('crlf:', [r['fid'] for r in rows if r['crlf']])
    print('missing brief.md:', [r['fid'] for r in rows if not r['brief_ok']])
    print('hrefs:', [(r['fid'], r['target'], r['target_ok']) for r in rows if r['form'] == 'href'])
    print('dead set (%d):' % sum(r['bucket'].startswith('dead') for r in rows), ' '.join(r['fid'] for r in rows if r['bucket'].startswith('dead')))
elif mode == 'dead':
    for r in rows:
        if r['bucket'].startswith('dead'): print(r['f'])
elif mode == 'deadhdr':
    for r in rows:
        if r['bucket'].startswith('dead'): print(r['fid'], r['form'], r['bucket'], '|', r['hdr'])
elif mode == 'all':
    for r in rows: print(r['fid'], r['form'], r['bucket'], r['line'], '|', r['hdr'])
```

## Step 2 — the rewrite script and the dry run

List-driven (the 67 from step 1 + `0080`), **line 3 only**; rules R-a / R-b / R-c from plan §2 plus the D3 insert. Every rewritten line is asserted to start with `Task: NNNN — [brief](./brief.md)` where `NNNN` is the folder prefix; the script aborts on any line that does not match one rule exactly once.

### rewrite.py

```python
#!/usr/bin/env python3
"""0168 — rewrite ONLY line 3 of each listed review.md (explicit list, not a sweep).
usage: rewrite.py <listfile>   (paths relative to repo root, one per line)
Rules (plan §2 step 2): R-a non-href, R-b href, R-c 0160 (ID already present),
D3: 0080 has no Task: line -> insert a new line 3 (additive)."""
import os, re, sys
ROOT = '/Users/mark.dolbyrev/Workspace/fkit'
os.chdir(ROOT)
PATH = r'ai-agents/tasks/[A-Za-z0-9./_-]+\.md'
R_HREF = re.compile(r'\[`?' + PATH + r'`?\]\(\./brief\.md\)')   # R-b: whole [label](./brief.md) group
R_ID_CODE = re.compile(r'^(Task: \d{4} — )`' + PATH + r'`')       # R-c: ID present, path in code span
R_PATH = re.compile(r'`?' + PATH + r'`?')                          # R-a: path token with its wrapping
changed = 0
for f in open(sys.argv[1]).read().split():
    fid = f.split('/')[3][:4]
    link = f'{fid} — [brief](./brief.md)'
    data = open(f, encoding='utf-8').read()
    lines = data.split('\n')
    if fid == '0080':                                   # D3: insert, additive only
        assert not any(l.startswith('Task:') for l in lines[:10]), f
        assert lines[2].startswith('**Task-id:**'), f
        lines.insert(2, f'Task: {link}')
    else:
        l3 = lines[2]
        assert l3.startswith('Task: '), f
        if R_HREF.search(l3):                           # R-b
            new, n = R_HREF.subn(link, l3, count=1)
        elif R_ID_CODE.match(l3):                       # R-c
            new, n = R_ID_CODE.subn(r'\1[brief](./brief.md)', l3, count=1)
        else:                                           # R-a
            new, n = R_PATH.subn(link, l3, count=1)
        assert n == 1, f
        assert new.startswith(f'Task: {fid} — [brief](./brief.md)'), (f, new)
        lines[2] = new
    open(f, 'w', encoding='utf-8', newline='').write('\n'.join(lines))
    changed += 1
print('rewrote', changed, 'files')
```

### Dry run — full `git diff -U0` over the 68 listed files, captured **before** the real apply

Procedure: ran `rewrite.py` on the list, captured `git diff -U0 -- <the 68 paths>`, then `git checkout -- <the 68 paths>` (porcelain on the set empty again), recorded the diff here, then applied for real. The applied diff is byte-identical to this one (`cmp` → identical).

Hunk headers in the dry run: `67 × @@ -3 +3 @@`, `1 × @@ -2,0 +3 @@` (`0080`). Changed lines that are not `Task:` lines: **0**. `+` lines not in the exact form `Task: NNNN — [brief](./brief.md)…`: **0**.

```diff
diff --git a/ai-agents/tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/review.md b/ai-agents/tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/review.md
index 57949db..9cc26eb 100644
--- a/ai-agents/tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/review.md
+++ b/ai-agents/tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/review.md
@@ -3 +3 @@
-Task: [`ai-agents/tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md`](./brief.md)
+Task: 0001 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0003-add-dumb-down-skill-for-six-roles/review.md b/ai-agents/tasks/done/0003-add-dumb-down-skill-for-six-roles/review.md
index 6dacb85..129732d 100644
--- a/ai-agents/tasks/done/0003-add-dumb-down-skill-for-six-roles/review.md
+++ b/ai-agents/tasks/done/0003-add-dumb-down-skill-for-six-roles/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/done/add-dumb-down-skill-for-six-roles.md`
+Task: 0003 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0008-add-open-questions-interview-skill-for-six-roles/review.md b/ai-agents/tasks/done/0008-add-open-questions-interview-skill-for-six-roles/review.md
index 639a248..732c433 100644
--- a/ai-agents/tasks/done/0008-add-open-questions-interview-skill-for-six-roles/review.md
+++ b/ai-agents/tasks/done/0008-add-open-questions-interview-skill-for-six-roles/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/done/add-open-questions-interview-skill-for-six-roles.md` (Sprint 2, priority 70)
+Task: 0008 — [brief](./brief.md) (Sprint 2, priority 70)
diff --git a/ai-agents/tasks/done/0010-add-speak-in-simple-terms-output-style/review.md b/ai-agents/tasks/done/0010-add-speak-in-simple-terms-output-style/review.md
index df331e5..f3abd26 100644
--- a/ai-agents/tasks/done/0010-add-speak-in-simple-terms-output-style/review.md
+++ b/ai-agents/tasks/done/0010-add-speak-in-simple-terms-output-style/review.md
@@ -3 +3 @@
-Task: [`ai-agents/tasks/done/add-speak-in-simple-terms-output-style.md`](./brief.md)
+Task: 0010 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0017-assign-global-task-ids-and-create-registry/review.md b/ai-agents/tasks/done/0017-assign-global-task-ids-and-create-registry/review.md
index 967bc06..e216962 100644
--- a/ai-agents/tasks/done/0017-assign-global-task-ids-and-create-registry/review.md
+++ b/ai-agents/tasks/done/0017-assign-global-task-ids-and-create-registry/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/done/assign-global-task-ids-and-create-registry.md` (task 75, ID `0017`) —
+Task: 0017 — [brief](./brief.md) (task 75, ID `0017`) —
diff --git a/ai-agents/tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/review.md b/ai-agents/tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/review.md
index e0148f8..1f0b75e 100644
--- a/ai-agents/tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/review.md
+++ b/ai-agents/tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/build-deterministic-dashboard-script-for-fkit-status.md`
+Task: 0020 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0022-compress-universal-rules-output-style-section/review.md b/ai-agents/tasks/done/0022-compress-universal-rules-output-style-section/review.md
index 700d500..33b6670 100644
--- a/ai-agents/tasks/done/0022-compress-universal-rules-output-style-section/review.md
+++ b/ai-agents/tasks/done/0022-compress-universal-rules-output-style-section/review.md
@@ -3 +3 @@
-Task: [`ai-agents/tasks/done/compress-universal-rules-output-style-section.md`](./brief.md)
+Task: 0022 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0023-converge-ai-agents-additively-on-launch/review.md b/ai-agents/tasks/done/0023-converge-ai-agents-additively-on-launch/review.md
index f0ea29a..3f2270b 100644
--- a/ai-agents/tasks/done/0023-converge-ai-agents-additively-on-launch/review.md
+++ b/ai-agents/tasks/done/0023-converge-ai-agents-additively-on-launch/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/converge-ai-agents-additively-on-launch.md`
+Task: 0023 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/review.md b/ai-agents/tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/review.md
index f4ca395..65a5892 100644
--- a/ai-agents/tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/review.md
+++ b/ai-agents/tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/done/extend-mover-reference-sweep-to-the-knowledge-base.md`
+Task: 0036 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0039-filter-fkit-status-board-to-open-tasks/review.md b/ai-agents/tasks/done/0039-filter-fkit-status-board-to-open-tasks/review.md
index a6d1c31..ba25815 100644
--- a/ai-agents/tasks/done/0039-filter-fkit-status-board-to-open-tasks/review.md
+++ b/ai-agents/tasks/done/0039-filter-fkit-status-board-to-open-tasks/review.md
@@ -3 +3 @@
-Task: [`ai-agents/tasks/done/filter-fkit-status-board-to-open-tasks.md`](./brief.md)
+Task: 0039 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0048-give-every-agent-direct-wiki-query-access/review.md b/ai-agents/tasks/done/0048-give-every-agent-direct-wiki-query-access/review.md
index 23a2e9f..8214fe0 100644
--- a/ai-agents/tasks/done/0048-give-every-agent-direct-wiki-query-access/review.md
+++ b/ai-agents/tasks/done/0048-give-every-agent-direct-wiki-query-access/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/give-every-agent-direct-wiki-query-access.md
+Task: 0048 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/review.md b/ai-agents/tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/review.md
index ba80ca1..635d033 100644
--- a/ai-agents/tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/review.md
+++ b/ai-agents/tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/grant-askuserquestion-tool-to-six-claude-agents.md
+Task: 0049 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0052-implement-pretooluse-skill-ownership-hook/review.md b/ai-agents/tasks/done/0052-implement-pretooluse-skill-ownership-hook/review.md
index eeeb956..6439446 100644
--- a/ai-agents/tasks/done/0052-implement-pretooluse-skill-ownership-hook/review.md
+++ b/ai-agents/tasks/done/0052-implement-pretooluse-skill-ownership-hook/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/implement-pretooluse-skill-ownership-hook.md (task 43)
+Task: 0052 — [brief](./brief.md) (task 43)
diff --git a/ai-agents/tasks/done/0054-implement-spawned-invocation-for-task-movers/review.md b/ai-agents/tasks/done/0054-implement-spawned-invocation-for-task-movers/review.md
index 65f3991..ca28091 100644
--- a/ai-agents/tasks/done/0054-implement-spawned-invocation-for-task-movers/review.md
+++ b/ai-agents/tasks/done/0054-implement-spawned-invocation-for-task-movers/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/implement-spawned-invocation-for-task-movers.md`
+Task: 0054 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0055-implement-task-ship-loop-skill/review.md b/ai-agents/tasks/done/0055-implement-task-ship-loop-skill/review.md
index db17e77..77a4a12 100644
--- a/ai-agents/tasks/done/0055-implement-task-ship-loop-skill/review.md
+++ b/ai-agents/tasks/done/0055-implement-task-ship-loop-skill/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/implement-task-ship-loop-skill.md
+Task: 0055 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0070-relax-tool-allowlists-except-adversarial-reviewer/review.md b/ai-agents/tasks/done/0070-relax-tool-allowlists-except-adversarial-reviewer/review.md
index 2ac53a5..c01990f 100644
--- a/ai-agents/tasks/done/0070-relax-tool-allowlists-except-adversarial-reviewer/review.md
+++ b/ai-agents/tasks/done/0070-relax-tool-allowlists-except-adversarial-reviewer/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/relax-tool-allowlists-except-adversarial-reviewer.md
+Task: 0070 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/review.md b/ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/review.md
index 71331fc..c52f696 100644
--- a/ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/review.md
+++ b/ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/remove-fkit-omnigent-orphan-residue.md
+Task: 0072 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0074-remove-output-variants-from-fkit-status/review.md b/ai-agents/tasks/done/0074-remove-output-variants-from-fkit-status/review.md
index 6e17166..034bdcb 100644
--- a/ai-agents/tasks/done/0074-remove-output-variants-from-fkit-status/review.md
+++ b/ai-agents/tasks/done/0074-remove-output-variants-from-fkit-status/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/remove-output-variants-from-fkit-status.md`
+Task: 0074 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0075-rename-task-plan-skill-to-task-brief/review.md b/ai-agents/tasks/done/0075-rename-task-plan-skill-to-task-brief/review.md
index f89dffd..0c9fe2e 100644
--- a/ai-agents/tasks/done/0075-rename-task-plan-skill-to-task-brief/review.md
+++ b/ai-agents/tasks/done/0075-rename-task-plan-skill-to-task-brief/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/rename-task-plan-skill-to-task-brief.md
+Task: 0075 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/review.md b/ai-agents/tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/review.md
index b1c36c5..7394990 100644
--- a/ai-agents/tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/review.md
+++ b/ai-agents/tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0079-repair-task-links-outside-the-wiki-after-migration/brief.md`
+Task: 0079 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/review.md b/ai-agents/tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/review.md
index 818ff16..6d6c4d4 100644
--- a/ai-agents/tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/review.md
+++ b/ai-agents/tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/review.md
@@ -2,0 +3 @@
+Task: 0080 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0082-restructure-coder-report-summary-then-interview/review.md b/ai-agents/tasks/done/0082-restructure-coder-report-summary-then-interview/review.md
index 547c596..5a3fdf0 100644
--- a/ai-agents/tasks/done/0082-restructure-coder-report-summary-then-interview/review.md
+++ b/ai-agents/tasks/done/0082-restructure-coder-report-summary-then-interview/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/done/restructure-coder-report-summary-then-interview.md
+Task: 0082 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0086-ship-one-skill-one-output-convention-in-scaffold/review.md b/ai-agents/tasks/done/0086-ship-one-skill-one-output-convention-in-scaffold/review.md
index 376563c..2d0b8c9 100644
--- a/ai-agents/tasks/done/0086-ship-one-skill-one-output-convention-in-scaffold/review.md
+++ b/ai-agents/tasks/done/0086-ship-one-skill-one-output-convention-in-scaffold/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/ship-one-skill-one-output-convention-in-scaffold.md
+Task: 0086 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0087-stop-agents-asserting-unchecked-repo-state/review.md b/ai-agents/tasks/done/0087-stop-agents-asserting-unchecked-repo-state/review.md
index 192ef7a..28af084 100644
--- a/ai-agents/tasks/done/0087-stop-agents-asserting-unchecked-repo-state/review.md
+++ b/ai-agents/tasks/done/0087-stop-agents-asserting-unchecked-repo-state/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/stop-agents-asserting-unchecked-repo-state.md
+Task: 0087 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/review.md b/ai-agents/tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/review.md
index 6b9896d..a2f767c 100644
--- a/ai-agents/tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/review.md
+++ b/ai-agents/tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md` (ID `0101`)
+Task: 0101 — [brief](./brief.md) (ID `0101`)
diff --git a/ai-agents/tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/review.md b/ai-agents/tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/review.md
index 737640f..f2772c5 100644
--- a/ai-agents/tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/review.md
+++ b/ai-agents/tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md`
+Task: 0102 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0103-implement-task-folder-name-scheme-change/review.md b/ai-agents/tasks/done/0103-implement-task-folder-name-scheme-change/review.md
index 89b7bfd..010ed59 100644
--- a/ai-agents/tasks/done/0103-implement-task-folder-name-scheme-change/review.md
+++ b/ai-agents/tasks/done/0103-implement-task-folder-name-scheme-change/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0103-implement-task-folder-name-scheme-change/brief.md`
+Task: 0103 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0122-route-coder-ship-loop-close-to-producer/review.md b/ai-agents/tasks/done/0122-route-coder-ship-loop-close-to-producer/review.md
index 5b627fd..a02f326 100644
--- a/ai-agents/tasks/done/0122-route-coder-ship-loop-close-to-producer/review.md
+++ b/ai-agents/tasks/done/0122-route-coder-ship-loop-close-to-producer/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0122-route-coder-ship-loop-close-to-producer/brief.md`
+Task: 0122 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0123-route-sprint-ship-loop-close-to-producer/review.md b/ai-agents/tasks/done/0123-route-sprint-ship-loop-close-to-producer/review.md
index d641f11..2ec825b 100644
--- a/ai-agents/tasks/done/0123-route-sprint-ship-loop-close-to-producer/review.md
+++ b/ai-agents/tasks/done/0123-route-sprint-ship-loop-close-to-producer/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0123-route-sprint-ship-loop-close-to-producer/brief.md`
+Task: 0123 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0124-revert-task-movers-to-producer-only/review.md b/ai-agents/tasks/done/0124-revert-task-movers-to-producer-only/review.md
index 22de343..94ad1e4 100644
--- a/ai-agents/tasks/done/0124-revert-task-movers-to-producer-only/review.md
+++ b/ai-agents/tasks/done/0124-revert-task-movers-to-producer-only/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0124-revert-task-movers-to-producer-only/brief.md`
+Task: 0124 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md b/ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md
index f29abeb..44bf30f 100644
--- a/ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md
+++ b/ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0125-wiki-skills-flag-ready-to-close/brief.md`
+Task: 0125 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0126-wiki-resync-for-adr-033/review.md b/ai-agents/tasks/done/0126-wiki-resync-for-adr-033/review.md
index 9379599..a0a03a6 100644
--- a/ai-agents/tasks/done/0126-wiki-resync-for-adr-033/review.md
+++ b/ai-agents/tasks/done/0126-wiki-resync-for-adr-033/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0126-wiki-resync-for-adr-033/brief.md`
+Task: 0126 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/review.md b/ai-agents/tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/review.md
index 77aa1a7..2e6112f 100644
--- a/ai-agents/tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/review.md
+++ b/ai-agents/tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/brief.md`
+Task: 0132 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0133-build-dual-home-parity-test/review.md b/ai-agents/tasks/done/0133-build-dual-home-parity-test/review.md
index f67ffb1..cd5efa1 100644
--- a/ai-agents/tasks/done/0133-build-dual-home-parity-test/review.md
+++ b/ai-agents/tasks/done/0133-build-dual-home-parity-test/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0133-build-dual-home-parity-test/brief.md`
+Task: 0133 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0136-convert-skill-descriptions-to-block-scalars-and-guard/review.md b/ai-agents/tasks/done/0136-convert-skill-descriptions-to-block-scalars-and-guard/review.md
index 729f6ed..97ef319 100644
--- a/ai-agents/tasks/done/0136-convert-skill-descriptions-to-block-scalars-and-guard/review.md
+++ b/ai-agents/tasks/done/0136-convert-skill-descriptions-to-block-scalars-and-guard/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0136-convert-skill-descriptions-to-block-scalars-and-guard/brief.md`
+Task: 0136 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/review.md b/ai-agents/tasks/done/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/review.md
index fe22bff..87d8d51 100644
--- a/ai-agents/tasks/done/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/review.md
+++ b/ai-agents/tasks/done/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/brief.md`
+Task: 0141 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/review.md b/ai-agents/tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/review.md
index 5d09892..fb5ce3d 100644
--- a/ai-agents/tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/review.md
+++ b/ai-agents/tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0142-investigate-the-skill-ownership-fact-inventory-gap/brief.md`
+Task: 0142 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0143-append-a-dated-correction-note-to-adr-010/review.md b/ai-agents/tasks/done/0143-append-a-dated-correction-note-to-adr-010/review.md
index 946d5d7..db7d7ea 100644
--- a/ai-agents/tasks/done/0143-append-a-dated-correction-note-to-adr-010/review.md
+++ b/ai-agents/tasks/done/0143-append-a-dated-correction-note-to-adr-010/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0143-append-a-dated-correction-note-to-adr-010/brief.md`
+Task: 0143 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/review.md b/ai-agents/tasks/done/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/review.md
index 0dbe8db..d777366 100644
--- a/ai-agents/tasks/done/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/review.md
+++ b/ai-agents/tasks/done/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/brief.md`
+Task: 0147 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md b/ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md
index 0b24172..0e43178 100644
--- a/ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md
+++ b/ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/brief.md`
+Task: 0148 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/review.md b/ai-agents/tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/review.md
index 70cd562..f04a73f 100644
--- a/ai-agents/tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/review.md
+++ b/ai-agents/tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0150-add-verbatim-to-fkit-coder-declared-approval-marker/brief.md`
+Task: 0150 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0151-correct-claude-mds-stale-skills-for-role-location/review.md b/ai-agents/tasks/done/0151-correct-claude-mds-stale-skills-for-role-location/review.md
index 721f05c..e278377 100644
--- a/ai-agents/tasks/done/0151-correct-claude-mds-stale-skills-for-role-location/review.md
+++ b/ai-agents/tasks/done/0151-correct-claude-mds-stale-skills-for-role-location/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0151-correct-claude-mds-stale-skills-for-role-location/brief.md`
+Task: 0151 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0153-wiki-flag-carries-folder-id-and-brief-path/review.md b/ai-agents/tasks/done/0153-wiki-flag-carries-folder-id-and-brief-path/review.md
index 21e9eaf..d71c91b 100644
--- a/ai-agents/tasks/done/0153-wiki-flag-carries-folder-id-and-brief-path/review.md
+++ b/ai-agents/tasks/done/0153-wiki-flag-carries-folder-id-and-brief-path/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0153-wiki-flag-carries-folder-id-and-brief-path/brief.md`
+Task: 0153 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/review.md b/ai-agents/tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/review.md
index 484adaa..3511f42 100644
--- a/ai-agents/tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/review.md
+++ b/ai-agents/tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0157-state-task-brief-step-5s-append-rule-in-full/brief.md`
+Task: 0157 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/review.md b/ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/review.md
index 8bc40a8..0d9f394 100644
--- a/ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/review.md
+++ b/ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/brief.md`
+Task: 0158 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/review.md b/ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/review.md
index f8822ff..6b89fc3 100644
--- a/ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/review.md
+++ b/ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/brief.md`
+Task: 0159 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates/review.md b/ai-agents/tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates/review.md
index 3b26517..13c8efc 100644
--- a/ai-agents/tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates/review.md
+++ b/ai-agents/tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates/review.md
@@ -3 +3 @@
-Task: 0160 — `ai-agents/tasks/backlog/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md`
+Task: 0160 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/review.md b/ai-agents/tasks/done/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/review.md
index cd17d15..4f46908 100644
--- a/ai-agents/tasks/done/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/review.md
+++ b/ai-agents/tasks/done/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/brief.md`
+Task: 0161 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/review.md b/ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/review.md
index 7f75aaf..9a830d8 100644
--- a/ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/review.md
+++ b/ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/brief.md`
+Task: 0162 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/review.md b/ai-agents/tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/review.md
index d5516c2..e359ff9 100644
--- a/ai-agents/tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/review.md
+++ b/ai-agents/tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/brief.md`
+Task: 0167 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0171-write-the-durable-citation-anchors-convention-page/review.md b/ai-agents/tasks/done/0171-write-the-durable-citation-anchors-convention-page/review.md
index 4d591b5..fe4b8e0 100644
--- a/ai-agents/tasks/done/0171-write-the-durable-citation-anchors-convention-page/review.md
+++ b/ai-agents/tasks/done/0171-write-the-durable-citation-anchors-convention-page/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0171-write-the-durable-citation-anchors-convention-page/brief.md`
+Task: 0171 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/review.md b/ai-agents/tasks/done/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/review.md
index 8779260..20c72f4 100644
--- a/ai-agents/tasks/done/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/review.md
+++ b/ai-agents/tasks/done/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/brief.md`
+Task: 0174 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block/review.md b/ai-agents/tasks/done/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block/review.md
index 00fa5f9..c9d8905 100644
--- a/ai-agents/tasks/done/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block/review.md
+++ b/ai-agents/tasks/done/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block/brief.md`
+Task: 0190 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/review.md b/ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/review.md
index 23c11f1..a4e0e43 100644
--- a/ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/review.md
+++ b/ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/brief.md`
+Task: 0191 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/review.md b/ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/review.md
index f9ac1b3..9051f77 100644
--- a/ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/review.md
+++ b/ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/brief.md`
+Task: 0195 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0198-teach-record-decision-the-dated-correction-note-form/review.md b/ai-agents/tasks/done/0198-teach-record-decision-the-dated-correction-note-form/review.md
index 394e517..76b78d7 100644
--- a/ai-agents/tasks/done/0198-teach-record-decision-the-dated-correction-note-form/review.md
+++ b/ai-agents/tasks/done/0198-teach-record-decision-the-dated-correction-note-form/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0198-teach-record-decision-the-dated-correction-note-form/brief.md`
+Task: 0198 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/review.md b/ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/review.md
index daaafb6..831441d 100644
--- a/ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/review.md
+++ b/ai-agents/tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/brief.md`
+Task: 0200 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/review.md b/ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/review.md
index f71a1b2..da991d9 100644
--- a/ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/review.md
+++ b/ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/brief.md`
+Task: 0202 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/review.md b/ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/review.md
index 5a5b891..4837ef7 100644
--- a/ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/review.md
+++ b/ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0218-repair-0177s-stale-cap-and-byte-figures/brief.md`
+Task: 0218 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0241-design-the-post-update-structure-check-against-a-shipped-spec/review.md b/ai-agents/tasks/done/0241-design-the-post-update-structure-check-against-a-shipped-spec/review.md
index 32558c6..bd5e258 100644
--- a/ai-agents/tasks/done/0241-design-the-post-update-structure-check-against-a-shipped-spec/review.md
+++ b/ai-agents/tasks/done/0241-design-the-post-update-structure-check-against-a-shipped-spec/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/0241-design-the-post-update-structure-check-against-a-shipped-spec/brief.md
+Task: 0241 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/review.md b/ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/review.md
index 295391d..eda449b 100644
--- a/ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/review.md
+++ b/ai-agents/tasks/done/0246-build-the-consent-gated-repair-path-inside-the-check-skill/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/0246-build-the-consent-gated-repair-path-inside-the-check-skill/brief.md
+Task: 0246 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability/review.md b/ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability/review.md
index f52ecf6..3341303 100644
--- a/ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability/review.md
+++ b/ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability/review.md
@@ -3 +3 @@
-Task: ai-agents/tasks/backlog/0248-update-the-docs-for-the-structure-check-capability/brief.md
+Task: 0248 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/review.md b/ai-agents/tasks/done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/review.md
index feb8b1f..f68937e 100644
--- a/ai-agents/tasks/done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/review.md
+++ b/ai-agents/tasks/done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md`
+Task: 0252 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/review.md b/ai-agents/tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/review.md
index 3ff5922..70c152f 100644
--- a/ai-agents/tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/review.md
+++ b/ai-agents/tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md`
+Task: 0253 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0256-gate-releases-so-an-untested-tree-cannot-ship/review.md b/ai-agents/tasks/done/0256-gate-releases-so-an-untested-tree-cannot-ship/review.md
index c783c0d..6abcc53 100644
--- a/ai-agents/tasks/done/0256-gate-releases-so-an-untested-tree-cannot-ship/review.md
+++ b/ai-agents/tasks/done/0256-gate-releases-so-an-untested-tree-cannot-ship/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md`
+Task: 0256 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/review.md b/ai-agents/tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/review.md
index 237a928..195ca4e 100644
--- a/ai-agents/tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/review.md
+++ b/ai-agents/tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/brief.md`
+Task: 0259 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/review.md b/ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/review.md
index 8ac65ae..92c6d95 100644
--- a/ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/review.md
+++ b/ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/brief.md`
+Task: 0268 — [brief](./brief.md)
diff --git a/ai-agents/tasks/done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md b/ai-agents/tasks/done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md
index 7e1ea41..24bd42f 100644
--- a/ai-agents/tasks/done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md
+++ b/ai-agents/tasks/done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md
@@ -3 +3 @@
-Task: `ai-agents/tasks/backlog/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md`
+Task: 0306 — [brief](./brief.md)
```

## Step 3 — apply, and before/after per variant and per form (plan §4 check 7)

| Case | ID | Before (line 3) | After (line 3) |
|---|---|---|---|
| variant 1, code span (R-a) | `0148` | ``Task: `ai-agents/tasks/backlog/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/brief.md` `` | `Task: 0148 — [brief](./brief.md)` |
| variant 2, bare (R-a) | `0048` | `Task: ai-agents/tasks/backlog/give-every-agent-direct-wiki-query-access.md` | `Task: 0048 — [brief](./brief.md)` |
| variant 3, code span (R-a) | `0003` | ``Task: `ai-agents/tasks/done/add-dumb-down-skill-for-six-roles.md` `` | `Task: 0003 — [brief](./brief.md)` |
| href (R-b) | `0001` | ``Task: [`ai-agents/tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md`](./brief.md)`` | `Task: 0001 — [brief](./brief.md)` — target `./brief.md` byte-identical |
| ID present (R-c) | `0160` | ``Task: 0160 — `ai-agents/tasks/backlog/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md` `` | `Task: 0160 — [brief](./brief.md)` |
| trailer (R-a) | `0008` | ``Task: `ai-agents/tasks/done/add-open-questions-interview-skill-for-six-roles.md` (Sprint 2, priority 70)`` | `Task: 0008 — [brief](./brief.md) (Sprint 2, priority 70)` |
| trailer (R-a) | `0017` | ``Task: `ai-agents/tasks/done/assign-global-task-ids-and-create-registry.md` (task 75, ID `0017`) —`` | ``Task: 0017 — [brief](./brief.md) (task 75, ID `0017`) —`` |
| trailer (R-a) | `0052` | `Task: ai-agents/tasks/backlog/implement-pretooluse-skill-ownership-hook.md (task 43)` | `Task: 0052 — [brief](./brief.md) (task 43)` |
| trailer (R-a) | `0101` | ``Task: `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md` (ID `0101`)`` | ``Task: 0101 — [brief](./brief.md) (ID `0101`)`` |
| D3 insert | `0080` | *(no `Task:` line; line 3 was `**Task-id:** \`report-backlog-board-in-fkit-status-on-request-only\` · **Sprint 2, priority 68**`)* | new line 3 `Task: 0080 — [brief](./brief.md)`; the old line 3 is now line 4, unchanged |

Trailers' stale ranks / old task numbers are frozen claims (Case 1, `0159`'s territory) — carried byte-identical, not repaired.

## Step 4 — freeze list (self-hits deliberately NOT touched, per `0325` step-7 shape)

Everything below line 3 in every file of the set is byte-identical (check 2/3). Measured 2026-08-26 post-edit:

| Self-hit class | Where | Count | Reason not touched |
|---|---|---|---|
| `File(s) under review:` line naming the ledger's own `backlog/` path | `0151` `0157` `0218` `0241` `0253` (5 ledgers, first line of the field) | 5 | evidence line, **frozen** (`0325`, role prong — it is a review-scope record, not a self-locator). Plan §2 step 4 said "at least `0151`, `0157`, `0253`"; measured 5 on the field's first line. (The plan's "12 ledgers mention their own folder there" counted the multi-line field; my one-line grep sees 5 — same class, same disposition.) |
| Own `backlog/<NNNN>-…` path anywhere in the body (below line 3) | `0103`:3 `0122`:2 `0123`:5 `0125`:2 `0132`:3 `0136`:1 `0142`:2 `0147`:5 `0148`:1 `0150`:3 `0151`:1 `0153`:2 `0157`:3 `0161`:5 `0162`:3 `0171`:2 `0174`:1 `0218`:3 `0241`:1 `0253`:1 | 20 ledgers / 49 lines | body citations, **frozen** — out of scope by `0160` §4.6 (headers only) |
| Verbatim quote carrying a dead path | `0148/review.md:79` (`producer runs /fkit-task-done on ai-agents/tasks/backlog/0148-…`) | 1 | quote; append-not-rewrite is the only licensed form for quotes and this task adds no annotations |
| Dead `backlog/`/`done/` paths below line 3 across the **whole** `done/` corpus (positive existence test, distinct per file) | `0010` `0017` `0020` `0022` `0036` `0072` `0075` `0080` `0082` `0101` `0103` `0122` `0123` `0125` `0132` `0140` `0142` `0148` `0153` `0157` `0159` `0160` `0162` `0174` `0190` `0218` `0241` `0325` | 28 files / 41 distinct dead paths | body-level, out of scope (`0160` §4.6 said 16 body-level dead paths; this wider count is a superset measured with a different unit — distinct dead path tokens per file — recorded here so the producer has the number, not as a scope change) |
| Line 1 `# Review — <slug>` titles (no 4-digit ID) in the set | `0001` `0003` `0008` `0010` `0017` `0020` `0022` `0023` `0036` `0039` `0048` `0049` `0052` `0054` `0055` `0070` `0072` `0074` `0075` `0082` `0086` `0087` `0101` `0080` | 24 of the 68 | a title, not a locator — untouched. Corpus-wide re-measure 2026-08-26 (review R1): **24** line-1 titles carry no 4-digit ID at all, **all 24 inside this set — none outside**. The plan's "46 old ledgers" (plan §2 step 4) is labelled "`# Review — <slug>` titles" — the plan's `<slug>` vocabulary (§1, `backlog/<slug>.md` vs `<NNNN>-<slug>`) names the no-ID class — yet its number matches the broader class; label and number disagree, and the broader-class reading below is my inference from the number, not the plan's stated intent (review R3). Broader class = every line 1 that is not exactly `# Review — NNNN`: 23 slug-only + 22 `NNNN-slug` + 1 prose title (`0080`) = 46, of which 34 sit in the set and 12 outside (`0062` `0104` `0105` `0106` `0110` `0111` `0112` `0117` `0119` `0139` `0140` `0177`, all `NNNN-slug`). A different class, not 22 more no-ID titles. |
| `0080` line 4 `**Task-id:** \`<slug>\` · **Sprint 2, priority 68**` | `0080` | 1 | old bold field block; D3 is additive only — the field stays as evidence |

## Verification — plan §4, all ten checks (run post-apply, HEAD `493cecd`)

1. **numstat.** `git diff --numstat -- 'ai-agents/tasks/done/*/review.md'` → `67 × "1 1"`, `1 × "1 0"` (`0080`), plus **one path not from this task**: `0203-…/review.md` `3 3` — the driver's pre-existing `M` (in the session-start status; its hunks are at lines 76/170/274, not line 3; it is not in my input list). All 68 listed paths present in numstat; nothing else. ✓
2. **Hunks.** Over the 68 paths: `67 × @@ -3 +3 @@`, `1 × @@ -2,0 +3 @@`. ✓
3. **Only `Task:` lines changed.** `git diff -U0 -- <68> | grep '^[-+]' | grep -v '^[-+][-+]' | grep -v -E '^-Task: |^\+Task: '` → **0 lines**. ✓
4. **Classifier post-edit.** 121 folders; axis 1 `{href-nopath: 68, live: 51, href-label-brief: 2}` → **0 dead**; axis 2 `{href: 70, code: 26, bare: 25}`; sum 121. Exact-form `grep -a -c '^Task: [0-9]\{4\} — \[brief\](\./brief\.md)'` summed over `done/*/review.md` = **68** (≥ 67). Without `-a` the sum is 67: `0246/review.md` carries a **pre-existing NUL byte at line 92** (HEAD's copy is also `file` → `data`), so the default-locale grep skips it as binary — its line 3 is correct (`od -c` shows `Task: 0246 — [brief](./brief.md)`), its numstat is `1 1`. Per-file `NNNN == folder prefix` on all 68 (sed line 3, per file): **0 mismatches**. ✓
5. **Hrefs.** All 6 targets resolve before and after; targets byte-identical: `0001`/`0010`/`0022`/`0039`/`0177` `(./brief.md)` → `(./brief.md)`; `0254` `(brief.md)` → `(brief.md)`. `0177`/`0254` absent from numstat (0 rows). ✓
6. **51 live headers absent from the diff.** 50 of 51 absent; the one present is `0203` — the driver's pre-existing modification (check 1), not a header edit. ✓ (with that named exception)
7. **Before/after pairs** — table in Step 3 above (variant-1 code `0148`, variant-2 bare `0048`, variant-3 code `0003`, href `0001`, `0160`, trailers `0008` `0017` `0052` `0101`, D3 `0080`). ✓
8. **Tests.** `node --test test/*.test.js` → **tests 774, suites 24, pass 774, fail 0, cancelled 0, skipped 0, todo 0** (44.8 s). Same 774 as `0325`'s last run. `prove-red.sh` **not run** — no test file changed. ✓
9. **Skill files.** `git diff --name-only -- claude/` shows `claude/fkit-claude.sh`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/skills/fkit-task-done/SKILL.md` — **none from this task**: my script writes only the 68 listed `review.md` paths; these are the driver's parallel working-tree changes (the set differs from the session-start snapshot because the driver committed in between — HEAD moved `c45ec3d` → `493cecd` before my build started; my edits are in no commit). ✓
10. **No sprint file read or touched.** `ai-agents/sprints/done/sprint-2.md` not read; no regex run over it. `git status --porcelain -- ai-agents/sprints/reviews/` → 0. (I did read line 3 of the two `ai-agents/sprints/reviews/sprint2-*.md` ledgers to record the residual below — read only.) ✓

Note for a reviewer re-running check 4: use `grep -a` (or the per-file loop) — the `0246` NUL is not this task's and is left as found (body bytes frozen).

## Items 2–5 of the brief (plan §3) — as built

- **Item 2 (generator schema line):** D4 — **deferred to `0326`**; `claude/skills/fkit-stateful-review` and `fkit-process-stateful-review` untouched.
- **Item 3 (movers):** no new duty; `0325`'s self-locator rule + the now-path-free headers make the form idempotent through future moves. Stated, not edited.
- **Item 4 (`cancelled/`):** 11 folders, **0 `review.md`** (re-measured 2026-08-26). Nothing to sweep.
- **Item 5 (`0080`):** D3 — inserted `Task: 0080 — [brief](./brief.md)` as a new line 3; old field block kept.

## Residuals — flagged, no decision needed (plan §5/§6)

- Body-level dead paths: 28 `done/` ledgers / 41 per-ledger-distinct dead path tokens below line 3 (**37 distinct corpus-wide** — 4 tokens each appear in 2 ledgers; review R2) (superset of `0160` §4.6's 16) — out of scope, frozen.
- Sprint-keyed ledgers `ai-agents/sprints/reviews/sprint2-scaffold-launcher-hardening.md:3` and `sprint2-shared-instructions-delivery.md:3` carry Gap-B-shaped headers (dead flat `tasks/backlog/<slug>.md` labels, live `../../tasks/done/…` targets) — outside this brief's population, not swept; for the producer.
- `0248 plan.md` / `0218 worklog.md` — `0343`'s.
- `0168` board cell still reads *"needs 0160, hard"* — frozen note, for the closing producer.
- `0175` guard (`ID == folder prefix` for every ledger) stays red on the 51 live path-form headers + `0177`/`0254` until `0326` lands — dependency finding for `0175`.
- `0326` picks the schema form for new ledgers; the 67 here carry the form `0160` ruled canonical (D2).

## Deliberately not done

- No commit, no push, no task-file move (close routes to `@fkit-producer` via the driver).
- No edit to `plan.md`, the brief, any board, `claude/skills/*` (D4), movers, `ai-agents/wiki-vault/`, `cancelled/`, `ai-agents/sprints/reviews/`.
- The 51 live path-form headers and the 2 label-`brief.md` hrefs (`0177`, `0254`) untouched (D1).
- `prove-red.sh` not run (no test change).
- Trailers' stale ranks / old task numbers not repaired (frozen, `0159`).

## Process-review — Round 1 (2026-08-26, HEAD `493cecd`)

Ledger: [review.md](./review.md). Reviewer findings R1 (low) + R2 (nit), both worklog wording; the 68-file diff was not touched. `plan.md` blob re-confirmed `84eba6635341c87b9780f75841ebcf776ce2c0dd` before starting.

**Re-measures (first-hand, corpus = `ai-agents/tasks/done/*/review.md`, 121 files):**

| What | Count | Detail |
|---|---|---|
| line 1 not exactly `# Review — NNNN` (the class the plan's **number** 46 matches — its **label** "`# Review — <slug>` titles" names the no-ID class; that the plan counted this class is inferred, R3) | **46** | 75 canonical `NNNN`; 23 slug-only; 22 `NNNN-slug`; 1 prose title (`0080`). 34 of the 46 in the 68-set, 12 outside (all `NNNN-slug`) |
| line 1 with no 4-digit ID at all (worklog row's class) | **24** | all 24 inside the 68-set, 0 outside — `0001` `0003` `0008` `0010` `0017` `0020` `0022` `0023` `0036` `0039` `0048` `0049` `0052` `0054` `0055` `0070` `0072` `0074` `0075` `0080` `0082` `0086` `0087` `0101` |
| body-level (line ≥ 4) dead `ai-agents/tasks/…md` tokens, `classify.py` `PATH_RE`, positive existence test | **28 files / 41 per-file-distinct / 37 corpus-distinct** | same 28 IDs as the freeze table; the 4 tokens present in 2 ledgers each: `backlog/assert-task-ids-are-unique-in-the-test-suite.md`, `backlog/gate-read-side-symlink-hazard-in-init.md`, `backlog/0162-.../plan.md`, `backlog/0177-…/brief.md`. Restricting the regex to `backlog|done` gives the identical 28 / 41 / 37 |

**Dispositions:** R1 **PARTIALLY CORRECT** — the "24 sit inside this set" wording did imply 22 no-ID titles outside the set (false: 0 outside); but the plan's 46 is a correct count of a broader class, not a mis-measure, so the line now names both classes instead of declaring 46 wrong. R2 **CORRECT** — 41 is the per-ledger sum, 37 corpus-distinct; bullet relabelled. The freeze table's own Count cell (`28 files / 41 distinct dead paths`, class column already says "distinct per file") left as is — the reviewer called it correctly labelled and it is. Severity as assigned by me: both worklog-only wording, no diff line depends on either → low / nit stand.

**Verification after the edits:** `git diff --numstat -- 'ai-agents/tasks/done/*/review.md'` unchanged from Build — 67 × `1 1`, `0080` `1 0`, plus the driver's pre-existing `0203` `3 3`; my edits this round are confined to this task folder's `review.md` (Coder response + Status) and `worklog.md`. **Tests:** `node --test test/*.test.js` → **tests 774, suites 24, pass 774, fail 0, cancelled 0, skipped 0, todo 0** (44.1 s), run after the edits. `prove-red.sh` not run (no test file changed). `brief.md` shows `M` in `git status` (1 insertion / 1 deletion) — pre-existing, file mtime 15:30 predates the Build spawn; not touched this round.

## Process-review — Round 2 (2026-08-26, HEAD `493cecd`)

R3 (nit) **CORRECT**: `plan.md:56` labels the 46 as "`# Review — <slug>` titles" and the plan's §1 vocabulary uses `<slug>` for the no-ID form (`backlog/<slug>.md`, `done/<slug>.md`) with `<NNNN>-<slug>` as a separate token — so the plan's label names the 24-class while its number matches the 46-class. The two clauses above now say the label and number disagree and that the broader-class reading is my inference. Counts unchanged (24 / 46 / 34-in / 12-out). Reviewer confirmed R1 grading, R2 counts, numstat identical; no Round 3 needed. `git diff --numstat -- 'ai-agents/tasks/done/*/review.md'` re-run after the edit: 67 × `1 1`, `0080` `1 0`, driver's `0203` `3 3` — unchanged. Status stays **closed-out**.

