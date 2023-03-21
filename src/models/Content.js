const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Content = db.define("content", {
  // content_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   unique: true
  // },
  // title: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // category: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  // date_time: {
  //   type: DataTypes.ARRAY(DataTypes.STRING),
  //   allowNull: true,
  // },
  // sub_title: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

module.exports = Content;
