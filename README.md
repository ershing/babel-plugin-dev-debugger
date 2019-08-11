# babel-plugin-dev-debugger

a babel plugin for dev-debugger to remove the test code

## Example

**In**

```js
import DevDebugger from 'dev-debugger'

let dbg = new DevDebugger({
    debug: true,
    caseName: 'testInit',
    cases: {
        'testInit': {
            'baseData': 100
        },
        'testEnd': {
            'baseData': 0
        }
    }
})

let base = 3
var data1 = dbg.debugVal(1, 100)
var data2 = dbg.debugVal(function () { return base }, function () { return 3 })
var data3 = dbg.debugVal({ base }, { base: 9 })
var data4 = dbg.debugCaseTag(2, 'baseData')
```

**Out**

```js
let base = 3;
var data1 = 1;
var data2 = function () {
    return base;
};
var data3 = { base };
var data4 = 2;
```

## Installation

```sh
$ npm i babel-plugin-dev-debugger -D
```

## Usage

### Via `babel.config.js` (Recommended)

**babel.config.js**

```js
module.exports = {
  "plugins": process.env.NODE_ENV === "production" ? ["babel-plugin-dev-debugger"] : []
}
```

### Via CLI

```sh
$ babel --plugins babel-plugin-dev-debugger script.js
```
