const BiletModel = (sequelize, DataTypes) => {
  const Bilet = sequelize.define(
    "Bilet",
    {},
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Bilet;
};

module.exports = BiletModel;
