const jwt = require("jsonwebtoken");
const DB = require("../utils/DB.js");
const bcrypt = require("bcrypt");
const ServerManager = require("../utils/Managers/ServerManager.js");

// yes it's dirty , and yes I can use sequalize , ze ma yesh
const register = async (req, res, next) => {
  const { email, password, phone, gender } = req.body;
  const find_email = await DB.query(
    "find email",
    "SELECT * FROM streaming_db.users where email = ?",
    [email]
  );
  if (find_email.error) {
    res.status(400).json({ message: "Error occured when checking for email" });
  } else if (find_email.results.length !== 0) {
    res.status(409).json({ message: "Email already exists" });
  } else {
    const find_phone = await DB.query(
      "find phone",
      "SELECT * FROM streaming_db.users where phone_number = ?",
      [phone]
    );
    if (find_phone.error) {
      res
        .status(400)
        .json({ message: "Error occured when checking for phone" });
    } else if (find_phone.results.length !== 0) {
      res.status(409).json({ message: "Phone already exists" });
    } else {
      //hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const insert_result = await DB.query(
        "register user",
        "INSERT INTO streaming_db.users (email, password, gender, phone_number) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, gender, phone]
      );
      if (!insert_result.error) {
        res.status(201).json({ message: "Added successfully" });
      } else {
        res.status(400).json({ message: "Error occured when adding user" });
      }
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const find_user = await DB.query(
    "find user",
    "SELECT * FROM streaming_db.users where email = ?",
    [email]
  );
  if (find_user.error) {
    res.status(400).json({ message: "Error occured when checking for user" });
  } else if (find_user.results.length === 0) {
    res.status(404).json({ message: "Email or password is incorrect" });
  } else {
    const match = await bcrypt.compare(password, find_user.results[0].password);
    if (match) {
      const token = jwt.sign(
        { user_id: find_user.results[0]["id"] },
        ServerManager.jwt_secret,
        {
          expiresIn: "12h",
        }
      );
      res.status(200).json({
        message: "Auth successful",
        token: token,
      });
    } else {
      res.status(404).json({ message: "Email or password is incorrect" });
    }
  }
};
exports.login = login;
exports.register = register;
