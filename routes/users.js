const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const debug = require("debug")("app:debugger");
const { User, validate } = require("../models/user");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  // get the users from mongodb
  const users = await User.find();
  // return list of users as response
  res.send(users);
});

// get current user
router.get("/me", auth, async (req, res) => {
  const user = await await User.findById(req.user._id).select("-password");

  res.send(user);
});

router.get("/:id", async (req, res) => {
  // check whether the user exists
  const user = await User.findById(req.params.id);
  // return 404 if the user doesn't exist'
  if (!user) return res.status(404).send("user not found");
  // return user
  res.send(user);
});

// register a new user
router.post("/", async (req, res) => {
  // validate tthe request body for new user
  const { error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user with the same email already exists
  let user = await User.findOne({ email: req.body.email });
  // if user exists return 400 bad request
  if (user) return res.status(400).send("user already registered");

  // create the user object
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  // create a salt to use for bcrypt password hashing in the next step
  const salt = await bcrypt.genSalt(10);
  // hashing the password
  user.password = await bcrypt.hash(user.password, salt);

  // save the user
  await user.save();

  // generate the token for the subsequent requests
  const token = user.generateAuthToken();

  // send the token and  the user data to the client
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

//

router.put("/:id", async (req, res) => {
  // validate tthe request body for new user
  const { error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true },
  );

  if (!user) return res.status(404).send("user not found");

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  // remove the user
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("user not found");

  // return the user response
  res.send(user);
});

module.exports = router;
