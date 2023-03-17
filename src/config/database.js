const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

// create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// define the 'User' model
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    name: "John Doe",
    email: "john@example.com",
  });
  console.log(user.toJSON());
})();
// export the sequelize instance and models
module.exports = {
  sequelize,
  User,
};
