// a module to controling login and authentication
const _ = require("lodash");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

// loging a user
router.post("/", async (req, res) => {
  // validate the request body
  const { error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);

  // look for the user
  let user = await User.findOne({ email: req.body.email });
  // if user exists return 400 bad request
  if (!user) return res.status(400).send("invalid email or password");

  // validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  // not valid password
  if (!validPassword) return res.status(400).send("invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
};

module.exports = router;
