from pathlib import Path
import difflib, hashlib, json, subprocess
P=Path('ai-agents/tasks/backlog/0555-use-supported-interactive-owner-questions-with-an-explicit-fallback')
V=P/'evidence/verify'; O=V/'completion-01'; B=P/'evidence/build'
def h(p):
 p=Path(p)
 return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def read(p): return json.loads(Path(p).read_text())
def save(n,v):
 with (O/n).open('x') as f: f.write(json.dumps(v,indent=2)+'\n')
def compare(m): return {k:{'expected':v,'actual':h(k)} for k,v in m.items() if h(k)!=v}
b=read(B/'baseline.json'); s=read(V/'source-hashes.json'); a=read(V/'audit-before.json'); managed=read(B/'managed-before.json'); bh=read(V/'build-evidence-hashes.json'); old=read(O/'old-verify-hashes-before.json')
source=[]; diff=[]
for k in s:
 before=B/'before'/k
 source.append({'path':k,'beforeimage':str(before),'beforeExpected':b['sourceHashes'][k],'beforeActual':h(before),'currentExpected':s[k],'currentActual':h(k)})
 diff.extend(difflib.unified_diff(before.read_text().splitlines(keepends=True),Path(k).read_text().splitlines(keepends=True),fromfile='build-before/'+k,tofile='completion-current/'+k))
with (O/'task-source.diff').open('x') as f: f.writelines(diff)
save('source-manifest.json',{'provenance':'Reconstructed now by completion-01 Verify from real Build beforeimages; not original Build output','sources':source})
workspace_deltas=compare(b['workspaceHashes'])
old_deltas=compare(old)
managed_current={k:h(k) for k in managed}
indexpatch=subprocess.run(['git','diff','--cached','--binary'],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
assert indexpatch.returncode==0
inventory=subprocess.run(['git','ls-files','--cached','--others','--exclude-standard','-z'],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
assert inventory.returncode==0
additions=[k for k in inventory.stdout.decode().split('\0') if k and k not in b['workspaceHashes']]
audit={
 'provenance':'Fresh completion-01 Verify audit; does not replace absent original Build final audit',
 'sourceCount':len(s),'sourceMismatches':compare(s),
 'sourceBeforeimageMismatches':[x for x in source if x['beforeExpected']!=x['beforeActual']],
 'workspaceBaselineCount':len(b['workspaceHashes']),'workspaceBaselineDeltas':workspace_deltas,
 'workspaceDeltasOutside17Sources':{k:v for k,v in workspace_deltas.items() if k not in s},
 'workspaceInventoryAdditions':additions,
 'workspaceAdditionsOutsideTaskEvidence':[k for k in additions if not k.startswith(str(P/'evidence')+'/')],
 'frozen0554Count':len(b['frozen0554']),'frozen0554Mismatches':compare(b['frozen0554']),
 'protectedRecordsCount':len(b['records']),'protectedRecordMismatches':compare(b['records']),
 'indexExpected':b['indexSha256'],'indexActual':h(b['indexPath']),
 'indexPatchExpected':a['indexPatchBaseline'],'indexPatchActual':hashlib.sha256(indexpatch.stdout).hexdigest(),
 'buildArtifactCount':len(bh),'buildArtifactMismatches':compare(bh),
 'managedBeforeimageCount':len(managed),'managedBeforeimageMismatches':{k:{'expected':v,'actual':h(B/'managed-before'/k)} for k,v in managed.items() if h(B/'managed-before'/k)!=v},
 'managedCurrentDeltasSincePriorVerify':{k:{'prior':v,'current':managed_current[k]} for k,v in a['managedCurrentHashes'].items() if managed_current[k]!=v},
 'oldVerifyDeltas':old_deltas,
 'oldVerifyDeltaAttribution':'Observed file deltas only; prior unfinished lanes may append; authorship and child completion unknown absent actual numeric result',
 'missingOriginalBuildHandoff':[str(f) for f in [P/'worklog.md',B/'artifact-manifest.json',B/'task-source.diff'] if not f.exists()],
 'originalBuildFinalAudit':'absent; no original Build final audit supplied',
 'priorVerifyFinalReportAndManifest':'absent; this worker supplies its own attributed packet',
 'automaticLiveDisplayAcceptance':'UNMET','claudeMixedLiveCompatibility':'unverified',
 'protectedRecordsActual':{k:h(k) for k in b['records']},
}
save('audit-final.json',audit)
print(json.dumps({k:v for k,v in audit.items() if k.endswith('Mismatches') or k in ['sourceCount','frozen0554Count','protectedRecordsCount','buildArtifactCount','managedBeforeimageCount','workspaceDeltasOutside17Sources','workspaceAdditionsOutsideTaskEvidence','managedCurrentDeltasSincePriorVerify','oldVerifyDeltas','indexExpected','indexActual','indexPatchExpected','indexPatchActual']},indent=2))
