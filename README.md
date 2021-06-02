# Your only guide to babel

Something

## Install

```shell
npm install --save-dev @babel/core @babel/cli @babel/preset-env

```

## Create a file named babel.config.json

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

## Add this to package.json

```json
"build": "./node_modules/ .bin/babel src --out-dir build"
```

## Run

npm run build

## Core library

The core functionality of Babel resides at the @babel/core module.

## CLI Tool

@babel/cli is a tool that allows you to use babel from the terminal. Here's the installation command and a basic usage example:

```shell
npm run build
```

This will parse all the JavaScript files in the src directory, apply any transformations we have told it to, and output each file to the lib directory.

Since we haven't told it to apply any transformations yet, the output code will be identical to the input (exact code styling is not preserved). We can specify what transformations we want by passing them as options.

We used the --out-dir option above. You can view the rest of the options accepted by the cli tool by running it with --help.

## Plugins & Presets

Transformations come in the form of plugins, which are small JavaScript programs that instruct Babel on how to carry out transformations to the code.

You can even write your own plugins to apply any transformations you want to your code. To transform ES2015+ syntax into ES5 we can rely on official plugins like @babel/plugin-transform-arrow-functions:

```shell
npm install --save-dev @babel/plugin-transform-arrow-functions

npm run build --plugins=@babel/plugin-transform-arrow-functions
```

### Converted Code

```javascript
const fn = () => 1;

// converted to

var fn = function fn() {
  return 1;
};
```

### Important Part Presets

Instead of adding all the plugins we want one by one, we can use a "preset" which is just a pre-determined set of plugins.

There's an excellent preset `env` that has replaced all the other presets from past, it will mostly cover you all times.

```shell
npm install --save-dev @babel/preset-env

npm run build --presets=@babel/env
```

> Without any configuration, this preset will include all plugins to support modern JavaScript (ES2015, ES2016, etc.).

But presets can take options too. Rather than passing both cli and preset options from the terminal, let's look at another way of passing options: configuration files.

### Polyfill

Polyfill **Deprecated** in favor of directly including `core-js/stable`.

```javascript
import "core-js/stable";
import "regenerator-runtime/runtime";
```

The polyfill module includes core-js and a custom regenerator runtime to emulate a full ES2015+ environment.

This means you can use new built-ins like Promise or WeakMap, static methods like Array.from or Object.assign, instance methods like Array.prototype.includes, and generator functions (when used alongside the regenerator plugin). The polyfill adds to the global scope as well as native prototypes like String in order to do this.

## Setup Completed

Babel will now inspect all your code for features that are missing in your target environments and include only the required polyfills. For example this code.

```javascript
Promise.resolve().finally();
```

### Will Turn into this (because Edge 17 doesn't have Promise.prototype.finally).

```javascript
require("core-js/modules/es.promise.finally");

Promise.resolve().finally();
```

env preset with the "useBuiltIns" option set to "usage" (defaults to "false") we would have to require the full polyfill only once in our entry point before any other code.

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "entry"
      }
    ]
  ]
}
```

## Configuring babel

Three ways listed in priority from lowest to highest.

* babel.config.json or inside package.json
* babel.config.js
* .babelrc.json
* programmatic options from @babel/cli

In other words, babel.config.json is overwritten by .babelrc, and .babelrc is overwritten by programmatic options.

> You can also write babel.config.json and .babelrc.json files using JavaScript.

Generally each config sources has at least one config item -- the root content of configs. If you have configured overrides or env, Babel will not print them in the root, but will instead output a separate config item titled as .overrides[index], where index is the position of the item. This helps determine whether the item is effective on the input and which configs it will override.

If your input is ignored by ignore or only, Babel will print that this file is ignored.

## How Babel merges config items

Babel's configuration merging is relatively straightforward. Options will overwrite existing options when they are present and their value is not undefined. There are, however, a few special cases:

* For **assumptions, parserOpts and generatorOpts, objects are merged**, rather than replaced.
* For **plugins and presets, they are replaced** based on the identity of the plugin/preset object/function itself combined with the name of the entry.

> Option (except plugin/preset) merging


As an example, consider a config with:

{
  sourceType: "script",
  assumptions: {
    setClassFields: true,
    iterableIsArray: false
  },
  env: {
    test: {
      sourceType: "module",
      assumptions: {
        iterableIsArray: true,
      },
    }
  }
};

Copy
When NODE_ENV is test, the sourceType option will be replaced and the assumptions option will be merged. The effective config is:

{
  sourceType: "module", // sourceType: "script" is overwritten
  assumptions: {
    setClassFields: true,
    iterableIsArray: true, // assumptions are merged by Object.assign
  },
}

Copy
Plugin/Preset merging
As an example, consider a config with:

plugins: [
  './other',
  ['./plug', { thing: true, field1: true }]
],
overrides: [{
  plugins: [
    ['./plug', { thing: false, field2: true }],
  ]
}]

Copy
The overrides item will be merged on top of the top-level options. Importantly, the plugins array as a whole doesn't just replace the top-level one. The merging logic will see that "./plug" is the same plugin in both cases, and { thing: false, field2: true } will replace the original options, resulting in a config as

plugins: [
  './other',
  ['./plug', { thing: false, field2: true }],
],

Copy
Since merging is based on identity + name, it is considered an error to use the same plugin with the same name twice in the same plugins/presets array. For example

plugins: ["./plug", "./plug"];

Copy
is considered an error, because it's identical to plugins: ['./plug']. Additionally, even

plugins: [["./plug", { one: true }], ["./plug", { two: true }]];

Copy
is considered an error, because the second one would just always replace the first one.

If you actually do want to instantiate two separate instances of a plugin, you must assign each one a name to disambiguate them. For example:

plugins: [
  ["./plug", { one: true }, "first-instance-name"],
  ["./plug", { two: true }, "second-instance-name"],
];

Copy
because each instance has been given a unique name and this a unique identity.


## Print current configuration in terminal

You can tell Babel to print effective configs on a given input path

### *nix or WSL

```shell
BABEL_SHOW_CONFIG_FOR=./src/myComponent.jsx npm start
```


### Copy

```shell
$env:BABEL_SHOW_CONFIG_FOR = ".\src\myComponent.jsx"; npm start
```

Plugin Ordering
Ordering matters for each visitor in the plugin.

This means if two transforms both visit the "Program" node, the transforms will run in either plugin or preset order.

Plugins run before Presets.
Plugin ordering is first to last.
Preset ordering is reversed (last to first).
For example:

{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}

Copy
Will run transform-decorators-legacy then transform-class-properties.

It is important to remember that with presets, the order is reversed. The following:

{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}

Copy
Will run in the following order: @babel/preset-react then @babel/preset-env.

Plugin Options
Both plugins and presets can have options specified by wrapping the name and an options object in an array inside your config.

For specifying no options, these are all equivalent:

{
  "plugins": ["pluginA", ["pluginA"], ["pluginA", {}]]
}

Copy
To specify an option, pass an object with the keys as the option names.

{
  "plugins": [
    [
      "transform-async-to-module-method",
      {
        "module": "bluebird",
        "method": "coroutine"
      }
    ]
  ]
}

Copy
Settings options for presets works exactly the same:

{
  "presets": [
    [
      "env",
      {
        "loose": true,
        "modules": false
      }
    ]
  ]
}




## Name Normalization

Name Normalization
By default, Babel expects plugins to have a babel-plugin- or babel-preset- prefix in their name. To avoid repetition, Babel has a name normalization phase will automatically add these prefixes when loading items. This boils down to a few primary rules:

Absolute paths pass through untouched.
Relative paths starting with ./ pass through untouched.
References to files within a package are untouched.
Any identifier prefixed with module: will have the prefix removed but otherwise be untouched.
plugin-/preset- will be injected at the start of any @babel-scoped package that doesn't have it as a prefix.
babel-plugin-/babel-preset- will be injected as a prefix any unscoped package that doesn't have it as a prefix.
babel-plugin-/babel-preset- will be injected as a prefix any @-scoped package that doesn't have it anywhere in their name.
babel-plugin/babel-preset will be injected as the package name if only the @-scope name is given.
Here are some examples, when applied in a plugin context:

Input	Normalized
"/dir/plugin.js"	"/dir/plugin.js"
"./dir/plugin.js"	"./dir/plugin.js"
"mod"	"babel-plugin-mod"
"mod/plugin"	"mod/plugin"
"babel-plugin-mod"	"babel-plugin-mod"
"@babel/mod"	"@babel/plugin-mod"
"@babel/plugin-mod"	"@babel/plugin-mod"
"@babel/mod/plugin"	"@babel/mod/plugin"
"@scope"	"@scope/babel-plugin"
"@scope/babel-plugin"	"@scope/babel-plugin"
"@scope/mod"	"@scope/babel-plugin-mod"
"@scope/babel-plugin-mod"	"@scope/babel-plugin-mod"
"@scope/prefix-babel-plugin-mod"	"@scope/prefix-babel-plugin-mod"
"@scope/mod/plugin"	"@scope/mod/plugin"
"module:foo"	"foo"