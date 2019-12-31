const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../../local.env');

dotenv.config({ path: envPath });

module.exports = {
  lineApiToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'DUMMY_LINE_CHANNEL_ACCESS_TOKEN',
  mongoosePort: process.env.PORT || 3000,
  mongoDbUri: (process.env.DB_ENV === 'local') ? process.env.MONGODB_LOCAL_URI : process.env.MONGODB_URI,
};
