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

