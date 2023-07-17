// polyfill Symbol.metadata
// @ts-expect-error
Symbol.metadata ??= Symbol.for("Symbol.metadata");

function serializable(_target: unknown, context: ClassMemberDecoratorContext) {
  const serializableProperties =
    (context.metadata.serializableProperties as PropertyKey[] | undefined) ||
    [];
  serializableProperties.push(context.name);
  context.metadata.serializableProperties = serializableProperties;
}

function serialize(value: Record<string, any>) {
  const metadata = value.constructor[Symbol.metadata];
  if (!metadata) {
    return JSON.stringify(value, null, 2);
  }
  const result: Record<string, unknown> = {};
  const serializableProperties = metadata.serializableProperties as string[];

  serializableProperties.forEach((property) => {
    result[property] = value[property];
  });

  return JSON.stringify(result, null, 2);
}

class Entity {
  a = 1;
  b = 2;
  c = new Map();

  method() {
    console.log("do something");
  }
}

class MarkedEntity {
  @serializable
  a = 1;
  @serializable
  b = 2;
  c = new Map();

  method() {
    console.log("do something");
  }
}

const e = new Entity();
const me = new MarkedEntity();

console.log(serialize(e), serialize(me));
