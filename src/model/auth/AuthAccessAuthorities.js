const mongoose = require('mongoose');
const { Schema } = mongoose;

const accessAuthSchema = new Schema({
  accessTarget: String, // ACCESS_TARGET
  authorityArray: Array,
}, {
  collection: 'auth_access_authorities',
});

module.exports = mongoose.model('AuthAccessAuthorities', accessAuthSchema);
