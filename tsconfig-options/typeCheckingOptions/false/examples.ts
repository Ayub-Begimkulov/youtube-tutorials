export {};

// ==================================
// noImplicitAny
// ==================================
function noImplicitAnyExampleIncorrect(someArg) {
  console.log(someArg);
}

noImplicitAnyExampleIncorrect("asdf");

function noImplicitAnyExampleCorrect(someArg: string) {
  console.log(someArg);
}

noImplicitAnyExampleCorrect("asdf");

// ==================================
// noImplicitThis
// ==================================

function noImplicitThisExampleIncorrect() {
  console.log(this.test);
}

noImplicitThisExampleIncorrect();

function noImplicitThisExampleCorrect(this: { test: string }) {
  console.log(this.test);
}

noImplicitThisExampleCorrect();

// ==================================
// strictBindCallApply
// ==================================
function strictBindCallApplyIncorrect(a: number, b: string) {
  console.log(a, b);
}

strictBindCallApplyIncorrect.apply(null, [5, 5]);

function strictBindCallApplyCorrect(a: number, b: string) {
  console.log(a, b);
}

strictBindCallApplyCorrect.apply(null, [5, "5"]);

// ==================================
// strictFunctionTypes
// ==================================
function strictFunctionTypesIncorrect() {
  console.log();
}

function strictFunctionTypesCorrect() {}

// ==================================
// strictNullChecks
// ==================================
function strictNullChecksIncorrect(): { a: number } {
  return {
    a: null,
  };
}

strictNullChecksIncorrect();

function strictNullChecksCorrect(): { a: number | null } {
  return {
    a: null,
  };
}

strictNullChecksCorrect();

// ==================================
// strictPropertyInitialization
// ==================================

function strictPropertyInitializationIncorrect() {
  return class Test {
    test: number;
  };
}

strictPropertyInitializationIncorrect();

function strictPropertyInitializationCorrect() {
  return class Test {
    test: number;

    constructor() {
      this.test = 5;
    }
  };
}

strictPropertyInitializationCorrect();

// ==================================
// useUnknownInCatchVariables
// ==================================
function useUnknownInCatchVariablesIncorrect() {
  try {
    // ... some code
  } catch (error) {
    console.log(error.test + "hello world");
  }
}

useUnknownInCatchVariablesIncorrect();

function useUnknownInCatchVariablesCorrect() {
  try {
    // ... some code
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "test" in error &&
      typeof error.test === "object"
    ) {
      console.log(error.test + "hello world");
    }
  }
}

useUnknownInCatchVariablesCorrect();

// ==================================
// noUnusedLocals
// ==================================
const test = 5;

// ==================================
// noUnusedParameters
// ==================================
function noUnusedParametersIncorrect(a: string) {
  console.log("hello world");
}

noUnusedParametersIncorrect("asdf");

function noUnusedParametersCorrect(_a: string) {
  console.log("hello world");
}

noUnusedParametersCorrect("asdf");

// ==================================
// exactOptionalPropertyTypes
// ==================================

function exactOptionalPropertyTypesIncorrect(): { a: number; b?: string } {
  return {
    a: 5,
    b: undefined,
  };
}

exactOptionalPropertyTypesIncorrect();

function exactOptionalPropertyTypesCorrect(): { a: number; b?: string } {
  return {
    a: 5,
  };
}

exactOptionalPropertyTypesCorrect();

// ==================================
// noImplicitReturns
// ==================================

function noImplicitReturnsIncorrect() {
  if (Math.random() > 0.5) {
    return true;
  }
}

noImplicitReturnsIncorrect();

function noImplicitReturnsCorrect() {
  if (Math.random() > 0.5) {
    return true;
  }

  return;
}
noImplicitReturnsCorrect();

// ==================================
// noFallthroughCasesInSwitch
// ==================================

function noFallthroughCasesInSwitchIncorrect(value: "a" | "b" | "c") {
  switch (value) {
    case "a":
      console.log('we found "a"');
    case "b":
      console.log("nothing found");
      break;
  }
}

noFallthroughCasesInSwitchIncorrect("a");

function noFallthroughCasesInSwitchCorrect(value: "a" | "b" | "c") {
  switch (value) {
    case "a":
      console.log('we found "a"');
      break;
    case "b":
      console.log("nothing found");
      break;
  }
}

noFallthroughCasesInSwitchCorrect("a");

// ==================================
// noUncheckedIndexedAccess
// ==================================
function noUncheckedIndexedAccessIncorrect(record: Record<string, string>) {
  const message: string = record["message"];

  console.log(message);
}

noUncheckedIndexedAccessIncorrect({});

function noUncheckedIndexedAccessCorrect(record: Record<string, string>) {
  const message: string = record["message"] || "";

  console.log(message);
}

noUncheckedIndexedAccessCorrect({});

// ==================================
// noImplicitOverride
// ==================================

function noImplicitOverrideIncorrect() {
  class Parent {
    test = 5;

    logTest() {
      console.log(this.test);
    }
  }

  class Child extends Parent {
    logTest() {
      console.log(this.test);

      return this;
    }
  }

  return Child;
}

noImplicitOverrideIncorrect();

function noImplicitOverrideCorrect() {
  class Parent {
    test = 5;

    logTest() {
      console.log(this.test);
    }
  }

  class Child extends Parent {
    override logTest() {
      console.log(this.test);

      return this;
    }
  }

  return Child;
}

noImplicitOverrideCorrect();

// ==================================
// noPropertyAccessFromIndexSignature
// ==================================

function noPropertyAccessFromIndexSignatureIncorrect(
  record: Record<string, string>
) {
  console.log(record.test);
}

noPropertyAccessFromIndexSignatureIncorrect({});

function noPropertyAccessFromIndexSignatureCorrect(
  record: Record<string, string>
) {
  console.log(record["message"]);
}

noPropertyAccessFromIndexSignatureCorrect({});

// ==================================
// allowUnusedLabels - false
// ==================================

function allowUnusedLabelsIncorrect(count: number) {
  outerLoop: for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      console.log(i, j);
    }
  }
}

allowUnusedLabelsIncorrect(100);

function allowUnusedLabelsCorrect(count: number) {
  outerLoop: for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      console.log(i, j);
      if (j === 10) {
        continue outerLoop;
      }
    }
  }
}

allowUnusedLabelsCorrect(100);

// ==================================
// allowUnreachableCode
// ==================================

function allowUnreachableCodeIncorrect() {
  console.log("test");

  return;

  for (let i = 0; i < 10; i++) {
    console.log(i);
  }
}

allowUnreachableCodeIncorrect();

function allowUnreachableCodeCorrect() {
  console.log("test");

  return;
}

allowUnreachableCodeCorrect();
