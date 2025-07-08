const ArtistModel = (sequelize, DataTypes) => {
  const Artist = sequelize.define(
    "Artist",
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
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Artist;
};

module.exports = ArtistModel;
