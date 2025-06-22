const BiletDb = require("../models").Bilet;
const LocDb = require("../models").Loc;
const EventDb = require("../models").Eveniment;
const {
  functieEroare,
  verificaExistentaEntitate,
} = require("../utils/errorsManager");
const { connection } = require("../models");
const { fn, col, literal } = require("sequelize");

const controller = {
  getAllBilete: async (req, res) => {
    try {
      const bilete = await BiletDb.findAll();
      res.status(200).json(bilete);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea biletelor!", res);
    }
  },

  createBilet: async (req, res) => {
    try {
      const bilet = await BiletDb.create({
        userId: req.params.userId,
        locId: req.body.locId,
        evenimentId: req.params.evenimentId,
        reservationId: req.body.reservationId,
      });
      res.status(201).json(bilet);
    } catch (err) {
      functieEroare(err, "Eroare la crearea biletului!", res);
    }
  },

  bulkCreateBilete: async (req, res) => {
    try {
      const { bilete } = req.body;

      if (!Array.isArray(bilete)) {
        return res
          .status(400)
          .send({ message: "Trebuie trimis array de bilete!" });
      }

      await BiletDb.bulkCreate(bilete, {
        // validate: true, // opțional, dar bun pentru siguranță
        // ignoreDuplicates: false, // doar dacă vrei
        // individualHooks: true, // IMPORTANT dacă ai hooks; altfel poate lipsi
      });

      res.status(201).send({ message: "Bilete introduse cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la crearea biletelor!", res);
    }
  },

  getBiletById: async (req, res) => {
    const id = req.params.id;
    try {
      const bilet = await verificaExistentaEntitate(BiletDb, id, res, "bilet");
      if (!bilet) {
        return;
      }

      res.status(200).json(bilet);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea biletului!", res);
    }
  },

  getBileteByEvent: async (req, res) => {
    const evenimentId = req.params.evenimentId;
    try {
      const event = await verificaExistentaEntitate(
        EventDb,
        evenimentId,
        res,
        "eveniment"
      );
      if (!event) {
        return;
      }

      const bilete = await BiletDb.findAll({
        where: { evenimentId: evenimentId },
      });
      res.status(200).json(bilete);
    } catch (err) {
      functieEroare(
        err,
        `Eroare la returnarea biletelor pentru evenimentul ${evenimentId}`,
        res
      );
    }
  },

  deleteBiletById: async (req, res) => {
    const id = req.params.id;
    try {
      const bilet = await verificaExistentaEntitate(BiletDb, id, res, "bilet");
      if (!bilet) {
        return;
      }

      await bilet.destroy();
      res.status(200).send({ message: "Bilet sters cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea biletului!", res);
    }
  },

  getBiletePerEveniment: async (req, res) => {
    try {
      const results = await EventDb.findAll({
        attributes: [
          "id",
          "titlu",
          [
            connection.fn("COUNT", connection.col("Bilets.id")),
            "bileteVandute",
          ],
        ],
        include: [
          {
            model: BiletDb,
            attributes: [],
            required: false,
          },
        ],
        group: ["Eveniment.id"],
        raw: true,
      });

      res.status(200).json(results);
    } catch (err) {
      console.error("Eroare la agregarea completă:", err.message);
      res.status(500).json({
        error: "Eroare la returnarea biletelor per eveniment (all included)",
      });
    }
  },

  getBiletePerLuna: async (req, res) => {
    try {
      const results = await EventDb.findAll({
        attributes: [
          [literal(`DATE_FORMAT(data, '%Y-%m')`), "luna"],
          [fn("COUNT", col("Bilets.id")), "numarBilete"],
        ],
        include: [
          {
            model: BiletDb,
            attributes: [],
            required: false, // aici e cheia: include și evenimente fără bilete
          },
        ],
        group: [literal(`DATE_FORMAT(data, '%Y-%m')`)],
        order: [[literal("luna"), "ASC"]],
      });

      const totalBilete = results.reduce(
        (acc, cur) => acc + parseInt(cur.get("numarBilete")),
        0
      );

      const rezultat = results.map((item) => {
        const [year, month] = item.get("luna").split("-");
        const numeLuna = [
          "Ianuarie",
          "Februarie",
          "Martie",
          "Aprilie",
          "Mai",
          "Iunie",
          "Iulie",
          "August",
          "Septembrie",
          "Octombrie",
          "Noiembrie",
          "Decembrie",
        ][parseInt(month) - 1];

        const bilete = parseInt(item.get("numarBilete"));

        return {
          luna: `${numeLuna} ${year}`,
          total: bilete,
          procent: totalBilete
            ? ((bilete / totalBilete) * 100).toFixed(1)
            : "0.0",
        };
      });

      res.status(200).json(rezultat);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Eroare la extragerea datelor pe lună" });
    }
  },

  getRataOcuparePeCategorie: async (req, res) => {
    try {
      const toateLocurile = await LocDb.findAll();
      const toateBiletele = await BiletDb.findAll({
        include: { model: LocDb, attributes: ["categorie"] },
      });

      const categorii = {};

      toateLocurile.forEach((loc) => {
        if (!categorii[loc.categorie]) {
          categorii[loc.categorie] = { total: 0, vandute: 0 };
        }
        categorii[loc.categorie].total += 1;
      });

      toateBiletele.forEach((bilet) => {
        const cat = bilet.Loc.categorie;
        if (categorii[cat]) {
          categorii[cat].vandute += 1;
        }
      });

      const ordinea = ["Standard", "VIP", "Loja"];

      const rezultat = Object.entries(categorii)
        .map(([categorie, info]) => ({
          categorie: categorie.charAt(0).toUpperCase() + categorie.slice(1),
          ocupare: +((info.vandute / info.total) * 100).toFixed(1),
        }))
        .sort(
          (a, b) => ordinea.indexOf(a.categorie) - ordinea.indexOf(b.categorie)
        );

      res.status(200).json(rezultat);
    } catch (err) {
      res.status(500).json({ error: "Eroare la calculul ratei de ocupare" });
    }
  },

  getTotalIncome: async (req, res) => {
    try {
      const bilete = await BiletDb.findAll({
        include: [{ model: EventDb }, { model: LocDb }],
      });

      if (!bilete.length) {
        return res.status(404).json({ message: "Nu s-au găsit bilete" });
      }

      const total = bilete.reduce((sum, bilet) => {
        if (!bilet.Loc || !bilet.Eveniment) {
          console.warn("Bilet fără loc sau eveniment:", bilet.id);
          return sum;
        }

        const categorie = bilet.Loc.categorie;
        const pret =
          categorie === "VIP"
            ? bilet.Eveniment.pretVIP
            : categorie === "loja"
            ? bilet.Eveniment.pretLoja
            : bilet.Eveniment.pretStandard;
        return sum + pret;
      }, 0);

      res.status(200).json({ total: Number(total.toFixed(2)) });
    } catch (err) {
      console.error("Eroare:", err);
      res.status(500).json({ error: "Eroare la calculul veniturilor totale" });
    }
  },

  getIncomePerCategory: async (req, res) => {
    try {
      const bilete = await BiletDb.findAll({
        include: [{ model: EventDb }, { model: LocDb }],
      });

      const totaluri = {
        Standard: 0,
        VIP: 0,
        Loja: 0,
      };

      bilete.forEach((bilet) => {
        const categorie = bilet.Loc?.categorie;
        const eveniment = bilet.Eveniment;

        if (!categorie || !eveniment) return;

        let pret = 0;
        if (categorie === "VIP") pret = eveniment.pretVIP;
        else if (categorie === "loja") pret = eveniment.pretLoja;
        else pret = eveniment.pretStandard;

        if (categorie === "VIP") totaluri.VIP += pret;
        else if (categorie === "loja") totaluri.Loja += pret;
        else totaluri.Standard += pret;
      });

      res.status(200).json({
        Standard: totaluri.Standard.toFixed(2),
        VIP: totaluri.VIP.toFixed(2),
        Loja: totaluri.Loja.toFixed(2),
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Eroare la calculul încasărilor pe categorii" });
    }
  },

  getBiletePerOra: async (req, res) => {
    try {
      const bilete = await BiletDb.findAll();

      const countPerHour = Array(24).fill(0);

      bilete.forEach((b) => {
        const hour = new Date(b.createdAt).getHours();
        countPerHour[hour]++;
      });

      const result = countPerHour.map((count, index) => ({
        ora: `${index.toString().padStart(2, "0")}:00`,
        total: count,
      }));

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: "Eroare la calculul biletelor per oră" });
    }
  },
};

module.exports = controller;
