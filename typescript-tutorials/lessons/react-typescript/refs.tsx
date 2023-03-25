import { useRef } from "react";

type UseRefType = typeof useRef;

declare const test: UseRefType;

const ref = useRef<HTMLDivElement>(null);
//    ^?

const ref2 = useRef<HTMLDivElement | null>(null);
//    ^?

const ref3 = useRef<HTMLDivElement>();
//    ^?

ref.current = null;
//  ^^^^^^^
// Cannot assign to 'current' because it is a read-only property.ts(2540)

ref2.current = null;
ref3.current = undefined;

ref;
ref2;
ref3;
test;
