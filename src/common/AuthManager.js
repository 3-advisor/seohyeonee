/*
 * Copyright (c) 2019 LINE Corporation. All rights reserved.
 * LINE Corporation PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

const AccessAuthorities = require('../model/auth/AuthAccessAuthorities');
const Whitelist = require('../model/auth/AuthWhitelist');

module.exports = class {
    constructor() {
    }
    check(userId, accessTarget) {
        return new Promise(function (resolve, reject) {
            let promise1 = new Promise(function (resolve, reject) {
                let options = {
                    userId: userId
                };

                Whitelist.findOne(options, function (err, val) {
                    if (err) {
                        reject('database failure')
                    }
                    resolve(val);
                });
            });

            let promise2 = new Promise(function (resolve, reject) {
                let options = {
                    accessTarget: accessTarget
                };

                AccessAuthorities.findOne(options, function (err, val) {
                    if (err) {
                        reject('database failure')
                    }
                    resolve(val);
                });
            });

            Promise.all([promise1, promise2]).then(function(values) {
                let userAuthority = values[0].authority;
                let accessAuthorities = values[1].authorityArray;

                console.log(values);
                console.log(userAuthority);
                console.log(accessAuthorities);

                if (accessAuthorities.length > 0) {
                    resolve(accessAuthorities.includes(userAuthority));
                } else {
                    reject('auth failure');
                }
            });
        });
    }
};