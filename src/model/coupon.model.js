const { DataTypes ,sequelize} = require("sequelize")

const coupoun = sequelize.define("coupoun", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = coupoun;
