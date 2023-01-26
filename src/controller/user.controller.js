const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const send = require("../util/verify.mail");
const { v4: uuidv4 } = require("uuid");

//both for sign-in-google, sign-up-google
const signInGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = jwt.decode(token);
    const { name, email, email_verified } = payload;
    const search = await User.findOne({ email: email, name: name });
    if (!search) {
      const createUser = await User.create({
        name: name,
        email: email,
        isVerified: email_verified,
        type: "client",
      });
      return res.status(200).json({
        success: true,
        message: "new user created",
        data: createUser,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User detail fetched ",
      data: search,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e });
  }
};

//normal signup using name, email, password
const signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      throw { message: "Passwords do not match" };
    }
    const userData = await User.findOne({ email: email, type: "client" });
    if (userData) {
      throw { message: "The user is already present" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      type: "client",
      isVerified: false,
    });
    const code = uuidv4();
    await User.findOneAndUpdate({ email: createUser.email }, { code: code });
    const text = `${process.env.BASE_URL}/user/verifyEmail?uid=${createUser._id}&email=${createUser.email}&code=${code}`;
    const mail = send(createUser, text);
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: createUser,
    });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
};

//verify-user
const verifyUser = async (req, res) => {
  try {
    const { url } = req.body;
    const urlParams = new URLSearchParams(url);
    const getEmail = urlParams.get("email");
    const getCode = urlParams.get("code");
    const findUser = await User.findOne({
      email: getEmail,
      code: getCode,
      type: "client",
    });
    if (!findUser) {
      throw { message: "User not registered" };
    }
    const updateUser = await User.findOneAndUpdate(
      { email: getEmail },
      { code: null, isVerified: true },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: updateUser,
    });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
};

//normal sign in
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email, type: "client" });
    if (!userData) {
      throw { message: "Please register first" };
    }
    if (userData.isVerified == false) {
      throw { message: "Your email is not verified" };
    }
    if (!(await bcrypt.compare(password, userData.password))) {
      throw { message: "Wrong password, try again" };
    }
    const token = jwt.sign(
      { _id: userData._id, type: "client" },
      process.env.JWT
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      data: userData,
    });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
};

//reset the password through link sent to mail (both for forgot password and
// set password if user has sign in google )
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const emailExists = await User.findOne({ email: email, type: "client" });

    if (!emailExists) {
      throw { message: "Email is not registered" };
    }
    const code = uuidv4();
    await User.findOneAndUpdate({ email: emailExists.email }, { code: code });
    const text = `${process.env.BASE_URL}/user/verify?uid=${emailExists._id}&code=${code}`;
    const mail = send(emailExists, text);
    return res.status(200).json({
      success: true,
      message: "Link sent successfully",
      data: emailExists,
    });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
};

//saving the resetted password
const saveResetPassword = async (req, res) => {
  try {
    const { url, email, password } = req.body;
    const urlParams = new URLSearchParams(url);
    const getCode = urlParams.get("code");
    const findUser = await User.findOne({
      email: email,
      code: getCode,
      type: "client",
    });
    if (!findUser) {
      throw { message: "User not registered" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateUser = await User.findOneAndUpdate(
      { email: email },
      { code: null, password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: updateUser,
    });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
};

module.exports = {
  signInGoogle,
  signUp,
  signIn,
  verifyUser,
  resetPassword,
  saveResetPassword,
};
