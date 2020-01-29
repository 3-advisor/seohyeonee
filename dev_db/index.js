const shell = require('shelljs');
const path = require('path');
const ENV = require('../src/util/dotEnvStorage');

const ABS_PATH = (() => {
  if (process.platform === 'darwin') {
    return ENV.MONGODB_ABS_PATH_MAC;
  } else if (process.platform === 'win32') {
    return ENV.MONGODB_ABS_PATH_WIN;
  }
  return ''; // not supported
})();


const execMongod = (validMongoPath) => {
  const RESOLVED_DB_PATH = path.resolve(__dirname, `${ENV.LOCAL_DB_PATH}`);
  shell.mkdir('-p', RESOLVED_DB_PATH);
  shell.exec(`"${validMongoPath}" --dbpath "${RESOLVED_DB_PATH}" --port "${ENV.MONGODB_PORT}"`);
};

console.log('Start mongo local db server...\n');

const mongodPath = [
  'mongod',
  `${ABS_PATH}/mongod`,
];

mongodPath.forEach((path) => {
  console.log(` 🔍  Try to seek : ${path}`);
  if (shell.which(path)) {
    console.info(` ✅  Run success : ${path}\n`);
    execMongod(path);
    return;
  }
  console.error(` ❌  There is no : ${path}`);
});

console.error('\n' +
  ' ❌  mongod not found.\n' +
  '\tplease read \'https://github.com/3-advisor/seohyeonee/tree/develop/local_db\'\n' +
  '\tor check \'local.env\' file.\n');
