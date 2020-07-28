const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
// create the resource mongodb schema
const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
});

// create the resource model
const Resource = mongoose.model("Resource", resourceSchema);

// validator function for the body of the user request json
const resourceValidator = (resource) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(resource);
};

exports.Resource = Resource;
exports.validate = resourceValidator;
