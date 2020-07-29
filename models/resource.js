const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
// create the resource mongodb schema
const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
      lowercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { versionKey: false },
);

// create the resource model
const Resource = mongoose.model("Resource", resourceSchema);

// validator function for the body of the user request json
const resourceValidator = (resource) => {
  console.log(resource);
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    userId: Joi.objectId().required(),
  });

  return schema.validate(resource);
};

exports.Resource = Resource;
exports.validate = resourceValidator;
