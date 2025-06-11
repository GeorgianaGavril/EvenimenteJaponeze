require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes");
const stripeWebhook = require("./routes/stripe").__webhook;
const port = process.env.PORT || 3004;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://site-produs.com"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
