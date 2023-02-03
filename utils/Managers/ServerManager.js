const express = require("express");
const app = express();
const fs = require("fs");

class ServerManager {
  constructor(filePath) {
    try {
      this.jwt_secret = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      ).jwt_secret;
      this.app = app;
    } catch (Error) {
      console.log(Error);
    }
  }
  async Start() {
    const listen = async () => {
      try {
        await this.app.listen(3005);
        console.log("Server started on port 3005");
      } catch (error) {
        console.log("Could not start server on port 3005");
      }
    };
    await listen();
  }
}
const SrvMgr = new ServerManager("./configuration.json");
module.exports = SrvMgr;
