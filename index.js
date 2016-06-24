// require
var fs = require('fs');
// 버전정보
var VERSION = '0.0.1';
// global context is `window`
var exportedFuncs = {};
// 리터럴 형태의 함수만 수집 가능.
var gather = function (codeString, startOffset) {
  var ret = {
    sName: -1,
    eName: -1,
    sFuncStr: -1,
    sFunc: -1,
    eFunc: -1,
    sReturn: -1,
    eReturn: -1
  };
  var bk = {
    '{': 0,
    '}': 0
  };
  for (var i = 0; i < codeString.length; i++) {
    // function 탐색
    if (ret.sFuncStr === -1 && codeString.slice(i, i + 8) === 'function' && codeString[i - 1] !== '\'') {
      ret.sFuncStr = i;
      if (!/\s|\(/.test(codeString[ret.sFuncStr + 8])) {
        // `function` 문자열 다음에는 공백이나 괄호가 있어야 함.
        break;
      }
      // function 이름 탐색 -- `var funcName = function..` 일거라는 추측..
      for (var j = ret.sFuncStr; j >= 0; j--) {
        if (/;|}/.test(codeString[j])) {
          // 만나면 안되는 문자..
          break;
        }
        if (ret.eName === -1
          && ((/\s/.test(codeString[j + 1]) && /=|:/.test(codeString[j + 2])) || (/=|:/.test(codeString[j + 1])))
            // 펑션 이름에 들어갈 수 있는 문자열 `fn = rep || function.., fn: function..` 케이스 제외 코드
          && /\w|\$|_/.test(codeString[j])
        ) {
          ret.eName = j + 1;
        }
        if (ret.sName === -1 && ret.eName !== -1 && (/\s|\n/.test(codeString[j - 1]) || j === 0)) {
          ret.sName = j;
          // 루프 탈출
          break;
        }
      }
      if ((ret.sName === -1 || ret.eName === -1) && codeString[ret.sFuncStr + 8] === ' ') {
        // 리터럴 형태의 펑션을 찾지 못한 경우, `function name()..`을 탐색한다.
        for (var k = ret.sFuncStr + 8; k < codeString.length; k++) {
          if (ret.sName === -1) {
            if (/\w/.test(codeString[k])) {
              ret.sName = k;
            }
          }

          if (ret.sName !== -1 && ret.eName === -1) {
            if (/\s|\(/.test(codeString[k + 1])) {
              ret.eName = k + 1;
              break;
            }
          }
        }
      }
      // 7 = 'function'.length
      i = i + 7;
      // sFunc위치를 찾는다.
      while (true) {
        if (codeString[i] === '{') {
          ret.sFunc = i + 1;
          break;
        }
        i++;
      }
    }
    // 리턴 검사, 6 = 'return'.length
    if (codeString.slice(i, i + 6) === 'return') {
      ret.sReturn = i;
      ret.eReturn = i + 6;
      i = i + 5;
    }
    // 브라켓 검사
    if (ret.sFuncStr !== -1) {
      switch (codeString[i]) {
        case '{':
          bk[codeString[i]]++;
          break;

        case '}':
          bk[codeString[i]]++;
          break;
      }
      if (bk['{'] !== 0 && bk['{'] === bk['}']) {
        ret.eFunc = i + 1;
        // 루프 탈출
        break;
      }
    }
  }
  return ret;
};

var analyzer = function (codeStr, startOffset, endOffset, parents) {
  var codeStr = codeStr.slice(startOffset, endOffset);
  var ret = gather(codeStr);
  // 펑션 이름이 있다면 펑션에 대한 정보를 수집함
  if (ret.sName !== -1) {
    exportedFuncs[parents + '.' + codeStr.slice(ret.sName, ret.eName)] = codeStr.slice(ret.sFuncStr, ret.eFunc);
  }
  if (ret.sFunc !== -1 && ret.eFunc < codeStr.length) {
    // 동일레벨 펑션정보 수집
    analyzer(codeStr, ret.eFunc, codeStr.length, parents);
    // 컨텍스트 업데이트
    parents += '.' + codeStr.slice(ret.sName, ret.eName);
    // 자식 펑션 정보 수집
    analyzer(codeStr, ret.sFunc, ret.eFunc, parents);
  }
  return ret;
};

var exportPrivateFunction = function (args, config, logger, helper) {
  var global = config.outflowPreprocessor.global || 'window';
  var silent = config.outflowPreprocessor.silent === false ? false : true;
  if (config.outflowPreprocessor) {
    for (var it, i = 0; i < config.outflowPreprocessor.files.length; i++) {
      it = config.outflowPreprocessor.files[i];
      var jsCode = fs.readFileSync(it.src, 'utf8').replace(/^\n/gm, '');
      var funcs = [];
      var index = [];
      analyzer(jsCode, 0, -1, 'window');
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