const mysql = require("mysql2");
const fs = require("fs");

class DBConfiguration {
  constructor(filePath) {
    try {
      this.filePath = filePath;
    } catch (error) {
      console.error("Error reading configuration file: ", error);
      return false;
    }
  }

  init_mysql_pool() {
    try {
      const configuration = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
      this.mysql_pool = mysql.createPool({
        host: configuration.DB_Connection_Details.host,
        user: configuration.DB_Connection_Details.user,
        password: configuration.DB_Connection_Details.password,
        database: configuration.DB_Connection_Details.database,
      });
      console.log("Pool to MySQL created successfully");
    } catch (error) {
      console.error("Error connecting to MySQL: ", error);
    }
  }
}

module.exports = DBConfiguration;
