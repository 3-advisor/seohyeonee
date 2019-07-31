var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var whitelistSchema = new Schema({
  userId: String,
  authority: String,
}, {
  collection: 'auth_whitelist'
});

module.exports = mongoose.model('AuthWhitelist', whitelistSchema);