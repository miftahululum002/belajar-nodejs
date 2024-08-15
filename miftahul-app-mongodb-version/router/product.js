const express = require("express");
const router = express.Router();
const ProductController = require("../handler/ProductController");
const { body, validationResult, check } = require("express-validator");

router.get("/", ProductController.getProducts);

module.exports = router;
