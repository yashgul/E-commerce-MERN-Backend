const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema for todo
const userSchema = new Schema({
  isAdmin: { type: Boolean, default: false },
  email: String,
  phoneNo: String,
  password: String,
  firstName: String,
  LastName: String,
  cart: [
    {
      pid: String,
      name: String,
      quantity: Number,
      cost: Number,
    },
  ],
});

// Create model for todo

var User = mongoose.model("user", userSchema);

module.exports = User;
