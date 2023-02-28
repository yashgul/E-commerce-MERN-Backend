const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
// Create schema for todo
var productSchema = new Schema({
  name: String,
  cost: Number,
  category: String,
  quantity: Number,
  about: String,
  manufacturer: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  quantityInCart: { type: Number, default: 0 },
});

// Create model for todo
productSchema.plugin(mongoosePaginate);
var Product = mongoose.model("product", productSchema);

module.exports = Product;
