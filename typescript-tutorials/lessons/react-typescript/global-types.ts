export {};

type RE = React.ReactElement;

const ce = React.createElement;
//         ^^^^^
// 'React' refers to a UMD global, but the current
// file is a module. Consider adding an import instead.ts(2686)

declare const test: RE | typeof ce;
console.log(test);
