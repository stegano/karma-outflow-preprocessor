var gather = require('./gather');
var analyzer = function (codeStr, startOffset, endOffset, parents, exportedFuncs) {
  exportedFuncs = exportedFuncs || {};
  var codeStr = codeStr.slice(startOffset, endOffset);
  var ret = gather(codeStr);
  // 펑션 이름이 있다면 펑션에 대한 정보를 수집함
  if (ret.sName !== -1) {
    exportedFuncs[parents + '.' + codeStr.slice(ret.sName, ret.eName)] = codeStr.slice(ret.sFuncStr, ret.eFunc);
  }
  if (ret.sFunc !== -1 && ret.eFunc < codeStr.length) {
    // 동일레벨 펑션정보 수집
    analyzer(codeStr, ret.eFunc, codeStr.length, parents, exportedFuncs);
    // 컨텍스트 업데이트
    parents += '.' + codeStr.slice(ret.sName, ret.eName);
    // 자식 펑션 정보 수집
    analyzer(codeStr, ret.sFunc, ret.eFunc, parents, exportedFuncs);
  }
  return ret;
};
module.exports = analyzer;