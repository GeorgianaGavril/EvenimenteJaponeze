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
      descriere: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [2, 8000],
            msg: "Descrierea este prea lunga!",
          },
        },
      },
      pretStandard: {
        type: DataTypes.FLOAT(5, 2),
        allowNull: true,
      },
      pretLoja: {
        type: DataTypes.FLOAT(5, 2),
        allowNull: true,
      },
      pretVIP: {
        type: DataTypes.FLOAT(5, 2),
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
