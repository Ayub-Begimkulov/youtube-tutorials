export {};

function call(cb: () => void) {
  cb();
}

call(() => {
  return 1234;
});
