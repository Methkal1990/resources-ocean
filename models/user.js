const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
// create the user mongodb schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
      lowercase: true,
    },
  },
  { versionKey: false },
);

// create the user model
const User = mongoose.model("User", userSchema);

// validator function for the body of the user request json
const userValidator = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(user);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validate = userValidator;
