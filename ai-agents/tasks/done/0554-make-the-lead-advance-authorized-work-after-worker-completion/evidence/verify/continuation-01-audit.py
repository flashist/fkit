from pathlib import Path
import json,hashlib,subprocess
V=Path(__file__).resolve().parent
T=V.parent.parent
B=T/'evidence/build'
prefix='continuation-01'
pre=json.loads((V/(prefix+'-preflight.json')).read_text())
first=json.loads((V/'preflight.json').read_text())
build=json.loads((B/'baseline.json').read_text())
manifest=json.loads((B/'artifact-manifest.json').read_text())
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def delta(files,allowed):
 changed=[];missing=[]
 for name,expected in files.items():
  p=Path(name)
  if not p.is_file():missing.append(name)
  elif h(p)!=expected and name not in allowed:changed.append(name)
 return {'unexpectedChangedPaths':changed,'missingPaths':missing,'checkedPathCount':len(files)}
worklog=str(T/'worklog.md')
current=set(p.decode() for p in subprocess.check_output(['git','ls-files','-c','-o','--exclude-standard','-z']).split(b'\0') if p)|set(pre['files'])
new=sorted(s for s in current-set(pre['files']) if Path(s).is_file())
source=[{'path':s['path'],'expectedSHA256':s['afterSHA256'],'actualSHA256':h(Path(s['path'])),'matchesBuildAfterimage':h(Path(s['path']))==s['afterSHA256'],'afterSnapshotMatches':h(B/s['afterSnapshot'])==s['afterSHA256']} for s in pre['buildSourceAfterimages']]
index=Path(subprocess.check_output(['git','rev-parse','--git-path','index'],text=True).strip())
stage=hashlib.sha256(subprocess.check_output(['git','ls-files','--stage','-z'])).hexdigest()
immutable=[x for x in manifest['artifactPaths'] if x['path']!=worklog]
result={'task':'0554 — Make the lead advance authorized work after worker completion','scope':pre['scope'],'continuationBaseline':delta(pre['files'],{worklog}),'originalVerifyBaseline':delta(first['files'],{worklog}),'buildBaseline':delta(build['hashes'],set(build['sourcePaths'])|{worklog}),'buildSourceAfterimages':source,'immutableBuildManifestArtifactsChecked':len(immutable),'immutableBuildManifestMismatches':[x['path'] for x in immutable if not Path(x['path']).is_file() or h(Path(x['path']))!=x['sha256']],'originalVerifyEvidence':delta(pre['originalVerifyEvidence'],set()),'planSHA256':h(T/'plan.md'),'planMatchesBuild':h(T/'plan.md')==build['planSHA256'],'planBlob':subprocess.check_output(['git','hash-object',str(T/'plan.md')],text=True).strip(),'planReviewMatchesBuild':h(T/'plan-review.md')==build['hashes'][str(T/'plan-review.md')],'planReviewMatchesOriginalVerify':h(T/'plan-review.md')==first['files'][str(T/'plan-review.md')],'indexStageSha256':stage,'indexStageMatchesBuildAndOriginalVerify':stage==build['indexSHA256']==first['indexStageSha256']==pre['indexStageSha256'],'indexBytesSha256':h(index),'indexBytesMatchesContinuationBaseline':h(index)==pre['indexBytesSha256'],'newPathsAtAudit':new,'unexpectedNewPaths':[s for s in new if not s.startswith(str(V/(prefix+'-')))],'expectedModifiedExistingPaths':[worklog],'exclusions':'Uncaptured ignored paths, symlinks, and Git internals other than captured index bytes/stage entries. No whole-workspace preservation claim. Final audit/report/manifest are subsequent expected task-local evidence writes.'}
assert not (V/(prefix+'-final-audit.json')).exists()
(V/(prefix+'-final-audit.json')).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['buildSourceAfterimages','newPathsAtAudit']},indent=2))
