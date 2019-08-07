const Restaurant = require('../model/Restaurant');

const RESTAURANT_FIND_PARAM_KEYS = ['category', 'etc'];

module.exports = class {
    constructor() {
    }
    add(name, description, tags) {
        const entity = new Restaurant({
            name,
            description,
            tags,
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
    get(optionArray) {
        const slicedOptionArray = optionArray.slice(0, RESTAURANT_FIND_PARAM_KEYS.length);

        return new Promise(function (resolve, reject) {
            // TODO fix.
            const options = slicedOptionArray.reduce((result, item, i) => {
                const key = RESTAURANT_FIND_PARAM_KEYS[i];
                result[key] = item;
                return result;
            }, {});

            Restaurant.find(options, function (err, list) {
                if (err) {
                    reject('database failure')
                };
                resolve(list);
            });
        });
    }
}