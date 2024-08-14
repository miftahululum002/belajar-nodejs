const mongoose = require("mongoose");
const Product = mongoose.model("Product", {
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = Product;
