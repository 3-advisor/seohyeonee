const LineBot = require('../LineBot');
const lineBot = new LineBot();

/*
 * lint: no-undef 규칙을 피하기 위해 정의되지 않은 메서드를 빈 메서드로 정의합니다.
 * jest가 실행 될 때는 해당 메서드가 정의된 채로 실행됩니다.
 */
if (!global.it) {
  global.it = () => {
    // empty
  };
  global.describe = () => {
    // empty
  };
  global.expect = () => {
    // empty
  };
}


class TestUtil {
  static runSimpleTarget(targetObj) {
    for (const key in targetObj) {
      if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
        const expectTarget = key;
        const toBeTarget = targetObj[key];
        global.it(`expect[${expectTarget}] => toBe[${toBeTarget}]`, () => {
          global.expect(lineBot.extractCommand(expectTarget)).toBe(toBeTarget);
        });
      }
    }
  }
}


global.describe('Check Utility', () => {
  global.describe('Command 추출하기', () => {
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
