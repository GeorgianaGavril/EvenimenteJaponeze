require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes");
const port = process.env.PORT || 3004;

const corsOptions = {
  origin: ["http://localhost:3000", "https://site-produs.com"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
