const express = require("express");
const {
  validateInputs,
  validateTokenWithResponse,
} = require("../middleware/validators/validator.js");
const usersController = require("../controllers/users-controllers.js");

const router = express.Router();

router.post("/register", validateInputs, usersController.register);
router.post("/login", validateInputs, usersController.login);
router.get("/validate-token", validateTokenWithResponse);
router.use((req, res) => {
  res.status(404).json({ message: "No such API" });
});
module.exports = router;
