from pathlib import Path
import json,re,hashlib,subprocess,datetime,difflib
S=Path(__file__).resolve().parent; C=json.loads((S/'config.json').read_text()); R=Path(C['root'])
original=(S/'original-static.js').read_text(); reference=(S/'safe-reference.mjs').read_text(); observed=(S/'observed.mjs').read_text()
checks=[]
def check(name, value):
    checks.append({'check':name,'passed':bool(value)})
    assert value,name

def section(s,start,end):
    return s[s.index(start):s.index(end,s.index(start))]
check('original static bytes still match current target',original==(R/'test/update-banner.test.js').read_text())
for name,s in [('safe-reference',reference),('observed',observed)]:
    check(name+' shared reap entirely inert',re.search(r'function reap\(pids\) \{\n  return;\n\}',s) is not None)
    check(name+' all four reap callers preserved',s.count('    reap(')==4)
    check(name+' only original signal-0 probe',re.findall(r'process\.kill\([^;]+;',s)==['process.kill(pid, 0);'])
    check(name+' assertions/rethrows/selection/real sleeps unchanged',section(s,"test('0284/git-deadline:","test('0284/git-env:")==section(original,"test('0284/git-deadline:","test('0284/git-env:"))
    check(name+' git-env tail unchanged',s[s.index("test('0284/git-env:"):]==original[original.index("test('0284/git-env:"):])
    check(name+' timedStall/r.secs/assertStallCut unchanged',section(s,'function timedStall(',"test('0284/git-deadline:")==section(original,'function timedStall(',"test('0284/git-deadline:"))
    check(name+' sealed PATH and sleep wrapper and stub bodies unchanged',section(s,'function which(',"// ── the fake install root")==section(original,'function which(',"// ── the fake install root"))
    check(name+' install unchanged',section(s,'function install(',"// One launch.")==section(original,'function install(',"// One launch."))
    check(name+' fixture allocation only own root',"mkdtempSync(join(process.env.FKIT_DIAG_FIXTURES, prefix))" in s and 'tmpdir()' not in s)
    check(name+' absolute original harness import',f"from '{(R/'test/harness.mjs').as_uri()}'" in s)
    check(name+' after cleanup deletion removed','MADE.forEach' not in s)
    diff=''.join(difflib.unified_diff(original.splitlines(True),s.splitlines(True),fromfile='STATIC/test/update-banner.test.js',tofile=name+'.mjs'))
    check(name+' exact unified diff',diff==(S/(name+'.mjs.diff')).read_text())
check('reference launch including synchronous pipes unchanged',section(reference,'function launch(',"// The banner is")==section(original,'function launch(',"// The banner is"))
check('reference emits no extra per-launch measurements', 'OBSERVATIONS' not in reference and 'hrtime' not in reference)
check('observed has four monotonic boundaries',observed.count('process.hrtime.bigint().toString()')==4)
check('observed retains original spawnSync API',"const r = spawnSync('/bin/sh', [join(root, 'claude', 'fkit-claude.sh'), ...args], spawnOptions);" in observed and 'replaceSpawnSync' not in observed)
check('observed result log object unchanged',section(observed,"    code: r.status",'\n  };')==section(original,"    code: r.status",'\n  };'))
helpers={name:(S/name).read_text() for name in ['burner.mjs','passive-observer.mjs','supervisor.mjs']}
for name,s in helpers.items():
    check(name+' no process/child signal send',not re.search(r'\b(?:process|child)\.kill\s*\(|\bkill\s*\(',s))
    check(name+' no shell subprocess',not re.search(r'\b(?:exec|execSync|execFile|execFileSync|spawnSync)\s*\(',s) and 'shell:' not in s)
check('burner arithmetic chunks and yield and private stop/disconnect',all(x in helpers['burner.mjs'] for x in ["message?.type === 'stop'","process.on('disconnect'",'setImmediate(work)','i < chunk','Math.imul']))
check('burner no subprocess or file API','node:' not in helpers['burner.mjs'] and 'kill' not in helpers['burner.mjs'])
check('observer process read only',"spawn('/bin/ps', ['-axo', 'pid=,ppid=,lstart=,state=,command=']" in helpers['passive-observer.mjs'] and not re.search(r'\b(?:rmSync|unlinkSync|writeFileSync)\(',helpers['passive-observer.mjs']))
check('observer sequential samples single call site',helpers['passive-observer.mjs'].count('await this.sample()')==1 and 'observer.sample()' not in helpers['supervisor.mjs'])
check('observer PID+start/ancestry/path and unknown retention evidence',all(x in helpers['passive-observer.mjs'] for x in ['root.start','parentStart','fixtureRoot +','missing','zombie','reused','unknown','same-second PID reuse']))
check('supervisor only one directory deletion site exact path after settlement',helpers['supervisor.mjs'].count('rmSync(')==1 and 'rmSync(path, { recursive: true })' in helpers['supervisor.mjs'] and 'if (settled) {' in helpers['supervisor.mjs'])
check('supervisor no automatic retries or aggregate timeout',all(x not in helpers['supervisor.mjs'] for x in ['timeout:', 'AbortController','setInterval','SIGKILL',"killall",'pkill']))
check('supervisor four ordered invocations and five-slot bounds',"iteration > 5" in helpers['supervisor.mjs'] and "[1, 'safe-reference', '^0284/term-ignored:'], [2, 'safe-reference', '^0284/'], [3, 'observed', '^0284/term-ignored:'], [4, 'observed', '^0284/']" in helpers['supervisor.mjs'])
check('fixed recipe N = availableParallelism + 2',C['N']==C['availableParallelism']+2==16)
parses=[]
for name in ['safe-reference.mjs','observed.mjs','burner.mjs','passive-observer.mjs','supervisor.mjs']:
    cmd=[C['node'],'--check',str(S/name)]
    p=subprocess.run(cmd,capture_output=True,text=True)
    parses.append({'argv':cmd,'exit':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
    check(name+' syntax only',p.returncode==0)
for name,expected in C['sourceAnchors'].items():
    actual=subprocess.check_output(['git','hash-object',str(R/name)],text=True).strip()
    check('source anchor '+name,actual==expected)
check('no diagnostic iteration directory created',not list(S.glob('iteration-*')))
report={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kind':'STATIC ONLY — no module evaluation, tests, IPC startup, ps sampling, load or diagnostic invocation','checks':checks,'nodeSyntaxChecks':parses,'scope':'Source NONE; own 0537 worklog/evidence and ignored scratch only','runtimeValidated':False,'rootCause':'UNKNOWN','batchInvocationsExecuted':0,'limits':['Static checks do not establish runtime safety, fidelity, IPC delivery, observer coverage, ps parsing or cleanup success','No preparation-created background process; helpers only parsed, never evaluated']}
if not (S/'sealed-manifest.json').exists():
    (S/'static-audit.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'passed':len(checks),'failed':0,'syntaxParses':len(parses),'runtimeValidated':False}))
