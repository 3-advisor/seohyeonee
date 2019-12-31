const Restaurant = require('../model/Restaurant');

module.exports = class MenuManager {
  add(data) {
    const entity = new Restaurant({
      description: '',
      ...data,
    });

    return new Promise((resolve, reject) => {
      console.log(entity);
      console.log(entity.save);
      entity.save(err => {
        if (err) {
          console.error(err);
          reject('fail');
        }
        resolve('ok');
      });
    });
  }

  get(tagArray) {
    return new Promise((resolve, reject) => {
      // const options = {tags: {$in: tagArray}};    // 하나라도 일치시 return
      const options = (tagArray.length > 0) ? { tags: { $all: tagArray } } : {}; // 모두 일치시 return
      Restaurant.find(options, (err, list) => {
        if (err) {
          reject('database failure');
        }
        resolve(list);
      });
    });
  }
};
