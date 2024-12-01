let frames = 0;
let startTime: number;
let rafId: number;

export function fpsCounter() {
  if (!rafId) {
    rafId = requestAnimationFrame(fpsCounter);
    return;
  }

  if (!startTime) {
    startTime = performance.now();
  }

  frames++;
  const currentTime = performance.now();
  const timePassed = currentTime - startTime;

  const oneFrameTime = timePassed / frames;
  console.log(1_000 / oneFrameTime, "frames per second");

  rafId = requestAnimationFrame(fpsCounter);
}

// fpsCounter();
