const Joi = require("joi");

const authUserIDSchema = Joi.string()
  .alphanum()
  .lowercase()
  .min(6)
  .max(20)
  .required();

const authUserNameSchema = Joi.string();

const authUserPasswordSchema = Joi.string().min(6).required();

const authSchema = Joi.object({
  userID: authUserIDSchema,
  name: authUserNameSchema,
  password: authUserPasswordSchema,
});

module.exports = {
  authSchema,
  authUserIDSchema,
  authUserNameSchema,
  authUserPasswordSchema,
};
