const resources = require("./routes/resources");
const users = require("./routes/users");
const auth = require("./routes/auth");
const debug = require("debug")("app:debugger");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const mongoose = require("mongoose");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL: jwtPrivateKey is missing");
  process.exit(1);
}

// connect to mongodb
mongoose
  .connect("mongodb://localhost/resources-ocean", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => debug("Connected to mongodb"))
  .catch((err) => debug(err.message));

// parse the request for json payload --> node doesn't understand json payload if you don't use this middleware
app.use(express.json());
// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());

// example using the configuration files with config module
debug(
  `current NODE_ENV is **${app.get(
    "env",
  )}** and current environment name is --> **${config.get("name")}**`,
);

// if production env then apply these middlewares
if (app.get("env") === "production") {
  app.use(morgan("tiny"));
}
// use the router "resources" for any request that goes to /api/resources
app.use("/api/resources", resources);
// use the router "users" for any request that goes to /api/users
app.use("/api/users", users);
// use the router "auth" for any request that goes to /api/auth
app.use("/api/auth", auth);

// use the port defined in the environment variables otherwise use the 3000 port
const port = process.env.PORT || 3000;

// start the app on the port specified in PORT or use 3000
app.listen(port, () => debug(`Listening on port ${port}`));
