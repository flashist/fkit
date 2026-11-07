import sys,pathlib,re,json
E=pathlib.Path(__file__).resolve().parent
step,source,rc=sys.argv[1:]
assert step in ['0b','0c','1','2','30','31']
raw=pathlib.Path(source).read_text(errors='replace')
s=re.sub(r'https?://[^\s<>"\x27]+','[redacted-address]',raw)
s=re.sub(r'(?i)(api[_-]?key|password|credential|authorization|dsn)(\s*[=:]\s*)[^\s,;]+',r'\1\2[redacted]',s)
s=re.sub(r'(?<![\w.])(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?','[redacted-address]',s)
s=re.sub(r' \([\d.]+ms\)','',s)
s=re.sub(r'^(?:#|ℹ) duration_ms .*\n?','',s,flags=re.M)
base=E/('continuation-01-step-'+step)
with base.with_suffix('.log').open('x') as f:f.write(s)
counts={k:int(v) for k,v in re.findall(r'^(?:#|ℹ) (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)$',raw,re.M)}
names=sorted(set(re.findall(r'^\s*not ok \d+ - (.+)$',s,re.M)+re.findall(r'^✖ (?!failing tests:)(.+)$',s,re.M)))
result={'step':step,'childExit':int(rc),'counts':counts,'failedNames':names,'output':base.with_suffix('.log').name,'source':'Unchanged test/prove-red.sh invokes unchanged Node suites; Bash evidence function forwards arguments and actual child exit.'}
with base.with_suffix('.json').open('x') as f:json.dump(result,f,indent=2);f.write('\n')
