import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col } from "react-bootstrap";

function TotalUsersCard() {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/user/count/userObisnuit")
      .then((res) => {
        setTotalUsers(res.data.total);
      });
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
          Utilizatori
        </Card.Title>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#763932",
          }}
        >
          {totalUsers}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#999",
            marginTop: "10px",
          }}
        >
          În total, utilizatori înregistrați în platformă
        </p>
      </Card.Body>
    </Card>
  );
}

export default TotalUsersCard;
