const bodyParser = require("body-parser");
const cors = require("cors");
const ServerManager = require("./utils/Managers/ServerManager.js");
const usersRoutes = require("./routes/users-Routes");
const contentRoutes = require("./routes/content-Routes");
const logger = require("./utils/Logger");

// parse incoming requests with JSON body
ServerManager.app.use(bodyParser.json());
ServerManager.app.use(cors());
ServerManager.app.use("/api/users", usersRoutes);
ServerManager.app.use("/api/content", contentRoutes);
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
