const shell = require('shelljs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../local.env') });

const DEFAULT_CONF = {
  NODE_PLATFORM: process.platform,
  PATH_MAC: '/Applications/MongoDB.app/Contents/Resources/Vendor/mongodb/bin',
  PATH_WIN: null, // it depends on the version : 'mongodb-path/Server/{version}/bin'
  LOCAL_DB_PATH: './datas',
  PORT: 27017,
};

const ABS_PATH = (() => {
  if (DEFAULT_CONF.NODE_PLATFORM === 'darwin') {
    return process.env.MONGODB_ABS_PATH_MAC || DEFAULT_CONF.PATH_MAC;
  } else if (DEFAULT_CONF.NODE_PLATFORM === 'win32') {
    return process.env.MONGODB_ABS_PATH_WIN || DEFAULT_CONF.PATH_WIN;
  }
  
  return ''; // not supported
})();
const LOCAL_DB_PATH = process.env.MONGODB_LOCAL_DB_PATH || DEFAULT_CONF.LOCAL_DB_PATH;
const MONGODB_PORT = process.env.MONGODB_PORT || DEFAULT_CONF.PORT;

const execMongod = (validMongoPath) => {
  const RESOLVED_DB_PATH = path.resolve(__dirname, `${LOCAL_DB_PATH}`);
  shell.mkdir('-p', RESOLVED_DB_PATH);
  shell.exec(`${validMongoPath} --dbpath ${RESOLVED_DB_PATH} --port ${MONGODB_PORT}`);
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
