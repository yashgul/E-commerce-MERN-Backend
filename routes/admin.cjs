const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user.cjs");
const Product = require("../models/product.cjs");
const Order = require("../models/order.cjs");

//userid from params product id from body
router.post("/addQuantity/:prodid", async (req, res) => {
  let prod = await Product.findOne({ _id: req.params.prodid });
  prod.quantity += 1;

  await prod.save();

  res.status(200).json({
    message: "Quantity added",
    data: prod,
  });
});

router.post("/reduceQuantity/:prodid", async (req, res) => {
  let prod = await Product.findOne({ _id: req.params.prodid });

  if (prod.quantity <= 0)
    res.status(400).send({
      message: "Item already has",
      data: prod,
    });

  prod.quantity -= 1;

  await prod.save();

  res.status(200).send({
    message: "Quantity added",
    data: prod,
  });
});
router.post("/removeItem/:prodid", async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.prodid });
  } catch (error) {
    res.status(400).send({ error: "no such product exists" });
  }
  res.send({ message: "item successfully deleted" });
});

router.post("/removeItem/:userid", async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.userid });
    console.log(user.cart);
    let itemindex = user.cart.findIndex((item) => item.pid === req.body.pid);
    console.log(itemindex);
    if (itemindex !== -1 && user.cart[itemindex].quantity > 0) {
      // Item already exists in cart, update quantity

      user.cart[itemindex].quantity -= 1;
      await user.save();
      res.send({ message: "Item removed from cart" });
    } else {
      res.status(400).send({ error: "No such item in cart" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/checkout/:userid", async (req, res) => {
  try {
    let user = await User.findOne({});
    let products = await Product.find({});

    products = products.sort((a, b) => {
      if (a._id > b._id) {
        return -1;
      }
      if (b._id > a._id) {
        return 1;
      }
      return 0;
    });
    let cart = user.cart.sort((a, b) => {
      if (a.pid > b.pid) {
        return -1;
      }
      if (b.pid > a.pid) {
        return 1;
      }
      return 0;
    });

    console.log(products);
    console.log(cart);

    let cartIndex = 0;
    let prodIndex = 0;

    let cost = 0;

    for (prodIndex = 0; prodIndex < products.length; prodIndex++) {
      let item = cart[cartIndex];
      let product = products[prodIndex];

      if (item.pid != product._id) {
        continue;
      }
      if (item.quantity > product.quantity) {
        res.status(400).send({
          error: `Item ${product.name} only has ${product.quantity} available. Please update your cart.`,
        });
        return;
      }
      cost += item.cost * item.quantity;
      cartIndex++;
      // reduce the item's quantity by the same amount as the cart item
      products[prodIndex].quantity -= item.quantity;
    }

    user.cart = [];

    console.log(products);

    products.forEach(async (newproduct) => {
      await newproduct.save();
    });

    let order = {
      userid: user._id,
      email: user.email,
      phoneNo: user.phoneNo,
      firstName: user.firstName,
      secondName: user.secondName,
      cart: user.cart,
      cost: cost,
    };

    await Order.create(order);

    console.log(order);
    await user.save();
    // process checkout if all items have enough available quantity
    // ...
    res.send({ message: "Checkout successful!", cost: cost });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
