// gives an error because of the `allowSyntheticDefaultImports` - false
// import constants from "./module2";

// this will work
import constants = require("./module2");

console.log(constants.one);
