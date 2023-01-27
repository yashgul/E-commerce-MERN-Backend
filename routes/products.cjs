const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product.cjs");

router.get("/products", (req, res, next) => {
  // This will return all the data, exposing only the id and action field to the client
  Product.find({})
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/product", (req, res, next) => {
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

router.post("/paginate", async (req, res) => {
  const { page, limit } = req.body;
  Product.paginate(
    {},
    {
      page: parseInt(page, 10) | 1,
      limit: parseInt(limit, 10) | 1,
      sort: { createdAt: -1 },
    },
    function (err, result) {
      if (err) console.log(err);

      res.send({ message: "paginated result pag no." + page, data: result });
    }
  );
});

module.exports = router;
