const Restaurant = require('../model/Restaurant');

module.exports = class {
    constructor() {

    }
    add(name, category) {
        const entity = new Restaurant({
            name,
            category
        });

        return new Promise(function (resolve, reject) {
            entity.save(function (err) {
                if (err) {
                    console.error(err);
                    reject('fail');
                }
                resolve('ok');
            });
        });
    }
    get(tagArray) {
        return new Promise(function (resolve, reject) {
            //let options = {tags: {$in: tagArray}};    // 하나라도 일치시 return
            let options = {tags: tagArray};             // 모두 일치시 return
            Restaurant.find(options, function (err, list) {
                if (err) {
                    reject('database failure')
                }
                resolve(list);
            });
        });
    }
}