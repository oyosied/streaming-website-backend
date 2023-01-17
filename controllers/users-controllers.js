const DB = require("../utils/DB.js");

// yes it's dirty , and yes I can use sequalize , ze ma yesh
const register = async (req, res, next) => {
  const { email, password, phone, gender } = req.body;
  const find_name = await DB.query(
    "find name",
    "SELECT * FROM streaming_db.users where email = ?",
    [email]
  );
  if (find_name.error) {
    res.status(400).json({ message: "Error occured when checking for email" });
  } else if (find_name.results.length !== 0) {
    res.status(409).json({ message: "Email already exists" });
  } else {
    const find_phone = await DB.query(
      "find name",
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
      const insert_result = await DB.query(
        "register user",
        "INSERT INTO streaming_db.users (email, password, gender, phone_number) VALUES (?, ?, ?, ?)",
        [email, password, gender, phone]
      );
      if (!insert_result.error) {
        res.status(201).json({ message: "Added successfully" });
      } else {
        res.status(400).json({ message: "Error occured when adding user" });
      }
    }
  }
};

exports.register = register;
