const DBConfiguration = require("./DBConfiguration.js");

class DBManager {
  constructor(filePath) {
    this.DBConfiguration = new DBConfiguration(filePath);
    this.DBConfiguration.init_mysql_pool();
    this.DBPool = this.DBConfiguration.mysql_pool;
  }
}

module.exports = DBManager;
