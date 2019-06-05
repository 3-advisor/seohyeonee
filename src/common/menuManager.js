const Restaurant = require('../model/Restaurant');

module.exports = class {
    constructor() {

    }
    add(name, category) {
        let entity = new Restaurant({
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
    get(category) {
        return new Promise(function (resolve, reject) {
            let options = category ? {
                category: category
            } : {};

            Restaurant.find(options, function (err, list) {
                if (err) {
                    reject('database failure')
                };
                resolve(list);
            });
        });
    }
}