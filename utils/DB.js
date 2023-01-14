const DBManager = require("./Managers/DBManager.js");
const db = new DBManager("./configuration.json");
module.exports = db;
