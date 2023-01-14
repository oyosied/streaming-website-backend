const DB = require("../utils/DB.js");

const register = (req, res, next) => {
  console.log(req.body);
  insert_query = `INSERT INTO \`streaming_db\`.\`users\` (\`name\`, \`email\`, \`password\`) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}')`;
  DB.query(req.body.name, insert_query);

  res.status(201).json({ message: "Added successfully" });
};

exports.register = register;
