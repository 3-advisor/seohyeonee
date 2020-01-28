const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../../local.env');

dotenv.config({ path: envPath });

const ENV = process.env;

ENV.LINE_API_TOKEN = 
  ENV.LINE_CHANNEL_ACCESS_TOKEN || 'DUMMY_LINE_CHANNEL_ACCESS_TOKEN';

ENV.PORT =
  ENV.PORT || 3000;

ENV.MONGO_DB_URI = 
  (ENV.DB_ENV === 'local') 
    ? `${ENV.MONGODB_LOCAL_HOST}:${ENV.MONGODB_PORT}/${ENV.MONGODB_DB_NAME}` 
    : ENV.MONGODB_URI;

ENV.MONGODB_ABS_PATH_MAC = 
  ENV.MONGODB_ABS_PATH_MAC || '/Applications/MongoDB.app/Contents/Resources/Vendor/mongodb/bin';

ENV.MONGODB_ABS_PATH_WIN =
  ENV.MONGODB_ABS_PATH_WIN || null; // it depends on the version : 'mongodb-path/Server/{version}/bin', so default value is null. please modify local.env

ENV.LOCAL_DB_PATH = 
  ENV.MONGODB_LOCAL_DB_PATH || './datas';

ENV.MONGODB_PORT = 
  ENV.MONGODB_PORT || 27017;

module.exports = ENV;
