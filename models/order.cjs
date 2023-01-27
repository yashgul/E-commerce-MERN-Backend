const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema for todo
const orderSchema = new Schema({
  userid: String,
  email: String,
  phoneNo: String,
  firstName: String,
  secondName: String,
  cost: Number,
  cart: [
    {
      pid: String,
      quantity: Number,
    },
  ],
});

// Create model for todo

var Order = mongoose.model("order", orderSchema);

module.exports = Order;
