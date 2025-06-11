const EvenimentDb = require("../models").Eveniment;

const findEventById = async (id) => {
  const eveniment = await EvenimentDb.findByPk(id);
  if (!eveniment) return null;

  const sala = eveniment.salaId ? `Sala ${eveniment.salaId}` : "Necunoscut";

  return {
    titlu: eveniment.titlu,
    data: eveniment.data,
    salaId: sala,
    pretStandard: eveniment.pretStandard,
    pretLoja: eveniment.pretLoja,
    pretVIP: eveniment.pretVIP,
  };
};

module.exports = { findEventById };
