const express = require("express");
const router = express.Router();

const Product = require("../models/product.cjs");
const User = require("../models/user.cjs");

router.get("/products", (req, res, next) => {
  // This will return all the data, exposing only the id and action field to the client
  Product.find({})
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/product", (req, res, next) => {
  if (req.body) {
    Product.create(req.body)
      .then((data) => res.send({ message: "Product Created", data: data }))
      .catch(next);
  } else {
    res.send({
      error: "The input field is empty",
    });
  }
});

router.get("/allusers", (req, res, next) => {
  // This will return all the data, exposing only the id and action field to the client
  User.find({})
    .then((data) => res.send({ message: "All users retrieved", data: data }))
    .catch(next);
});

router.post("/user", (req, res, next) => {
  if (req.body) {
    User.create(req.body)
      .then((data) => res.send({ message: "All users retrieved", data: data }))
      .catch(next);
  } else {
    res.status(500).send({
      error: "User creation error",
    });
  }
});

module.exports = router;
