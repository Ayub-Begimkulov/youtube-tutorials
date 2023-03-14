export {};

declare let neverVar: never;

declare let stringVar: string;
declare let numberVar: number;
declare let booleanVar: boolean;
declare let objectVal: object;
declare let arrayVar: number[];
declare let anyVar: any;

function exampleDontWork() {
  neverVar = stringVar;
  neverVar = numberVar;
  neverVar = booleanVar;
  neverVar = objectVal;
  neverVar = arrayVar;
  neverVar = anyVar;
}

exampleDontWork();
