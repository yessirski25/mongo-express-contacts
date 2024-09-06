const express = require("express");
const router = express.Router();
const { Contacts, getContact, createContact, editContact, deleteContact } = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(Contacts).post(createContact);
router.route("/:id").get(getContact).put(editContact).delete(deleteContact);

module.exports = router;