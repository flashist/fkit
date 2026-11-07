import sys,pathlib,json,subprocess,re,datetime
E=pathlib.Path(__file__).resolve().parent
T=E.parent.parent
lane=sys.argv[1]
commands={
'launcher':'node --test test/launcher-contract.test.js',
'functional':"node --test --test-skip-pattern='^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js",
'prove-red':'npm run test:prove-red',
'whitespace':'git diff --check -- claude/agents/fkit-lead.md claude/skills/fkit-sprint-ship-loop/SKILL.md codex/server.mjs codex/materialize.mjs codex/README.md CHANGELOG.md test/launcher-contract.test.js'}
cmd=commands[lane]; tag=sys.argv[2] if len(sys.argv)>2 else lane
assert not (E/(tag+'.json')).exists()
checkpoint={'lane':lane,'command':cmd,'state':'started','dateUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'authority':'Verify-only, full approved R1 plan, relayed owner 2026-11-06 user chat: I approve it','outstanding':'Complete this lane, inspect actual exit/results, then remaining approved lanes. No source fixes or extra old-task retries.'}
(E/(tag+'-checkpoint.json')).write_text(json.dumps(checkpoint,indent=2)+'\n')
with (T/'worklog.md').open('a') as f:f.write('\n- Durable lane start: `'+tag+'`; command `'+cmd+'`. Checkpoint saved before child launch.\n')
p=subprocess.run(cmd,shell=True,executable='/bin/zsh',stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
raw=p.stdout.decode(errors='replace')
def sanitize(s):
 s=re.sub(r'https?://[^\s<>\"\x27]+','[redacted-address]',s)
 s=re.sub(r'(?i)(api[_-]?key|password|credential|authorization|dsn)(\s*[=:]\s*)[^\s,;]+',r'\1\2[redacted]',s)
 s=re.sub(r'(?<![\w.])(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?', '[redacted-address]', s)
 return s
(E/(tag+'.log')).write_text(sanitize(raw))
kept=[]
if lane=='prove-red':
 for match in re.findall(r'kept this step\x27s output: ([^\n]+)',raw):
  source=pathlib.Path(match.strip())
  if source.is_file():
   dest=E/('prove-red-step-'+source.name)
   dest.write_text(sanitize(source.read_text(errors='replace'))); kept.append(str(dest.relative_to(T)))
counts={k:int(v) for k,v in re.findall(r'^(?:#|ℹ) (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)$',raw,re.M)}
result={'command':cmd,'childExit':p.returncode,'wrapperResult':'completed child and saved evidence','counts':counts,'failedNames':sorted(set(re.findall(r'^\s*not ok \d+ - (.+)$',raw,re.M)+[re.sub(r' \([^)]*ms\)$','',name) for name in re.findall(r'^✖ (?!failing tests:)(.+)$',raw,re.M)])),'keptArtifacts':kept}
(E/(tag+'.json')).write_text(json.dumps(result,indent=2)+'\n')
with (T/'worklog.md').open('a') as f:f.write('\n- Lane `'+tag+'` child exit '+str(p.returncode)+'; counts '+json.dumps(counts)+'; evidence `evidence/verify/'+tag+'.{json,log}`. Wrapper completion is independent of child success.\n')
print(json.dumps(result));sys.exit(0)
