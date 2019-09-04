const Restaurant = require('../model/Restaurant');

module.exports = class {
  add(name, tagArray) {
    const entity = new Restaurant({
      name,
      tags: tagArray,
      description: '',
    });

    return new Promise(((resolve, reject) => {
      entity.save((err) => {
        if (err) {
          console.error(err);
          reject('fail');
        }
        resolve('ok');
      });
    }));
  }

  get(tagArray) {
    return new Promise(((resolve, reject) => {
      // const options = {tags: {$in: tagArray}};    // 하나라도 일치시 return

      const options = { tags: { $all: tagArray } }; // 모두 일치시 return
      Restaurant.find(options, (err, list) => {
        if (err) {
          reject('database failure');
        }
        resolve(list);
      });
    }));
  }
};
