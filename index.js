// require
var fs = require('fs');
var analyzer = require('./lib/analyzer');
// 버전정보
var VERSION = '0.0.2';
// global context is `window`
var exportedFuncs = {};
// 리터럴 형태의 함수만 수집 가능.
var exportPrivateFunction = function (args, config, logger, helper) {
  var global = config.outflowPreprocessor.global || 'window';
  var silent = config.outflowPreprocessor.silent === false ? false : true;
  if (config.outflowPreprocessor) {
    for (var it, i = 0; i < config.outflowPreprocessor.files.length; i++) {
      it = config.outflowPreprocessor.files[i];
      var jsCode = fs.readFileSync(it.src, 'utf8').replace(/^\n/gm, '');
      var funcs = [];
      var index = [];
      analyzer(jsCode, 0, -1, 'window', exportedFuncs);
      funcs.push(global + '.outflow = {');
      index.push('\n\n// [Outflow] function Index :D');

      for (var n in exportedFuncs) {
        funcs.push('  \'' + n + '\':' + exportedFuncs[n] + ',');
        index.push('// outflow[\'' + n + '\']');
        if (!silent) {
          console.log('extract -> ' + n);
        }
      }
      funcs.push('  \'version\': \'' + VERSION + '\'');
      funcs.push('};');

      funcs = funcs.concat(index);
      fs.writeFileSync(it.dst || it.src.replace(/(\..+)\.js$/, '$1.outflow.js'), jsCode + funcs.join('\n'));
    }
  }
  return function (content, file, done) {
    done(null, content);
  }
};

module.exports = {
  'preprocessor:outflow': ['factory', exportPrivateFunction]
};