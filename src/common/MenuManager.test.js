const mongoose = require('mongoose');

const MenuManager = require('./MenuManager');
const menuManager = new MenuManager();

const ENV = require('../util/dotEnvStorage');

beforeAll(async() => {
  // connect...
  await mongoose.connect(
    ENV.MONGO_DB_URI,
    {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.error(err);
        console.log(`mongo db uri: ${ENV.MONGO_DB_URI}`);
      }
    }
  );

  // add mock...
  const testMenu = {
    name: 'menuName',
    tags: ['tagArray1', 'tagArray2', 'tagArray3', 'tagArray4'],
  };
  await menuManager
    .add(testMenu)
    .then(result => {
      if (result === 'ok') {
        console.log(`${testMenu} added.`);
      } else {
        console.error(result);
      }
    });
});

afterAll(async() => {
  // release mongoose...
  await mongoose.disconnect();
});

// check : `menuManager.add` and `menuManager.get`
for (let i = 1; i <= 4; i++) {
  describe(`추가된거 확인해보기${i}`, () => {
    it(`tagArray${i} 로 검색`, async() => {
      await menuManager
        .get([`tagArray${i}`])
        .then(results => {
          const added = results.some(result => result.name === 'menuName');
          expect(added).toBeTruthy();
        });
    });
  });
}
