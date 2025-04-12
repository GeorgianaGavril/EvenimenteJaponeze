const EvenimentModel = (sequelize, DataTypes) => {
  const Eveniment = sequelize.define(
    "Eveniment",
    {
      titlu: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: "Titlul trebuie sa aiba intre 2 si 50 de caractere!",
          },
        },
      },
      data: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      durata: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      locatie: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [3, 50],
            msg: "Locatia trebuie sa aiba intre 2 si 50 de caractere!",
          },
        },
      },
      descriere: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pretBilet: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Eveniment;
};

module.exports = EvenimentModel;
