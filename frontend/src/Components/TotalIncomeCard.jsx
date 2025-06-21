import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

function TotalIncomeCard() {
  const [income, setIncome] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/bilet/total/income")
      .then((res) => setIncome(res.data.total))
      .catch((err) => console.error("Eroare la extragerea veniturilor:", err));
  }, []);

  return (
    <Card
      className="text-center"
      style={{
        backgroundColor: "#fdf8f3",
        border: "none",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        color: "#4f0a01",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Card.Body>
        <Card.Title
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          Încasări totale
        </Card.Title>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#763932",
          }}
        >
          {income === null ? (
            <Spinner animation="border" variant="secondary" size="sm" />
          ) : (
            `${income} RON`
          )}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#999",
            marginTop: "10px",
          }}
        >
          Venit total obținut din vânzarea biletelor
        </p>
      </Card.Body>
    </Card>
  );
}

export default TotalIncomeCard;
