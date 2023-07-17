// polyfill Symbol.metadata
// @ts-expect-error
Symbol.metadata ??= Symbol.for("Symbol.metadata");

function testDecorator<Target, Params extends any[]>(
  target: new (...params: Params) => Target,
  context: ClassDecoratorContext
) {
  context.metadata["__class_name__"] = target.name;
}

function markMember(_target: unknown, context: ClassMemberDecoratorContext) {
  context.metadata[context.name] = context.kind;
}

@testDecorator
class Test {
  @markMember
  test = 1;

  @markMember
  get count() {
    return this.test;
  }

  @markMember
  logTest() {
    console.log(this.test);
  }
}

const testInstance = new Test();

console.log(Test[Symbol.metadata]);
