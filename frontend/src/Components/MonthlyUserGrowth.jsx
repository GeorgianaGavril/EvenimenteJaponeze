import { useEffect, useState } from "react";
import axios from "axios";
import CardWrapper from "./CardWrapper";

function MonthlyUserGrowthCard() {
  const [data, setData] = useState({ currentCount: 0, procent: null });

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/user/monthly/sign-up")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error(
          "Eroare la extragerea statisticii lunare utilizatori:",
          err
        )
      );
  }, []);

  const { currentCount, procent } = data;

  const procentText =
    procent === null ? (
      <span style={{ color: "#999" }}>Fără date anterioare</span>
    ) : (
      <span style={{ color: "#999" }}>
        Cu{" "}
        <span
          style={{
            color: procent > 0 ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {Math.abs(procent)}%
        </span>{" "}
        {procent > 0 ? "mai mult" : "mai puțin"} față de luna trecută
      </span>
    );

  return (
    <CardWrapper>
      <div style={{ textAlign: "center" }}>
        <h5
          style={{
            fontSize: "17px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#4f0a01",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Utilizatori noi luna aceasta
        </h5>

        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#763932",
            lineHeight: "1.2",
          }}
        >
          {currentCount}
        </div>

        <div
          style={{
            fontSize: "14px",
            marginTop: "10px",
            fontWeight: 400,
          }}
        >
          {procentText}
        </div>
      </div>
    </CardWrapper>
  );
}

export default MonthlyUserGrowthCard;
