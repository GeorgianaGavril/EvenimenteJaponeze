const BiletModel = (sequelize, DataTypes) => {
  const Bilet = sequelize.define(
    "Bilet",
    {
      reservationId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Bilet;
};

module.exports = BiletModel;
