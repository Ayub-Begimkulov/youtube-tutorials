export function queueMacrotask(cb: VoidFunction) {
  const messageChanel = new MessageChannel();
  messageChanel.port2.onmessage = () => {
    cb();
    messageChanel.port2.onmessage = null;
  };
  messageChanel.port1.postMessage(undefined);
}
