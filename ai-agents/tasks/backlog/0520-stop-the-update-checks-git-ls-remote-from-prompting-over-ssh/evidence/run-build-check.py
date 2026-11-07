import sys, subprocess, pathlib, json, re, shlex
label=sys.argv[1]; command=sys.argv[2:]; evidence=pathlib.Path(__file__).resolve().parent
result=subprocess.run(command,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
clean=lambda s:'\n'.join(l for l in s.splitlines() if not re.search(r'\bduration_ms\b',l))+'\n'
out=re.sub(r' \([0-9.]+ms\)', '', clean(result.stdout)); err=clean(result.stderr)
(evidence/(label+'.log')).write_text(out+err)
record={'command':shlex.join(command),'argv':command,'childExit':result.returncode,'stdout':out,'stderr':err}
(evidence/(label+'.json')).write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'command':record['command'],'childExit':result.returncode}))
print(out+err)
