## What's the story behind it?

👨‍💻 I was in a search for an all-in-one article to help me get started with Babel without ever reading the whole `documentation` but I didn't found any So, after deeply going through the `Babel docs` I'm writing this.

I assure you to move you from zero to a little less than advanced in babel but don't worry I'll also tell you important things to become advance in it.

So, if you've heard about babel but never got into knowing what, why, and how about it, you should continue reading this.

## Babel is the Middleman

![https://media.giphy.com/media/ZeX59ug9zJh1msfgdz/giphy.gif](https://media.giphy.com/media/ZeX59ug9zJh1msfgdz/giphy.gif)

The left one is the user and the right one is the browser.

JavaScript has evolved a lot in the previous years and the all latest features of JavaScript are not supported in many modern browsers but most of them are.

Babel is the middle man(transpiler) between your modern JavaScript code and the browser you're targetting. It makes sure that whatever JavaScript you're writing will be **compatible** with almost every browser out there even IE11.

E.g. Opera Mini does not support `flatMap()` as of now and babel includes an external library for it to make sure it will work on it.

## How it works

It uses AST to make it compiler work(that's a part of compiler design), but you don't have to know anything to make use of it to any level just remember it works upon the modern JavaScript to compile it down to ES15 that most browsers support.

- Use Sourcemap to map both codes.
- Does not do static typing as `TypeScript`.

## How to setup

![https://media.giphy.com/media/5Zesu5VPNGJlm/giphy.gif](https://media.giphy.com/media/5Zesu5VPNGJlm/giphy.gif)

Make sure you have these

- `Node.js` (LTS or latest)
- `npm`

Setup a folder with `index.js` and run:

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

Make a `babel.config.json` file in the root directory of your app.

For this configuration, Babel will try to find all `.js` files in the `src` folder so make sure you've all your files set up.

```bash
`{
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
}`
```

Add this to `package.json` 

```bash
"build": "./node_modules/.bin/babel src --out-dir build"
```

and run `npm run build`

Voila! you've done it! there will be a `build` folder in your main directory that will contain your converted codes from src.

## It was just the Start

![https://media.giphy.com/media/U3bL73bqnbMFFsy6tY/giphy.gif](https://media.giphy.com/media/U3bL73bqnbMFFsy6tY/giphy.gif)

Now, we'll understand how it all works. Let's start with

## Types of Babel configurations

### Project-wide configuration (New in Bable 7.x)

It will just take a simple file `babel.config.json` as we did above and find the `.js` files as specified in search behavior in the `babel.config.json` file.

### File-relative configuration

The setup is similar but you can use `.babelrc.json` for it just to define it with a higher priority and for differentiating than the main config file.

There can be a few edge cases when you might need it like applying babel to only a single package.

#### Important thing to remember

File-relative configurations are also merged over top of project-wide config values, making them potentially useful for specific overrides, though that can also be accomplished through "overrides".

## Let's talk about what we installed with npm

`@babel/core` → All the core functionality of Babel resides here.

`@babel/cli` → Babel can be used from CLI with this tool, we're able to use `npm run build` because of this. 

We used the `--out-dir` option behind the scenes that is possible because of `@babel/cli`. Run `npm run build —help` for more info.

`@babel/preset-env` → This is a new preset that has been amazing, it has replaced most previous presets, It smartly adds the required libraries to ES5 code.

Let's first understand this 👇.

### Plugins

Babel uses Plugins to perform transformations, Plugins are nothing but small JavaScript programs that instructs Babel to perform required transformations to the code.

#### Important thing

You can write your own plugins or use official plugins like `@babel/plugin-transform-arrow-functions` that is just a plugin to convert modern arrow functions to ES5.

It simply does this.

```javascript
// From this
const fn = () => 1;

// Converted to this
var fn = function fn() {
  return 1;
};
```

### Coming Back to `@babel/preset-env`

It's simply a set of plugins that can handle all the headaches of setting up plugins manually for every feature. It'll take care of your all smart code most of the time.

![You're getting it](https://media.giphy.com/media/fZ6bIf6SQI1gz27gCJ/giphy.gif)

## Polyfill

🚨 Earlier it was part of babel but now we've to `import` it directly with this code in your modern JS code.

Polyfills are not used exclusively because of poor functionality and poor performance. Native implementations of APIs can do more and are faster than polyfills. For example, the [Object.create polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#polyfill) only contains the functionalities that are possible in a non-native implementation of Object.create.

### What is Polyfill?

A polyfill is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.

Dear IE11
![Old-Code](https://media.giphy.com/media/l3fQgjVoyZ1I4EyOs/giphy.gif)

For example, a polyfill could be used to mimic the functionality of a `[text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)` in IE7 using proprietary IE filters, or mimic rem units or media queries by using JavaScript to dynamically adjust the styling as appropriate, or whatever else you require.

Read in depth [Mozilla Docs Polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill)

### What about it in Babel?

The polyfill module includes `core-js` and a custom regenerator runtime to emulate a full ES2015+ environment.

As babel has already removed it but just for the sake of knowing you can import it with this

You've to use

```javascript
// Install via 
npm install --save @babel/polyfill

// Add via
import "core-js/stable";
import "regenerator-runtime/runtime";
```

## Types of configuration in babel

Four ways are listed in priority from lowest to highest.

- `babel.config.json` or inside `package.json`
- `babel.config.js`
- `.babelrc.json`
- programmatic options from `@babel/cli`

By **priority** it simply means that `babel.config.json` is overwritten by `.babelrc`, and `.babelrc` is overwritten by `programmatic options`.

You can also write `babel.config.json` and `.babelrc.json` files using **JavaScript**.

## Options

### What are babel options?

![do-it-babel](https://media.giphy.com/media/3o84sw9CmwYpAnRRni/giphy.gif)
<!-- ![Old-Code](https://media.giphy.com/media/eNGhpJxWu1C8FgF6Ty/giphy.gif) -->
Babel options are a way to tell babel to do specific things e.g. minifying, ignoring some file, or explicitly tell babel to compile files from a specific directory while disabling everything else.

Don't worry I'll explain everything I said above.

### First understand how we can use any option

Options are defined in your chosen config file let's say that is `babel.config.json`.

```json
{
    "presets":
    [
        [
            "@babel/env",
            {
                "targets":
                {
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1"
                },
                "useBuiltIns": "usage",
                "corejs": "3.6.5"
            }
            
        ]
    ],
}
```

1. To **minify** your output code from babel, just add `minified` to true like below.

    ```json
    {
        "presets":
        [
            [
                "@babel/env",
                {
                    "targets":
                    {
                        "edge": "17",
                        "firefox": "60",
                        "chrome": "67",
                        "safari": "11.1"
                    },
                    "useBuiltIns": "usage",
                    "corejs": "3.6.5"
                }
                
            ]
        ],
        "minified": true,
    }
    ```

    Now, check your output in `build` directory it should be minified, that basically means removing every extra space and line breaks.

2. To **ignore** a file, add `ignore: ["file or directory path"]`.

    e.g.

    ```json
    // For Files
    "ignore" : ["./src/some_file.js"],
    // For Directory
    "ignore" : ["./src"],
    ```

3. To **compile only** a specific file or folder.
    e.g.

    ```json
    // For Files
    "only" : ["./src/some_file.js"],
    // For Directory
    "only" : ["./src"],
    ```

## How Babel merges conflicting configurations

Sometimes there can be some situations where we have to specify some configurations that may result in to conflict, so to understanding how babel solves it is crucial to work with such issues.

![babel-is-simple](https://media.tenor.com/images/8fbe862dbf870e0ef2ba6c7e91df28de/tenor.gif)

Babel's configuration merging is simple and predictable.

**Options** will overwrite existing **options** when they are present and their value is not undefined. There are, however, a few special cases:

- For **[assumptions](https://babeljs.io/docs/en/assumptions), [parserOpts](https://babeljs.io/docs/en/babel-parser) and [generatorOpts](https://babeljs.io/docs/en/babel-generator), objects are merged**, rather than replaced.

- For **plugins** and **presets**, they are replaced based on the identity of the plugin/preset object/function itself combined with the name of the entry.

> Option (except plugin/preset) merging

As an example, consider a config with:
>**This is a JavaScript config file**

```javascript
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
```

When `NODE_ENV` is test, the sourceType option will be replaced and the assumptions option will be merged. The effective config is:

```javascript
{
  sourceType: "module", // sourceType: "script" is overwritten
  assumptions: {
    setClassFields: true,
    iterableIsArray: true, // assumptions are merged by Object.assign
  },
}
```

## Conclusion

![party](https://media.giphy.com/media/3oKIPu1AxMWB2xlwl2/giphy.gif)

Yes!, you did it. Just keep in mind, you should read the [`docs`](https://babeljs.io/docs/en/) as well, there's a lot more stuff.

Definitely read this one 👉 [**Name Normalization**](https://babeljs.io/docs/en/options#name-normalization)

Sometimes you'll not find an article as I didn't found one when I started writing it. So, get it in your habit to really become a good Software Engineer.

Good Bye!

![see-you-soon](https://media.giphy.com/media/l1J3CbFgn5o7DGRuE/giphy.gif)