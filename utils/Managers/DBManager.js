const DBConfiguration = require("../DBConfiguration.js");
const util = require("util");
const logger = require("../Logger.js");

const RequestStatus = Object.freeze({
  REQUESTED: "requested",
  IN_PROGRESS: "in progress",
  COMPLETED: "completed",
  FAILED: "failed",
});

class DBRequest {
  constructor(info, sql_query) {
    this.info = info;
    this.sql_query = sql_query;
    this.status = RequestStatus.REQUESTED;
    this.results = null;
  }

  [util.inspect.custom]() {
    return (
      `info: ${this.info}\n` +
      `sql_query: ${this.sql_query}\n` +
      `query status: ${this.status}\n` +
      `results: ${JSON.stringify(this.results)}`
    );
  }
}

class DBManager {
  constructor(filePath) {
    this.DBConfiguration = new DBConfiguration(filePath);
    this.DBConfiguration.init_mysql_pool();
    this.DBPool = this.DBConfiguration.mysql_pool;
    this.requests = new Map();
    this.requests_inprogress = 0;
  }

  async query(info, sql_query, parameters) {
    const request = new DBRequest(info, sql_query);
    this.requests_inprogress += 1;
    this.requests.set(this.requests_inprogress, request);
    request.status = RequestStatus.IN_PROGRESS;
    try {
      const query = util.promisify(this.DBPool.query).bind(this.DBPool);
      const results = await query({ sql: sql_query, values: parameters });
      request.results = results;
      request.status = RequestStatus.COMPLETED;
      logger.info(request);
      console.log(this.requests);
      return { error: false, results };
    } catch (error) {
      request.status = RequestStatus.FAILED;
      request.results = error;
      logger.error(request);
      console.log(this.requests);
      return { error: true, results: [] };
    }
  }
}

module.exports = DBManager;
