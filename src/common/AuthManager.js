const AccessAuthorities = require('../model/auth/AuthAccessAuthorities');
const Whitelist = require('../model/auth/AuthWhitelist');

module.exports = class {
    constructor() {
    }
    check(userId, accessTarget) {
        return new Promise(function (resolve, reject) {
            let getUserIdFromDB = new Promise(function (resolve, reject) {
                let options = {
                    userId: userId
                };

                Whitelist.findOne(options, function (err, val) {
                    if (err) {
                        reject('database failure')
                    }
                    if (val == null) {
                        reject('can not find user');
                    }
                    resolve(val);
                });
            });

            let getAccessTargetFromDB = new Promise(function (resolve, reject) {
                let options = {
                    accessTarget: accessTarget
                };

                AccessAuthorities.findOne(options, function (err, val) {
                    if (err) {
                        reject('database failure')
                    }
                    if (val == null) {
                        reject('can not find accessTarget');
                    }
                    resolve(val);
                });
            });

            Promise.all([getUserIdFromDB, getAccessTargetFromDB]).then(function(values) {
                let userAuthority = values[0].authority;
                let accessAuthorities = values[1].authorityArray;

                if (accessAuthorities.length > 0) {
                    resolve(accessAuthorities.includes(userAuthority));
                } else {
                    reject('auth failure');
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
};