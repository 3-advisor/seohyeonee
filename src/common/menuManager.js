const Restaurant = require('../model/Restaurant');

const RESTAURANT_FIND_PARAM_KEYS = ['category', 'etc'];

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
    get(options) {
        const MAX_ARGS_COUNT = RESTAURANT_FIND_PARAM_KEYS.length;
        const SLICED_OPTIONS = options.slice(0, MAX_ARGS_COUNT);

        return new Promise(function (resolve, reject) {
            const OPTIONS = SLICED_OPTIONS.reduce((result, item, i) => {
                const KEY = RESTAURANT_FIND_PARAM_KEYS[i];
                result[KEY] = item;
                return result;
            }, {});

            Restaurant.find(OPTIONS, function (err, list) {
                if (err) {
                    reject('database failure')
                };
                resolve(list);
            });
        });
    }
}