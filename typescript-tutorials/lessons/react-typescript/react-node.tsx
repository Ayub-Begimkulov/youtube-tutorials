export {};

type Test = React.ReactNode;

let reactNode: React.ReactNode = [1, 2, 3];

reactNode = <></>;

reactNode = {};
// ^^^^^^
// Type '{}' is not assignable to type 'ReactNode'.ts(2322)

reactNode = null;
reactNode = undefined;
