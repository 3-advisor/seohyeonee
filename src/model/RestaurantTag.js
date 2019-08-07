var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantTagSchema = new Schema({
  tid: BigInt,
  name: String,
  restaurants: Array,
}, {
  collection: 'restaurant_tag'
});

module.exports = mongoose.model('RestaurantTag', restaurantTagSchema);