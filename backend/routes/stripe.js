require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const router = express.Router();

const pret = (bilet, data) => {
  if (bilet.categorie === "VIP") {
    return data.pretVIP;
  } else if (bilet.categorie === "standard") {
    return data.pretStandard;
  } else if (bilet.categorie === "loja") {
    return data.pretLoja;
  } else return 0;
};

router.post("/checkout", async (req, res) => {
  const data = req.body;
  console.log(data);
  const line_items = data.bilete.map((ticket) => {
    return {
      price_data: {
        currency: "ron",
        product_data: {
          name: `1 x Bilet ${ticket.categorie
            .slice(0, 1)
            .toUpperCase()}${ticket.categorie.slice(1)} - ${
            ticket.rand[0] === "R"
              ? `Randul ${ticket.rand.slice(1)}`
              : `Loja ${ticket.rand.slice(4)}`
          }, Locul ${ticket.scaun}`,
        },
        unit_amount: pret(ticket, data) * 100,
      },
      quantity: 1,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/complete",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ url: session.url });
  console.log(session);
});

module.exports = router;
