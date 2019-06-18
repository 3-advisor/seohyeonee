var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  name: String,
  category: String,
}, {
  collection: 'restaurant'
});

module.exports = mongoose.model('restaurant', restaurantSchema);