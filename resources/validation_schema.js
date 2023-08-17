const Joi = require("joi");

const userIDSchema = Joi.string()
  .alphanum()
  .lowercase()
  .min(6)
  .max(20)
  .required();

const authSchema = Joi.object({
  userID: userIDSchema,
  name: Joi.string(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  authSchema,
  userIDSchema,
};
