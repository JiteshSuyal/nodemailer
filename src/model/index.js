var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,//ilnbackend
  process.env.DATABASE_USERNAME,//root
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,//url
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

var db = {};

fs.readdirSync(dirname)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js";
  })
  .forEach(function (file) {
    const model = require(path.join(dirname, file))(sequelize, 
Sequelize.DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;