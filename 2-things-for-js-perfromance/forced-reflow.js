const root = document.getElementById("test-root");

function forcedReflow(testNumber, testSize) {
  const fn = testNumber === 1 ? addChildrenAndMeasure : addChildrenAndMeasure2;

  const before = performance.now();

  for (let i = 0; i < 100; i++) {
    fn(testSize);
  }

  const after = performance.now();

  console.log(`${fn.name} has been ran 100 times and took ${after - before}ms`);
}

function addChildrenAndMeasure(count) {
  const sizes = [];

  for (let i = 0; i < count; i++) {
    const element = document.createElement("div");
    element.textContent = getRandomText();

    root.appendChild(element);

    sizes.push(element.getBoundingClientRect());
  }

  return sizes;
}

function addChildrenAndMeasure2(count) {
  const elements = [];

  for (let i = 0; i < count; i++) {
    const element = document.createElement("div");
    element.textContent = getRandomText();

    elements.push(element);
    root.appendChild(element);
  }

  const sizes = [];

  for (let i = 0; i < count; i++) {
    const element = elements[i];
    sizes.push(element.getBoundingClientRect());
  }

  return sizes;
}

function getRandomText() {
  return Math.random().toString(36).slice(2);
}

function example1() {
  const button = document.querySelector("[data-id=button]");
  const animationElement = document.querySelector(
    "[data-id='animation-element']"
  );

  button.addEventListener("click", () => {
    const currentHeight = parseInt(animationElement.style.height, 10);

    const newHeight = currentHeight === 1_000 ? 0 : 1_000;

    animationElement.style.height = `${newHeight}px`;
  });
}

// TODO make version with transform
function example2() {
  const button2 = document.querySelector("[data-id=button-2]");
  const animationElement2 = document.querySelector(
    "[data-id='animation-element-2']"
  );

  button2.addEventListener("click", () => {
    const currentLeft = parseInt(animationElement2.style.left, 10);

    const newLeft = currentLeft === 500 ? 5 : 500;

    animationElement2.style.left = `${newLeft}px`;
  });
}
