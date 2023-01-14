const bodyParser = require("body-parser");
const cors = require("cors");
const ServerManager = require("./utils/Managers/ServerManager.js");
const usersRoutes = require("./routes/users-Routes");
const DB = require("./utils/DB.js"); // Create connection pool to DB
const SrvMgr = new ServerManager();

// giving access to DB instance, a singleton can be used as well

// parse incoming requests with JSON body
SrvMgr.app.use(bodyParser.json());
SrvMgr.app.use(cors());
SrvMgr.app.use("/api/users", usersRoutes);
// start app
SrvMgr.Start();
