const userRoute = require("express").Router();
const userController = require("../controller/user.controller");
const { verifyToken } = require("../middleWare/jwt.token");
const validate = require("../middleWare/validate");
const validation = require("../validation/user.validation");

userRoute.post(
  "/sign-in-google",
  validate(validation.googleSignIn),
  userController.signInGoogle
);

userRoute.post("/signUp", validate(validation.signup), userController.signUp);

userRoute.post("/signIn", validate(validation.signIn), userController.signIn);

userRoute.post(
  "/verifyUser",
  validate(validation.verifyUser),
  userController.verifyUser
);

userRoute.post(
  "/resetPassword",
  validate(validation.resetPassword),
  userController.resetPassword
);

userRoute.post(
  "/saveResetPassword",
  validate(validation.saveResetPassword),
  userController.saveResetPassword
);

module.exports = userRoute;
