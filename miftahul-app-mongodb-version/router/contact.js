const express = require("express");
const router = express.Router();
const contactController = require("../handler/ContactController");
const { body, validationResult, check } = require("express-validator");

router.get("/", contactController.getContacts);
router.get("/add", contactController.addContact);
router.post(
  "/",
  [
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No HP tidak valid").isMobilePhone("id-ID"),
  ],
  contactController.storeContact
);
router.get("/edit/:id", contactController.editContact);
router.get("/:id", contactController.getContactById);
router.put("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);
module.exports = router;
