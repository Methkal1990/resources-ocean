const express = require("express");
const router = express.Router();
const debug = require("debug")("app:debugger");
const { User, validate } = require("../models/user");

router.get("/", async (req, res) => {
  // get the users from mongodb
  const users = await User.find();
  // return list of users as response
  res.send(users);
});

router.get("/:id", async (req, res) => {
  // check whether the user exists
  const user = await User.findById(req.params.id);
  // return 404 if the user doesn't exist'
  if (!user) return res.status(404).send("user not found");
  // return user
  res.send(user);
});

router.post("/", async (req, res) => {
  // validate tthe request body for new user
  const { error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);
  // otherwise create a new user and return the response

  let user = new User({
    name: req.body.name,
  });

  // add the user to the database
  user = await user.save();
  // return the added user as a response
  res.send(user);
});


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
