const mongoose = require('mongoose');
const { Schema } = mongoose;

const whitelistSchema = new Schema({
  userId: String,
  authority: String,
}, {
  collection: 'auth_whitelist',
});

module.exports = mongoose.model('AuthWhitelist', whitelistSchema);
