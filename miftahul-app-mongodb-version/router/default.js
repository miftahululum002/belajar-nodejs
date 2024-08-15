const express = require("express");
const router = express.Router();
const defaultController = require("../handler/DefaultController");

router.get("/", defaultController.beranda);
router.get("/about", defaultController.about);
module.exports = router;
