import glob
import hashlib
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path.cwd()
TASK = pathlib.Path(__file__).resolve().parent.parent
EVIDENCE = TASK / 'evidence'
LABEL = 'Task0520 — Stop the update check\'s git ls-remote from prompting over ssh'

def digest(path):
    p = pathlib.Path(path)
    return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None

def save(name, record):
    (EVIDENCE / name).write_text(json.dumps(record, indent=2) + '\n')

def clean(value):
    lines = [line for line in value.splitlines() if not re.search(r'\bduration_ms\b', line)]
    return re.sub(r' \([0-9.]+ms\)', '', '\n'.join(lines)) + '\n'

def run(label, command):
    save('verify-' + label + '-checkpoint.json', {
        'task': LABEL, 'state': 'starting', 'command': command,
        'sourceChanges': 'NONE', 'decisionLog': 'none',
    })
    child = subprocess.run(command, capture_output=True, text=True)
    out, err = clean(child.stdout), clean(child.stderr)
    (EVIDENCE / ('verify-' + label + '.log')).write_text(out + err)
    counts = dict((key, int(value)) for key, value in re.findall(
        r'^(?:ℹ |# )(tests|suites|pass|fail|cancelled|skipped|todo) (\d+)\s*$', out, re.M))
    selected = [line for line in out.splitlines() if re.match(r'^[✔✖﹣]|^# Subtest:|^not ok |^ok ', line)]
    record = {'task': LABEL, 'command': command, 'childExit': child.returncode,
              'counts': counts, 'selectedCaseLines': selected, 'stdout': out, 'stderr': err}
    if label == 'prove-red':
        record['stepResults'] = [line for line in out.splitlines() if re.match(r'^(?:0[bc]|1|2|30|31)\. ', line)]
        record['gateLines'] = [line for line in out.splitlines() if 'hard gate ' in line]
    save('verify-' + label + '.json', record)
    print(json.dumps({'lane': label, 'childExit': child.returncode, 'counts': counts,
                      'stepResults': record.get('stepResults', [])}), flush=True)
    return record

mode = sys.argv[1]
if mode == 'preflight':
    audit = json.loads((EVIDENCE / 'build-audit.json').read_text())
    baseline = json.loads((EVIDENCE / 'build-baseline.json').read_text())
    expected = dict(baseline['protectedAndUnrelated'])
    expected.update(audit['afterSha256'])
    expected[str((EVIDENCE / 'build-audit.json').relative_to(ROOT))] = 'd3db24104949af01b8ca9d05b80438d06a198120db71f2653e73e69fc013ed20'
    expected[str((EVIDENCE / 'build-source.diff').relative_to(ROOT))] = '019673d62862ede2e7653de2f7d2eed43d601fef56cd270bcb5092376f802b94'
    mismatch = {p: {'expected': h, 'actual': digest(p)} for p, h in expected.items() if digest(p) != h}
    index = digest('.git/index')
    if index != audit['indexSha256']:
        mismatch['.git/index'] = {'expected': audit['indexSha256'], 'actual': index}
    listing = subprocess.run(['git', 'ls-files', '-co', '--exclude-standard', '-z'], capture_output=True, check=True)
    paths = sorted(set(p for p in listing.stdout.decode().split('\0') if p))
    protected = {p: digest(p) for p in paths if p != str((TASK / 'worklog.md').relative_to(ROOT))}
    blobs = {}
    for name, info in audit['protectedPlans'].items():
        p = TASK / name
        data = p.read_bytes()
        blob = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        blobs[name] = {'sha256': digest(p), 'gitBlob': blob}
        if blobs[name] != info:
            mismatch[name] = {'expected': info, 'actual': blobs[name]}
    save('verify-preflight.json', {'task': LABEL, 'expectedFingerprintCount': len(expected),
        'mismatches': mismatch, 'protectedPlans': blobs, 'indexSha256': index,
        'protected': protected, 'buildProtectedCount': len(baseline['protectedAndUnrelated']),
        'sourceSha256': audit['afterSha256'], 'sourceChanges': 'NONE',
        'decisionLog': 'none', 'authority': 'Relayed owner approval; trusted declaration, not independently authenticated.',
        'lanes': {'filteredDefaultEquivalent': 'pending', 'existingProveRed': 'pending'}})
    print(json.dumps({'preflight': 'PASS' if not mismatch else 'FAIL', 'mismatches': mismatch,
                      'protectedFileCount': len(protected), 'buildProtectedCount': len(baseline['protectedAndUnrelated'])}))
    sys.exit(bool(mismatch))
elif mode == 'filtered':
    command = ['node', '--test', '--test-skip-pattern=^(?:0284/(?:git-deadline|term-ignored|no-stray):|fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$)']
    command += sorted(glob.glob('test/*.test.js')) + sorted(glob.glob('test/board/*.test.js'))
    result = run('filtered', command)
    sys.exit(result['childExit'])
elif mode == 'prove-red':
    result = run('prove-red', ['npm', 'run', 'test:prove-red'])
    sys.exit(result['childExit'])
elif mode == 'finalize':
    before = json.loads((EVIDENCE / 'verify-preflight.json').read_text())
    changes = {p: {'before': h, 'after': digest(p)} for p, h in before['protected'].items() if digest(p) != h}
    checks = {}
    for label in ['filtered', 'prove-red']:
        p = EVIDENCE / ('verify-' + label + '.json')
        checks[label] = json.loads(p.read_text()) if p.exists() else {'state': 'UNEXECUTED'}
    whitespace = subprocess.run(['git', 'diff', '--check', '--', 'claude/fkit-claude.sh', 'test/update-banner.test.js', 'CHANGELOG.md'], capture_output=True, text=True)
    record = {'task': LABEL, 'sourceChanges': 'NONE', 'decisionLog': 'none',
        'protectedFileCount': len(before['protected']), 'protectedChanges': changes,
        'sourceSha256': {p: digest(p) for p in before['sourceSha256']},
        'indexSha256': digest('.git/index'), 'indexUnchanged': digest('.git/index') == before['indexSha256'],
        'scopedWhitespace': {'childExit': whitespace.returncode, 'stdout': clean(whitespace.stdout), 'stderr': clean(whitespace.stderr)},
        'checks': {label: {k: v for k, v in check.items() if k not in ['stdout', 'stderr', 'selectedCaseLines']} for label, check in checks.items()},
        'globalWhitespace': 'Not repeated: Build exit 2 on byte-preserved archived Task0552 — Remove test timing restrictions artifacts.',
        'limitations': ['Filtered coverage only; unfiltered default suite not run.',
            'Three named banner bodies and exact mixed board body deferred per approved amendment.',
            'Existing opt-in benchmark remains skipped.', 'Native HTTPS/TLS/proxy, live authentication and Linux UNVERIFIED.',
            'Review, Process-review and producer closure remain separate driver phases.']}
    record['verificationPassed'] = (not changes and record['indexUnchanged'] and whitespace.returncode == 0
        and all(check.get('childExit') == 0 for check in checks.values()))
    save('verify-final-audit.json', record)
    print(json.dumps(record, indent=2))
    sys.exit(not record['verificationPassed'])
