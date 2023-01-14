let instance = null;
class Logger {
  constructor() {
    if (!instance) {
      instance = this;
      this.winston = require("winston");
      this.logger = this.winston.createLogger({
        level: "info",
        format: this.winston.format.json(),
        transports: [
          new this.winston.transports.File({ filename: "logs.log" }),
        ],
      });
    }
    return instance;
  }
}
module.exports = new Logger().logger;
