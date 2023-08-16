const Joi = require("joi");

const authSchema = Joi.object({
  userID: Joi.string().alphanum().lowercase().min(6).max(20).required(),
  name: Joi.string(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  authSchema,
};
