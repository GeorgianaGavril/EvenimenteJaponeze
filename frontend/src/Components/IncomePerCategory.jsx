import { useEffect, useState } from "react";
import axios from "axios";
import CardWrapper from "./CardWrapper";

function IncomePerCategoryCard() {
  const [data, setData] = useState({ Standard: 0, VIP: 0, Loja: 0 });

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/bilet/income/category")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Eroare la extragerea încasărilor pe categorii:", err)
      );
  }, []);

  const format = (value) =>
    `${parseFloat(value).toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} lei`;

  return (
    <CardWrapper>
      <div style={{ textAlign: "center" }}>
        <h5
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#4f0a01",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Încasări pe categorie
        </h5>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: "15px",
            color: "rgb(118, 57, 50)",
          }}
        >
          <div>
            <strong>Standard:</strong> {format(data.Standard)}
          </div>
          <div>
            <strong>VIP:</strong> {format(data.VIP)}
          </div>
          <div>
            <strong>Loja:</strong> {format(data.Loja)}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

export default IncomePerCategoryCard;
