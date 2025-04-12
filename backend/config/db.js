const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("events-app", "root", "3004", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    authPlugins: {
      mysql_native_password: () =>
        require("mysql2/lib/auth_plugins").mysql_native_password,
    },
  },
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
});

module.exports = sequelize;
