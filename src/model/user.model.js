const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
    },
    isVerified: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["client", "admin"],
    },
    token: [],
    otp: {
      type: Number,
      default: null,
    },
    code: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

module.exports = userModel;
