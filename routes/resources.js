const express = require("express");
const router = express.Router();
const debug = require("debug")("app:debugger");
const { Resource, validate } = require("../models/resource");
const { User } = require("../models/user");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", async (req, res) => {
  // get the resources from mongodb sorted by descending date
  const resources = await Resource.find().sort("-date");
  // return list of resources as response
  res.send(resources);
});

router.get("/:id", async (req, res) => {
  // check whether the resource exists
  const resource = await Resource.findById(req.params.id).populate("userId");
  // return 404 if the resource doesn't exist'
  if (!resource) return res.status(404).send("Resource not found");
  // return resource
  res.send(resource);
});

router.post("/", async (req, res) => {
  // validate tthe request body for new resource

  const { error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);
  // otherwise create a new resource and return the response

  // check if the user is valid
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("invalid user");

  const resource = new Resource({
    name: req.body.name,
    userId: req.body.userId,
  });

  // add the resource to the database
  await resource.save();
  // return the added resource as a response
  res.send(resource);
});

router.put("/:id", async (req, res) => {
  // validate tthe request body for new resource
  const { error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);

  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true },
  );

  if (!resource) return res.status(404).send("Resource not found");
  // return the new modified resource
  res.send(resource);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  // remove the resource
  const resource = await Resource.findByIdAndRemove(req.params.id);
  if (!resource) return res.status(404).send("Resource not found");

  // return the resource response
  res.send(resource);
});

module.exports = router;
