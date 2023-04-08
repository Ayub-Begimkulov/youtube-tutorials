Что же это за хук?

Этот хук - `useRef`

Однако давайте поймем, для чего он может быть полезен.

Большинство людей знают о данном хуке, только как о способе получить ссылку на элемент в react компонентах:

```tsx
function Component() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(ref);
  }, []);

  return <div ref={ref}>I'm a div</div>;
}
```

Однако давайте глянем чуть глубже и поймем, что на самом деле делает хук `useRef`?:

```tsx
let previousRef = null;

function Component() {
  const ref = useRef<HTMLDivElement>(null);

  if (previousRef) {
    console.log("previousRef === ref", previousRef === ref);
  }

  previousRef = ref;

  useEffect(() => {
    console.log(ref);
  }, []);

  return <div ref={ref}>I'm a div</div>;
}
```

Как мы можем видеть из примера, хук `useRef` возвращает нам референс на один и тот же mutable объект.

Можно это представить себе, как каплю мутабельности и императивности в мире FP.

Ок, все круто, но как мы можем использовать это для наших целей?

Тут на самом деле есть очень много креативных идей - но давайте начнем с самых простых.

```tsx
function Component() {
  const [state1, setState1] = useState(0);
  const [state2, setState2] = useState("test");

  const handleSubmit = useCallback(() => {
    sendSomeRequest({
      state1: ref.state1,
      state2: ref.state2,
    });
  }, [state1, state2]);

  return (
    <UncontrolledFormComponent
      onSubmit={handleSubmit}
      onState1Change={setState1}
      onState2Change={setState2}
    />
  );
}
```

В данном примере у нас есть мемоизированный компонент `UncontrolledFormComponent`, который содержит форму с uncontrolled полями. Форма также принимает onSubmit, который будет вызван при сабмите формы.

Давайте ради примера представим, что в `onSubmit` нам не передается никакой мап значений из поля, и нам самими нужно поддерживать актуальное состояние через `onChange` колбэки.

В же у нас тут проблема?

Проблема в том, что `UncontrolledFormComponent` - memo компонент, однако `handleSubmit` будет меняться при любом изменении полей.

Получается, что в данном примере от `useCallback` почти нету пользы, так как каждое изменение стейта поведет за собой обновление `handleSubmit`.

Тут как раз у нас и получается такая ситуация, что `handleSubmit` вообще никак не завязан на стейт, он вызывается только при клике на кнопку и при вызове должен содержать последнее (актуальное) значение стейта.

Давайте посмотрим, как мы можем исправить это с помощью `useRef`:

```tsx
function Component() {
  const [state1, setState1] = useState(0);
  const [state2, setState2] = useState("test");

  const ref = useRef({
    state1,
    state2,
  });

  ref.current = {
    state1,
    state2,
  };

  const handleSubmit = useCallback(() => {
    sendSomeRequest({
      state1: ref.state1,
      state2: ref.state2,
    });
  }, [ref]);

  return (
    <UncontrolledFormComponent
      onSubmit={handleSubmit}
      onState1Change={setState1}
      onState2Change={setState2}
    />
  );
}
```

В целом пример с использованием `useRef` здесь понятен. Но давайте попробуем вынести это в переиспользуемый хук:

```tsx
function useLatest<Value>(value: Value) {
  const valueRef = useRef(value);

  valueRef.current = value;

  return valueRef;
}
```

В целом, данный хук будет работать нормально в большинстве случаев, но давайте попробуем его чуть подправить, чтобы он также правильно работал в concurrent моде:

```ts
function useLatest<Value>(value: Value) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}
```

Давайте попробуем понять, чем нам помогает `useLayoutEffect` в concurrent режиме?

Смысл concurrent режима в том, что React можно останавливать рендар компонентов, чтобы обработать более приоритетные задачи. Например, пользовательские ивенты.

Это значит, что ваша функция-компонент может быть вызвана несколько раз, прежде чем мы увидим обновления на нашей странице.

Однако useRef, как я уже и говорил всегда ссылается на один и тот же объект, соответственно, если мы будем обновлять наш ref внутри рендера компонента - наши обработчики могут получить "будущее значение".

Я не буду вдаваться в подробности в данном видео, если вам интересно почитать подробнее про данную тему - ссылку приложу в описании. <!-- https://frontarm.com/daishi-kato/use-ref-in-concurrent-mode/ -->

Давайте взглянем не еще один пример, где нам может понадобиться хук `useLatest`:

```tsx
function useWindowEvent(type, cb) {
  const latestCb = useLatest(cb);

  useEffect(() => {
    const handler = (event) => {
      latestCb.current(event);
    };

    window.addEventListener(type, cb);

    return () => window.removeEventListener(type, cb);
  }, [latestCb]);
}

function Component() {
  const [{ x, y, diffX, diffY }, setMousePosition] = useState({
    x: 0,
    y: 0,
    diffX: 0,
    diffY: 0,
  });

  useWindowEvent("mousemove", (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
      diffX: e.clientX - x,
      diffY: e.clientY - y,
    });
  });

  return (
    <div>
      Your mouse is: X - {x}, Y - {y}
      Diff from prev position: X - {diffX}, Y - {diffY}
    </div>
  );
}
```

Как мы можем заметить и в этом примере, `useWindowEvent` никак не завязан на стейт - ему просто нужно один раз повесить обработчик на window у удалить его при маунте.

Однако у нас нет никаких гарантий, что человек, который использует данный хук будет мемоизировать переданный `cb`. Да и в случае если он будет - там может быть завязка на стейты, которые не имеют никакого отношения к обработчику событий.

Как я уже и сказал, задача хука просто повесить один раз обработчик, и удалить его при анмаунте.

Тут как раз таки мы и используем `useLatest`, он помогает нам закрыть сразу 2 проблемы - лишние вызовы `useEffect` и мемоизация колбэка, передаваемого в `useWindowEvent`.

Также из данных примеров вы можете заметить, что чаще всего мы используем `useLatest` внутри обработчиков, поэтому мы можем пойти на шаг вперед и

Как мы видим `useLatest` используется в основном для обработчиков, поэтому мы можем пойти на шаг вперед и написать такой хук:

```ts
function useEvent<T extends Function>(fn: T) {
  const fnRef = useRef(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const eventCb = useCallback(
    (...args: Parameters<T>) => {
      return fnRef.current(...args);
    },
    [fnRef]
  );

  return eventCb;
}
```

Это по сути тот же `useLatest` хук, однако специализированный для функций. На самом деле в большинстве реальных случаев вам нужен будет только `useEvent`, а `useLatest` можно добавить по мере нужд.

Давайте попробуем переписать наш примеры на `useEvent`:

```ts
function useWindowEvent(type, cb) {
  const eventCb = useEvent(cb);

  useEffect(() => {
    window.addEventListener(type, eventCb);

    return () => window.removeEventListener(type, eventCb);
  }, [eventCb]);
}
```

Как видим так наш код становится чуточку понятнее.

## deps management

Мы с помощью хуков useLatest и useEvent покрыли основные кейсы с оптимизациями, создав себе возможность не указывать определенные значения в deps.

Также стоит отметить, что данные хуки дают большой профит с точки зрения DX.

Но, можно пойти еще на шаг вперед и взять полный контроль в свои руки и поменять алгоритм того, как сверяются наши deps.

```ts
function usePrevious() {}

function useCustomCompare(value) {}
```

## Дополнительный кейсы с useRef

- useIsMounted
- usePrevious

<!--
- useLatest
- useEvent
- useIsMounted

- customDepsCompare

// ????
- useMap
- useSet

 -->
