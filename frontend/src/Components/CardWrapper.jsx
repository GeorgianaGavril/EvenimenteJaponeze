import { Card } from "react-bootstrap";

function CardWrapper({ title, children }) {
  return (
    <Card
      style={{
        backgroundColor: "#fdf8f3",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        border: "none",
        height: "100%",
      }}
    >
      <Card.Body>
        {title && (
          <h5
            style={{
              color: "#763932",
              fontWeight: 600,
              marginBottom: "20px",
              fontFamily: "Domine, serif",
              textAlign: "center",
            }}
          >
            {title}
          </h5>
        )}

        {children}
      </Card.Body>
    </Card>
  );
}

export default CardWrapper;
