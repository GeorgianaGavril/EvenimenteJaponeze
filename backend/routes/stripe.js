require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const router = express.Router();
const { findEventById } = require("../controllers/eventService");
const { generateTicketPDF } = require("../utils/generateTicket");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const pret = (bilet, data) => {
  if (bilet.categorie === "VIP") return data.pretVIP;
  if (bilet.categorie === "standard") return data.pretStandard;
  if (bilet.categorie === "loja") return data.pretLoja;
  return 0;
};

// ======== CHECKOUT SESSION ==========
router.post("/checkout", async (req, res) => {
  const data = req.body;

  const line_items = data.bilete.map((ticket) => ({
    price_data: {
      currency: "ron",
      product_data: {
        name: `1 x Bilet ${
          ticket.categorie.charAt(0).toUpperCase() + ticket.categorie.slice(1)
        } - ${
          ticket.rand[0] === "R"
            ? `Rândul ${ticket.rand.slice(1)}`
            : `Loja ${ticket.rand.slice(4)}`
        }, Locul ${ticket.scaun}`,
      },
      unit_amount: pret(ticket, data) * 100,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/cancel",
    customer_email: data.email,
    metadata: {
      bilete: JSON.stringify(data.bilete),
      eventId: data.eventId,
      reservationId: data.reservationId,
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  res.json({ url: session.url, sessionId: session.id });
});

// ======== WEBHOOK PENTRU EMAIL ==========
const webhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const recipientEmail = session.customer_email;
    const bilete = JSON.parse(session.metadata?.bilete || "[]");
    const eventId = session.metadata.eventId;

    // 1) Obținem datele evenimentului
    let eventObj = null;
    try {
      eventObj = await findEventById(eventId);
    } catch (err) {
      console.warn("⚠️ Nu s-a putut prelua evenimentul:", err.message);
    }

    if (!eventObj) {
      console.warn("⚠️ Eveniment inexistent, nu generăm PDF.");
      return res.status(200).json({ received: true });
    }

    // 2) Generăm PDF-ul cu biletele
    const timestamp = new Date(); // data comenzii
    let pdfBuffer;
    try {
      pdfBuffer = await generateTicketPDF(
        bilete,
        recipientEmail,
        eventObj,
        timestamp,
        session.id
      );
    } catch (err) {
      console.error("❌ Eroare generare PDF:", err);
      return res.status(500).json({ error: "PDF generation failed" });
    }

    // 3) Trimitem email cu PDF atașat
    const mailOptions = {
      from: {
        name: "Sakura Stage",
        address: process.env.EMAIL_USER,
      },
      to: recipientEmail,
      subject: `Bilete ${eventObj.titlu} 🎟️`,
      html: `
        <div style="font-family:Arial, sans-serif; color:#333;">
          <p>Salut!</p>
          <p>Mulțumim că ai achiziționat bilete pentru <strong>${eventObj.titlu}</strong>.</p>
          <p>Găsești biletele atașate în acest email.</p>
          <br />
          <p>O zi frumoasă!</p>
          <p><em>– Echipa Sakura Stage</em></p>
        </div>
      `,
      attachments: [
        {
          filename: "bilete.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Eroare trimitere email:", err);
      } else {
        console.log("✅ Email cu bilete trimis către:", recipientEmail);
      }
    });
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object;
    const reservationId = session.id;

    try {
      await BiletDb.destroy({ where: { reservationId } });
      console.log(
        `🗑️ Biletele cu reservationId ${reservationId} au fost șterse`
      );
    } catch (err) {
      console.error("❌ Eroare la ștergerea biletelor:", err.message);
    }

    return res.status(200).json({ received: true });
  }

  res.status(200).json({ received: true });
};

// exportăm handlerul separat pt server.js
module.exports = router;
module.exports.__webhook = webhookHandler;
