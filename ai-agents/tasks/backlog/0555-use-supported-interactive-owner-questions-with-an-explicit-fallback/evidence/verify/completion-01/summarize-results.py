from pathlib import Path
import json,re
O=Path(__file__).resolve().parent

def failures(t):
 result=[]
 for line in t.splitlines():
  m=re.match(r'^\s*(?:✖\s+|not ok \d+\s*-?\s*)(.+)',line)
  if not m: continue
  name=re.sub(r'\s+\([0-9.]+ms\)$','',m[1])
  if name!='failing tests:' and name not in result: result.append(name)
 return result

def counts(t): return {k:int(v) for k,v in re.findall(r'^[#ℹ] (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)',t,re.M)}

filtered=json.loads((O/'filtered.json').read_text()); filtered['failureNames']=failures((O/'filtered.stdout').read_text()); filtered['stderrNonempty']=bool((O/'filtered.stderr').stat().st_size)
prove=json.loads((O/'prove-red.json').read_text()); prove['gateOutput']=(O/'prove-red.stdout').read_text(); prove['stderrNonempty']=bool((O/'prove-red.stderr').stat().st_size)
children=[]
for f in sorted((O/'prove-red-children').glob('*.exit')):
 base=f.with_suffix(''); target=Path(str(base)+'.target').read_text().strip(); t=Path(str(base)+'.stdout').read_text(); err=Path(str(base)+'.stderr').read_text()
 if 'claude-clean' in target: step='0c' if 'skill-ownership-hook' in target else '0b'
 elif 'claude-mutant-skills' in target: step='1'
 elif 'claude-mutant-resume' in target: step='2'
 elif 'claude-mutant-coldstart-exec-intake' in target: step='31'
 elif 'claude-mutant-coldstart-exec' in target: step='30'
 else: step='UNKNOWN'
 names=failures(t)
 required={
 '1':lambda n:'reviewer × fkit-review' in n,
 '2':lambda n:bool(re.match(r'2\. .*--resume',n)),
 '30':lambda n:n.startswith('12. fresh project'),
 '31':lambda n:n.startswith('12b.'),
 }
 allowed={'1':lambda n:'reviewer × fkit-review' in n,'2':required['2'],'30':lambda n:n.startswith('12. fresh project') or n.startswith('12b.'),'31':required['31']}
 children.append({'step':step,'capture':str(base.relative_to(O)),'target':target,'argv':Path(str(base)+'.argv').read_text().splitlines(),'exit':int(f.read_text()),'counts':counts(t),'failureNames':names,'requiredRedObserved':any(required[step](n) for n in names) if step in required else None,'extraFailures':[n for n in names if not allowed[step](n)] if step in allowed else names,'narrownessForbiddenFailures':[n for n in names if (step=='30' and (n.startswith('12c.') or n.startswith('12d.'))) or (step=='31' and (n.startswith('12. fresh project') or n.startswith('12c.') or n.startswith('12d.')))],'stderrNonempty':bool(err)})
result={'filtered':filtered,'proveRed':prove,'proveRedChildren':sorted(children,key=lambda x:['0b','0c','1','2','30','31','UNKNOWN'].index(x['step']))}
with (O/'results-summary.json').open('x') as f: f.write(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
