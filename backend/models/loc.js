const LocModel = (sequelize, DataTypes) => {
  const Loc = sequelize.define(
    "Loc",
    {
      scaun: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rand: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categorie: {
        type: DataTypes.ENUM("standard", "loja", "balcon", "VIP"),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Loc;
};

module.exports = LocModel;
