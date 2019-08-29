const AccessAuthorities = require('../model/auth/AuthAccessAuthorities');
const Whitelist = require('../model/auth/AuthWhitelist');

module.exports = class {
  check(userId, accessTarget) {
    return new Promise(((resolve, reject) => {
      const getUserIdFromDB = new Promise(((resolve, reject) => {
        const options = { userId };

        Whitelist.findOne(options, (err, val) => {
          if (err) {
            reject('database failure');
          }
          if (val === null) {
            resolve(); // reject('can not find user');
          }
          resolve(val);
        });
      }));

      const getAccessTargetFromDB = new Promise(((resolve, reject) => {
        const options = {
          accessTarget,
        };

        AccessAuthorities.findOne(options, (err, val) => {
          if (err) {
            reject('database failure');
          }
          if (val === null) {
            // reject('can not find accessTarget');
            resolve();
          }
          resolve(val);
        });
      }));

      Promise.all([getUserIdFromDB, getAccessTargetFromDB]).then((values) => {
        if (!values.every((value) => value)) resolve();

        const userAuthority = values[0].authority; // userId -> ADMIN
        const accessAuthorities = values[1].authorityArray; // regMenu -> [ADMIN, MANAGER]

        if (accessAuthorities.length > 0) {
          resolve(accessAuthorities.includes(userAuthority));
        } else {
          reject('auth failure');
        }
      })
        .catch((reason) => {
          reject(reason);
        });
    }));
  }
};
