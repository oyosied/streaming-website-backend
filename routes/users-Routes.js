const express = require("express");

const usersController = require("../controllers/users-controllers.js");

const router = express.Router();

router.post("/register", usersController.register);

module.exports = router;
