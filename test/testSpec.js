var analyzer = require('../lib/analyzer');
describe('Find function', function () {
  var exportedFuncs = {};
  var cnt = 0;
  var funcRegexp = /^\s*function.*\(.*?\)\s*\{.+?\}\s*$/;
  beforeEach(function () {
    exportedFuncs = {};
    cnt = 0;
  });
  it('Test #1', function () {
    var codeStr = `
      function abc() {
        return true;
      };
    `;
    codeStr = codeStr.replace(/\n/g, '');
    analyzer(codeStr, 0, -1, 'window', exportedFuncs);
    for (var n in exportedFuncs) {
      expect(exportedFuncs[n]).toMatch(funcRegexp);
      cnt++;
    }
    expect(1).toBe(cnt);
  });
  it('Test #2', function () {
    var codeStr = `
      var abc = function() {
        return true;
      };
    `;
    codeStr = codeStr.replace(/\n/g, '');
    analyzer(codeStr, 0, -1, 'window', exportedFuncs);
    for (var n in exportedFuncs) {
      expect(exportedFuncs[n]).toMatch(funcRegexp);
      cnt++;
    }
    expect(1).toBe(cnt);
  });
  it('Test #3', function () {
    var codeStr = `
    var _function_ = function() {
        return true;
      };
    `;
    codeStr = codeStr.replace(/\n/g, '');
    analyzer(codeStr, 0, -1, 'window', exportedFuncs);
    for (var n in exportedFuncs) {
      expect(exportedFuncs[n]).toMatch(funcRegexp);
      cnt++;
    }
    expect(1).toBe(cnt);
  });
  it('Test #4', function () {
    var codeStr = `
      function  () {
        return true;
      };
    `;
    codeStr = codeStr.replace(/\n/g, '');
    analyzer(codeStr, 0, -1, 'window', exportedFuncs);
    for (var n in exportedFuncs) {
      expect(exportedFuncs[n]).toMatch(funcRegexp);
      cnt++;
    }
    expect(1).toBe(cnt);
  });
  it('Test #5', function () {
    var codeStr = `
      function _function_ () {
        return true;
      };
    `;
    codeStr = codeStr.replace(/\n/g, '');
    analyzer(codeStr, 0, -1, 'window', exportedFuncs);
    for (var n in exportedFuncs) {
      expect(exportedFuncs[n]).toMatch(funcRegexp);
      cnt++;
    }
    expect(1).toBe(cnt);
  });
  it('Test #6', function () {
    var codeStr = `
      // 1
      function _function_ () {
        // 2
        function test() {
          return true;
        }
        // 3
        var qwe = function test() {
          return true;
        }
        return true;
      };
    `;
    codeStr = codeStr.replace(/\n/g, '');
    analyzer(codeStr, 0, -1, 'window', exportedFuncs);
    for (var n in exportedFuncs) {
      expect(exportedFuncs[n]).toMatch(funcRegexp);
      cnt++;
    }
    expect(3).toBe(cnt);
  });
  it('Test #7', function () {
    var codeStr = `
      var funcs = {
        // 1
        funcs1: function() {
          return true;
        },
        // 2
        funcs2: function() {
          var a = {
            // 3
            f : function() {
              return true;
            }
          }
          return true;
        }
      };
      // 4
      funcs.funcs2= function() {
        return true;
      }
    `;
    codeStr = codeStr.replace(/\n/g, '');
    analyzer(codeStr, 0, -1, 'window', exportedFuncs);
    for (var n in exportedFuncs) {
      expect(exportedFuncs[n]).toMatch(funcRegexp);
      cnt++;
    }
    expect(4).toBe(cnt);
  });
});