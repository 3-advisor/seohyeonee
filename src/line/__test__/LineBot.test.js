const LineBot = require('../LineBot');
const lineBot = new LineBot();


class TestUtil {
  static runSimpleTarget(targetObj) {
    for (const key in targetObj) {
      if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
        const expectTarget = key;
        const toBeTarget = targetObj[key];
        it(`expect[${expectTarget}] => toBe[${toBeTarget}]`, () => {
          expect(lineBot.extractCommand(expectTarget)).toBe(toBeTarget);
        });
      }
    }
  }
}


describe('Check Utility', () => {
  describe('Command 추출하기', () => {
    const testTarget = {};
    testTarget['/뭐먹지 /뭔가 / 먹 / 어야 /함'] = '뭐먹지';
    testTarget['뭐먹지 /뭔가 / 먹 / 어야 /함'] = null;
    testTarget[' /뭐먹지 /뭔가'] = null;
    testTarget['  뭐먹지 / 뭐먹지 /뭐먹지'] = null;
    testTarget['뭐먹지 뭐먹지/'] = null;
    testTarget['등록'] = null;
    testTarget['/ 등록'] = null;
    testTarget['/등록 임'] = '등록';
    TestUtil.runSimpleTarget(testTarget);
  });
});
