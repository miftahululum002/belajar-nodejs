const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult, check } = require("express-validator");

const beranda = (req, res) => {
    const mahasiswa = [
        {
            name: "Miftahul Ulum",
            email: "ulumiftahul06@gmail.com",
        },
        {
            name: "Ulum Miftahul",
            email: "miftahululum002@gmail.com",
        },
        {
            name: "Oke Miftahul",
            email: "okemiftahululum002@gmail.com",
        },
    ];
    res.render("index", {
        layout: "layouts/app",
        name: "Miftahul Ulum",
        title: "Home",
        mahasiswa,
    });
};

const about = (req, res) => {
    res.render("about", {
        layout: "layouts/app",
        title: "About",
    });
};

module.exports = { beranda, about };
