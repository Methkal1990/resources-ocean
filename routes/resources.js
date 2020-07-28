const express = require("express");
const router = express.Router();
const debug = require("debug")("app:debugger");
const { Resource, validate } = require("../models/resource");

router.get("/", async (req, res) => {
  // get the resources from mongodb
  const resources = await Resource.find();
  // return list of resources as response
  res.send(resources);
});

router.get("/:id", async (req, res) => {
  // check whether the resource exists
  const resource = await Resource.findById(req.params.id);
  // return 404 if the resource doesn't exist'
  if (!resource) return res.status(404).send("Resource not found");
  // return resource
  res.send(resource);
});

router.post("/", async (req, res) => {
  // validate tthe request body for new resource
  const { value, error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);
  // otherwise create a new resource and return the response

  let resource = new Resource({
    name: value.name,
  });

  // add the resource to the database
  resource = await resource.save();
  // return the added resource as a response
  res.send(resource);
});

router.put("/:id", async (req, res) => {
  // validate tthe request body for new resource
  const { value, error } = validate(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);

  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      name: value.name,
    },
    { new: true },
  );

  if (!resource) return res.status(404).send("Resource not found");
  // return the new modified resource
  res.send(resource);
});

router.delete("/:id", async (req, res) => {
  // remove the resource
  const resource = await Resource.findByIdAndRemove(req.params.id);
  if (!resource) return res.status(404).send("Resource not found");

  // return the resource response
  res.send(resource);
});

module.exports = router;
