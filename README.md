# karma-outflow-preprocessor
Copy the hidden internal function to be accessible from the outside.

##Installation
```
npm install https://github.com/stegano/karma-outflow-preprocessor.git --save-dev
```

## Configuration and Usage
```javascript
// karma.conf.js
module.exports = function(config) {
  //...
  preprocessors: {
    '/**/*.js': ['outflow']
  },
  outflowPreprocessor: {
    global: 'window', // default : `window`, if you execute on node then use `global` setting.
    silent: true, // default : `true`, if the silent option is false, this list will be output to the console.
    files: [
      {
        src: './targetFile.js'
        dst: './targetFile.outflow.js' // default `targetFile.outflow.js`
      }
    ]
  }
  //...
}
```

## Demo
```javascript
// targetFile.js
function LegacyFunc() {
  function privateFunc1() {
   // blah blah blah..
   function privateFunc2() {
     // blah blah blah..
   }
  }
}
```
```javascript
// targetFile.outflow.js
function LegacyFunc() {
  function privateFunc1() {
   // blah blah blah..
   function privateFunc2() {
     // blah blah blah..
   }
  }
}
// [Outflow] function Index :D
window.outflow = {
  'LegacyFunc': function() {
    function privateFunc1() {
     // blah..
     function privateFunc2() {
       // blah blah..
     }
    }
  },
  'LegacyFunc.privateFunc1': function() {
   // blah..
   function privateFunc2() {
     // blah blah..
   }
  },
  'LegacyFunc.privateFunc1.privateFunc2': function() {
   // blah blah..
  }
};
```
