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
                        reject('database failure');
                    }
                    if (val == null) {
                        //reject('can not find user');
                        resolve();
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
                        //reject('can not find accessTarget');
                        resolve();
                    }
                    resolve(val);
                });
            });

            Promise.all([getUserIdFromDB, getAccessTargetFromDB]).then(function(values) {
                if (!values.every((value) => value)) {
                    resolve();
                }

                let userAuthority = values[0].authority;    // userId -> ADMIN
                let accessAuthorities = values[1].authorityArray;   // regMenu -> [ADMIN, MANAGER]

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