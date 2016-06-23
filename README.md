# karma-outflow-preprocessor
Extract private test function(only literal decleared function)

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
    global: 'window', // default `window`, if execute on node then use `global` setting.
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

