var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accessAuthSchema = new Schema({
  accessTarget: String,
  authorityArray: Array,
}, {
  collection: 'auth_access_authorities'
});

module.exports = mongoose.model('AuthAccessAuthorities', accessAuthSchema);