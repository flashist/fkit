const chunk = Number(process.argv[2]);
if (!process.connected || !Number.isSafeInteger(chunk) || chunk < 1) process.exit(2);
let stopping = false;
let value = 1;
process.on('message', message => {
  if (message?.type === 'stop') stopping = true;
});
process.on('disconnect', () => { stopping = true; });
process.send({ type: 'ready', pid: process.pid });
function work() {
  if (stopping || !process.connected) {
    if (process.connected) process.disconnect();
    return;
  }
  for (let i = 0; i < chunk; i++) value = (Math.imul(value, 1664525) + 1013904223) | 0;
  setImmediate(work);
}
setImmediate(work);
