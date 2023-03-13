const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product.cjs");
const User = require("../models/user.cjs");

router.get("/products", (req, res, next) => {
  Product.find({})
    .then((data) => res.json(data))
    .catch(next);
});

router.get("/userproducts/:userid", async (req, res, next) => {
  try {
    let products = await Product.find({});

    let user = await User.findOne({ _id: req.params.userid });
    console.log(user);
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

    let cartIndex = 0;
    let prodIndex = 0;

    let finalproducts = products;

    if (cart.length !== 0) {
      for (prodIndex = 0; prodIndex < products.length; prodIndex++) {
        let item = cart[cartIndex];
        let product = products[prodIndex];

        if (item?.pid != product._id) {
          continue;
        }

        cartIndex++;
        finalproducts[prodIndex].quantityInCart = item.quantity;
      }
    }
    res.send({ message: "product details sent", data: finalproducts });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

router.post("/product", async (req, res, next) => {
  if (req.body) {
    Product.create(req.body)
      .then((data) => res.send({ message: "product created", data: data }))
      .catch(next);
  } else {
    res.send({
      error: "The input field is empty",
    });
  }
});

module.exports = router;
