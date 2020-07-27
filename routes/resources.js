const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const debug = require("debug")("app:debugger");

// test data
// const resources = [
//   { id: 1, name: "amazon" },
//   { id: 2, name: "twitter" },
//   { id: 3, name: "facebook" },
//   { id: 4, name: "google" },
// ];

// connect to mongodb
mongoose
  .connect("mongodb://localhost/resources-ocean", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => debug("Connected to mongodb"));

// create the resource mongodb schema
const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// create the resource model
const Resource = mongoose.model("Resource", resourceSchema);

router.get("/", async (req, res) => {
  // get the resources from mongodb
  const resources = await Resource.find();
  // return list of resources as response
  res.send(resources);
});

router.get("/:id", async (req, res) => {
  // check whether the resource exists
  const resource = await Resource.findById(req.params.id);
  debug(resource);
  // return 404 if the resource doesn't exist'
  if (!resource) return res.status(404).send("Resource not found");
  // return resource
  res.send(resource);
});

router.post("/", async (req, res) => {
  // validate tthe request body for new resource
  const { value, error } = resourceValidator(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);
  // otherwise create a new resource and return the response

  const resource = new Resource({
    name: value.name,
  });

  // add the resource to the database
  await resource.save();
  // return the added resource as a response
  res.send(resource);
});

router.put("/:id", async (req, res) => {
  // validate tthe request body for new resource
  const { value, error } = resourceValidator(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);
  // check whether the resource exists
  let resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).send("Resource not found");

  // modify the resource data
  resource.set({
    name: value.name,
  });

  resource = await resource.save();
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

// validator function for the body of the user request json
const resourceValidator = (resource) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(resource);
};
