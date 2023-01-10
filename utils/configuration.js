const mysql = require("mysql");

class Configuration {
  constructor(filePath) {
    this.filePath = filePath;
  }

  load() {
    const configuration = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
    Object.keys(configuration).forEach((key) => {
      this[key] = configuration[key];
    });
    this.connection = mysql.createConnection({
      host: this.DB_Connection_Details.host,
      user: this.DB_Connection_Details.user,
      password: this.DB_Connection_Details.password,
      database: this.DB_Connection_Details.database,
    });
    try {
      this.connection.connect();
      return true;
    } catch (error) {
      console.error("Error connecting to MySQL: ", error);
      return false;
    }
  }
}

module.exports = Configuration;
