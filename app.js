const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const Configuration = require("./Configuration");
const config = new Configuration("./config.json");

app.use(bodyParser.json());
app.use(cors());

// parse incoming requests with JSON body
app.use(express.json());

// create a connection to the MySQL database
if (config.load()) {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
  console.log("Successful connection to MySQL");
} else {
  console.log("Error connecting to MySQL");
}
