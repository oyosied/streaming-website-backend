const express = require("express");
const { validateInputs } = require("../middleware/validators/validator.js");
const usersController = require("../controllers/users-controllers.js");

const router = express.Router();

router.post("/register", validateInputs, usersController.register);
module.exports = router;
