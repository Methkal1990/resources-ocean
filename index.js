const resources = require("./routes/resources");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const app = express();

// parse the request for json payload --> node doesn't understand json payload if you don't use this middleware
app.use(express.json());
// Helmet helps you secure your Express apps by setting various HTTP headers. 
app.use(helmet());

// example using the configuration files with config module
console.log(`current NODE_ENV is **${app.get("env")}** and current environment name is --> **${config.get("name")}**`);

// if production env then apply these middlewares
if (app.get("env") === "production") {
  app.use(morgan("tiny"));
}
// use the router "resources" for any request that goes to /api/resources
app.use("/api/resources", resources);

// use the port defined in the environment variables otherwise use the 3000 port
const port = process.env.PORT || 3000;

// start the app on the port specified in PORT or use 3000
app.listen(port, () => console.log(`Listening on port ${port}`));
