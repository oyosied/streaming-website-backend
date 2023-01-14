const express = require("express");
const app = express();

class ServerManager {
  constructor() {
    this.app = app;
  }
  Start() {
    try {
      this.app.listen(3000, () => {
        console.log("Server started on port 3000");
      });
    } catch (error) {
      console.log("Could not start server on port 3000");
    }
  }
}

module.exports = ServerManager;
