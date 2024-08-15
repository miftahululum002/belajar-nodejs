const express = require("express");
const mongoose = require("mongoose");
const Product = require("../model/product");
const { body, validationResult, check } = require("express-validator");

const getProducts = async (req, res) => {
    const products = await Product.find();
    res.render("product", {
        layout: "layouts/app",
        title: "Products",
        products,
        msg: req.flash("msg"),
    });
};

module.exports = { getProducts };
