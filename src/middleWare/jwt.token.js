const { JWT } = process.env;
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (header === undefined) {
      return res.status(400).json({
        sucess: false,
        message: "Unauthorized Request!",
        data: [],
      });
    } else {
      const token = header.replace("Bearer ", "");
      jwt.verify(token, JWT, async (err, decoded) => {
        if (err) {
          return res.status(400).json({
            sucess: false,
            message: err.message,
            data: [],
          });
        } else {
          const _id = decoded._id;
          const type = decoded.type;
          let checkUser;
          if (!_id) {
            res.status(400).json({
              sucess: false,
              error: "Authentication Failed ",
              data: [],
            });
          }
          if (type == "admin") {
            checkUser = await User.findById(_id);
          } else if (type == "client") {
            checkUser = await User.findById(_id);
          }
          if (!checkUser) {
            return res.status(400).json({
              sucess: false,
              error: "Authentication Failed ",
              data: [],
            });
          }
          req.user = checkUser;
          next();
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Server is not responding",
    });
  }
};
