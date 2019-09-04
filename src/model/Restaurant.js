const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema({
  rid: Number,
  name: String,
  description: String,
  tags: Array,
}, {
  collection: 'restaurant',
});

module.exports = mongoose.model('restaurant', restaurantSchema);
