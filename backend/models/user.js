const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      nume: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Numele trebuie sa aiba minim 3 si maxim 20 de litere!",
          },
          is: {
            args: /^[a-zA-ZăîâșțĂÎÂȘȚ\- ]+$/u,
            msg: "Numele poate conține doar litere, spații și cratimă!",
          },
          notEmpty: true,
        },
      },
      prenume: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Prenumele trebuie sa aiba minim 3 si maxim 20 de litere!",
          },
          is: {
            args: /^[a-zA-ZăîâșțĂÎÂȘȚ\- ]+$/u,
            msg: "Numele poate conține doar litere, spații și cratimă!",
          },
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "Email invalid!" },
          notEmpty: true,
        },
      },
      parola: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 70],
            msg: "Parola prea scurta!",
          },
        },
      },
      tip: {
        type: DataTypes.ENUM("userObisnuit", "admin"),
        allowNull: false,
        defaultValue: "userObisnuit",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "createdAt",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updatedAt",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
  return User;
};

module.exports = UserModel;
