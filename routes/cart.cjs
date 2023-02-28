const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user.cjs");
const Product = require("../models/product.cjs");
const Order = require("../models/order.cjs");

router.get("/cart/:userid", (req, res, next) => {
  // This will return all the data, exposing only the id and action field to the client
  User.findOne({ _id: req.params.userid })
    .then((data) => {
      let user = data;
      console.log(user);
      let cost = 0;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].quantity > 0)
          cost += user.cart[i].quantity * user.cart[i].cost;
      }

      res.send({ message: "carts retrieved", data: data, cost: cost });
    })
    .catch(next);
});

//userid from params product id from body
router.post("/addItem/:userid", async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.userid });
    console.log(user.cart);
    let itemindex = user.cart.findIndex((item) => item.pid === req.body.pid);
    console.log(itemindex);
    if (itemindex !== -1) {
      // Item already exists in cart, update quantity

      user.cart[itemindex].quantity += 1;
      await user.save();
    } else {
      // Item not in cart, create new cart item

      user.cart.push({
        pid: req.body.pid,
        name: req.body.name,
        cost: req.body.cost,
        quantity: 1,
      });
      await user.save();
    }
    res.send({ message: "Item added to cart!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
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
