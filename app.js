const bodyParser = require("body-parser");
const cors = require("cors");
const ServerManager = require("./utils/Managers/ServerManager.js");
const usersRoutes = require("./routes/users-Routes");
const logger = require("./utils/Logger");

// giving access to DB instance, a singleton can be used as well

// parse incoming requests with JSON body
ServerManager.app.use(bodyParser.json());
ServerManager.app.use(cors());
ServerManager.app.use("/api/users", usersRoutes);

//default error
ServerManager.app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  logger.error({ message, data });
  res.status(status).json({ message: "", data: "server error" });
});
// start app
ServerManager.Start();
