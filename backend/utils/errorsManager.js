const functieEroare = (err, msg, res) => {
  console.error(err);
  const errMessage = err.errors?.map((e) => e.message) || [msg];
  res.status(500).send({ message: errMessage });
};

module.exports = { functieEroare };
