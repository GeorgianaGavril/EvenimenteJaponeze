const SalaModel = (sequelize, DataTypes) => {
  const Sala = sequelize.define(
    "Sala",
    {
      capacitate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Sala;
};

module.exports = SalaModel;
