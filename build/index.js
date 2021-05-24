"use strict";

require("core-js/modules/es.promise.js");

require("core-js/modules/es.promise.finally.js");

require("core-js/stable");

require("regenerator-runtime/runtime");

const babel = require("@babel/core");

babel.transformSync("code", optionsObject);
console.log("It's working!");

hello = () => console.log('Hey how are you doing!');

Promise.resolve().finally();