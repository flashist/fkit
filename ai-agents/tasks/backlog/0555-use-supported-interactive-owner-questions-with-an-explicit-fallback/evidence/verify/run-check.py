from pathlib import Path
import glob
import json
import os
import re
import subprocess
import sys

VERIFY = Path(__file__).resolve().parent
lane = sys.argv[1]
commands = {
    'launcher': ['node', '--test', 'test/launcher-contract.test.js'],
    'filtered': ['node', '--test', '--test-skip-pattern=^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:', *sorted(glob.glob('test/*.test.js')), *sorted(glob.glob('test/board/*.test.js'))],
    'prove-red': ['npm', 'run', 'test:prove-red'],
}
command = commands[lane]
env = os.environ.copy()
if lane == 'prove-red':
    capture = VERIFY / 'prove-red-children'
    capture.mkdir(exist_ok=False)
    env['FKIT_VERIFY_CHILD_CAPTURE'] = str(capture)
    env['BASH_FUNC_node%%'] = '''() {
      if [ "$1" = --test ] && { [ "${2##*/}" = launcher-contract.test.js ] || [ "${2##*/}" = skill-ownership-hook.test.js ]; }; then
        local file rc
        file="$(mktemp "$FKIT_VERIFY_CHILD_CAPTURE/child.XXXXXX")"
        command node "$@" >"$file.stdout" 2>"$file.stderr"
        rc=$?
        printf '%s\n' "$rc" >"$file.exit"
        printf '%s\n' "$@" >"$file.argv"
        printf '%s\n' "${FKIT_LAUNCHER:-${FKIT_SKILL_OWNERSHIP_HOOK:-}}" >"$file.target"
        cat "$file.stdout"
        cat "$file.stderr" >&2
        return "$rc"
      fi
      command node "$@"
    }'''
out = VERIFY / (lane + '.stdout')
err = VERIFY / (lane + '.stderr')
if out.exists() or err.exists():
    raise SystemExit('Refusing to overwrite existing check evidence')
with out.open('wb') as stdout, err.open('wb') as stderr:
    child = subprocess.run(command, stdout=stdout, stderr=stderr, env=env)
text = out.read_text() + '\n' + err.read_text()
counts = {k: int(v) for k, v in re.findall(r'^[#ℹ] (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)', text, re.M)}
record = {'command': command, 'exit': child.returncode, 'counts': counts, 'provenance': 'Fresh Verify execution', 'permissionContext': os.environ.get('FKIT_VERIFY_PERMISSION_CONTEXT', 'restricted workspace-write'), 'childCapture': 'Bash function captures each existing prove-red node --test invocation once; original argv and return status preserved, only disposable script-owned mutations' if lane == 'prove-red' else None}
(VERIFY / (lane + '.json')).write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps(record, indent=2))
sys.exit(child.returncode)
