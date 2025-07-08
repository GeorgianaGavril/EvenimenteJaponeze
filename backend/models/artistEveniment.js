const ArtistEvenimentModel = (sequelize, DataTypes) => {
  const ArtistEveniment = sequelize.define(
    "ArtistEveniment",
    {
      artistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      evenimentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return ArtistEveniment;
};

module.exports = ArtistEvenimentModel;
