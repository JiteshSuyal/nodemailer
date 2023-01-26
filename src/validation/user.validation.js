const Joi = require("joi");

const googleSignIn = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const signup = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().min(6),
  }),
};

const signIn = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const verifyUser = {
  body: Joi.object().keys({
    url: Joi.string().required().uri(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const saveResetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    url: Joi.string().required().uri(),
    password: Joi.string().required().min(6),
  }),
};
module.exports = {
  googleSignIn,
  signup,
  signIn,
  verifyUser,
  resetPassword,
  saveResetPassword,
};
