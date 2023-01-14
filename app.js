const bodyParser = require("body-parser");
const cors = require("cors");
const DBManager = require("./utils/DBManager.js");
const DB = new DBManager("./configuration.json"); // Create connection pool to DB
const ServerManager = require("./utils/ServerManager.js");
const SrvMgr = new ServerManager();

// parse incoming requests with JSON body
SrvMgr.app.use(bodyParser.json());
SrvMgr.app.use(cors());

// start app
SrvMgr.Start();

DB.DBPool.query("SELECT * FROM users", (error, results) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
});
