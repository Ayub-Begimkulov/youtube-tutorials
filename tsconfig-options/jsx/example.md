**original:**

```tsx
import React from "react";

export const HelloWorld = () => {
  return <h1>Hello world</h1>;
};
```

**`preserve`:**

```tsx
import React from "react";

export const HelloWorld = () => {
  return <h1>Hello world</h1>;
};
```

**`react`:**

```tsx
import React from "react";

export const HelloWorld = () => {
  return React.createElement("h1", null, "Hello world");
};
```

**`react-native`:**

```tsx
import React from "react";
export const HelloWorld = () => {
  return <h1>Hello world</h1>;
};
```

**`react-jsx`:**

```tsx
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
export const HelloWorld = () => {
  return _jsx("h1", { children: "Hello world" });
};
```

**`react-jsxdev`:**

```tsx
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "/home/ayub/youtube-tutorials/tsconfig/text.tsx";
import React from "react";
export const HelloWorld = () => {
  return _jsxDEV(
    "h1",
    { children: "Hello world" },
    void 0,
    false,
    { fileName: _jsxFileName, lineNumber: 9, columnNumber: 32 },
    this
  );
};
```
