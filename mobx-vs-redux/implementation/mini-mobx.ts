type Reaction = () => void;

let currentReaction: Reaction | null = null;

function autoRun(cb: Reaction) {
  try {
    currentReaction = cb;
    cb();
  } finally {
    currentReaction = null;
  }
}

function observable<T extends object>(value: T) {
  const deps = new Map<string, Set<Reaction>>();

  const addReaction = (key: string) => {
    if (!currentReaction) {
      return;
    }

    if (!deps.has(key)) {
      deps.set(key, new Set());
    }

    const reactionsForKey = deps.get(key)!;

    reactionsForKey.add(currentReaction);
  };

  const runReactions = (key: string) => {
    const reactions = deps.get(key);

    if (!reactions) {
      return;
    }

    reactions.forEach((reaction) => reaction());
  };

  type Key = keyof T;

  const proxy = new Proxy(value, {
    get(target, property: string) {
      addReaction(property);

      return target[property as Key];
    },
    set(target, property: string, value) {
      if (target[property as Key] === value) {
        return true;
      }

      target[property as Key] = value;

      runReactions(property);

      return true;
    },
  });

  return proxy;
}

const state = observable({
  test: 5,
  a: "asf",
});

autoRun(() => {
  console.log(state.test /* , state.a */);
});

state.test = 6;
state.test = 7;
state.test = 7;

state.a = "asdf";
state.a = "asdf2";
state.a = "asdf3";

export {};
