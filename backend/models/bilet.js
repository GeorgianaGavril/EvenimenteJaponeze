const BiletModel = (sequelize, DataTypes) => {
  const Bilet = sequelize.define(
    "Bilet",
    {
      reservationId: {
        type: DataTypes.STRING,
        allowNull: false,
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
  return Bilet;
};

module.exports = BiletModel;
