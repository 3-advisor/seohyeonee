var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  name: String,
  description: String,
  tags: Array,
}, {
  collection: 'restaurant'
});

module.exports = mongoose.model('restaurant', restaurantSchema);