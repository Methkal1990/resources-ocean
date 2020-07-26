const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();

// test data
const resources = [
  { id: 1, name: "amazon" },
  { id: 2, name: "twitter" },
  { id: 3, name: "facebook" },
  { id: 4, name: "google" },
];

router.get("/", (req, res) => {
  // return list of resources as response
  res.send(resources);
});

router.get("/:id", (req, res) => {
  // check whether the resource exists
  const resource = resources.find(
    (resource) => resource.id === parseInt(req.params.id),
  );
  // return 404 if the resource doesn't exist'
  if (!resource) return res.status(404).send("Resource not found");
  // return resource
  res.send(resource);
});

router.post("/", (req, res) => {
  // validate tthe request body for new resource
  const { value, error } = resourceValidator(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);
  // otherwise create a new resource and return the response
  const resource = {
    id: resources.length + 1,
    name: value.name,
  };

  // add the resource to the database
  resources.push(resource);

  // return the added resource as a response
  res.send(resource);
});

router.put("/:id", (req, res) => {
  // validate tthe request body for new resource
  const { value, error } = resourceValidator(req.body);
  // if there is an error return 400 bad request
  if (error) return res.status(400).send(error.details[0].message);
  // check whether the resource exists
  const resource = resources.find(
    (resource) => resource.id === parseInt(req.params.id),
  );
  if (!resource) return res.status(404).send("Resource not found");

  // modify the resource data
  resource.name = value.name;

  // return the new modified resource
  res.send(resource);
});

router.delete("/:id", (req, res) => {
  // check whether the resource exists
  const resource = resources.find(
    (resource) => resource.id === parseInt(req.params.id),
  );
  if (!resource) return res.status(404).send("Resource not found");

  // find the resource in the database
  const index = resources.findIndex(
    (resource) => resource.id === parseInt(req.params.id),
  );

  // remove the resource from the database
  resources.splice(index, 1);

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
