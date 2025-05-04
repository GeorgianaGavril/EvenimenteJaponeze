const functieEroare = (err, msg, res) => {
  console.error("Eroare: ", err);
  const errMessage = err.errors?.map((e) => e.message) || [msg];
  res.status(500).send({ message: errMessage });
};

const verificaExistentaEntitate = async (
  model,
  id,
  res,
  entityName = "Entitate"
) => {
  const entitate = await model.findByPk(id);
  if (!entitate) {
    res.status(400).send({ message: `Nu exista ${entityName} cu id ${id}` });

    return null;
  }

  return entitate;
};

module.exports = { functieEroare, verificaExistentaEntitate };
