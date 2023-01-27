const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/api.cjs");
const auth = require("./routes/auth.cjs");
const products = require("./routes/products.cjs");
const cart = require("./routes/cart.cjs");
const admin = require("./routes/admin.cjs");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api", routes);
app.use("/auth", auth);
app.use("/products", products);
app.use("/cart", cart);
app.use("/admin", admin);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
