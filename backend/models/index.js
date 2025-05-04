const { DataTypes } = require("sequelize");
const db = require("../config/db");

const UserModel = require("./user");
const LocModel = require("./loc");
const BiletModel = require("./bilet");
const EvenimentModel = require("./eveniment");
const SalaModel = require("./sala");
const ArtistModel = require("./artist");

const User = UserModel(db, DataTypes);
const Loc = LocModel(db, DataTypes);
const Bilet = BiletModel(db, DataTypes);
const Eveniment = EvenimentModel(db, DataTypes);
const Sala = SalaModel(db, DataTypes);
const Artist = ArtistModel(db, DataTypes);

Loc.hasOne(Bilet, { foreignKey: "locId", onDelete: "CASCADE" });
Bilet.belongsTo(Loc, { foreignKey: "locId" });

User.hasMany(Bilet, { foreignKey: "userId", onDelete: "CASCADE" });
Bilet.belongsTo(User, { foreignKey: "userId" });

Eveniment.hasMany(Bilet, { foreignKey: "evenimentId", onDelete: "CASCADE" });
Bilet.belongsTo(Eveniment, { foreignKey: "evenimentId" });

Sala.hasMany(Loc, { foreignKey: "salaId", onDelete: "CASCADE" });
Loc.belongsTo(Sala, { foreignKey: "salaId" });

Sala.hasMany(Eveniment, { foreignKey: "salaId", onDelete: "CASCADE" });
Eveniment.belongsTo(Sala, { foreignKey: "salaId" });

Eveniment.hasMany(Artist, { foreignKey: "evenimentId", onDelete: "CASCADE" });
Artist.belongsTo(Eveniment, { foreignKey: "evenimentId" });

module.exports = {
  User,
  Loc,
  Bilet,
  Eveniment,
  Sala,
  Artist,
  connection: db,
};
