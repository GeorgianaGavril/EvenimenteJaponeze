import Navbar from "../Components/Navbar";
import TotalUsersCard from "../Components/TotalUsers";
import TotalIncomeCard from "../Components/TotalIncomeCard";
import IncomePerCategoryCard from "../Components/IncomePerCategory";
import MonthlyUserGrowthCard from "../Components/MonthlyUserGrowth";
import TicketsPerHourChart from "../Components/TicketsPerHourChart";
import TicketsPerEventChart from "../Components/TicketsPerEventChart";
import TicketsPerMonthChart from "../Components/TicketsPerMonthChart";
import CategoryRateChart from "../Components/CategoryRateChart";
import { Container, Row, Col } from "react-bootstrap";

function Statistics() {
  return (
    <div style={{ backgroundColor: "#fffbf1", minHeight: "100vh" }}>
      <Navbar />

      <Container style={{ maxWidth: "1300px", padding: "40px 20px" }}>
        <h2
          className="text-center fw-bold"
          style={{
            color: "#4f0a01",
            fontFamily: "Domine, serif",
            marginBottom: "20px",
          }}
        >
          Panou de administrare
        </h2>
        <div
          className="mb-5"
          style={{
            height: "5px",
            width: "150px",
            backgroundColor: "#4f0a01",
            margin: "0 auto",
            borderRadius: "10px",
          }}
        ></div>

        {/* 🟨 Rând KPI-uri + TicketsPerHourChart */}
        <Row className="gy-4 gx-4 mb-5">
          <Col xs={12} sm={6} md={4} lg={3}>
            <TotalUsersCard />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <MonthlyUserGrowthCard />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <TotalIncomeCard />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <IncomePerCategoryCard />
          </Col>
        </Row>

        {/* 🔵 Rând grafice principale */}
        <Row className="gy-4 gx-4">
          <Col xs={12} sm={6} md={4} lg={3}>
            <CategoryRateChart />
          </Col>
          <Col xs={12} sm={12} md={6} lg={9}>
            <TicketsPerMonthChart />
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <TicketsPerHourChart />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TicketsPerEventChart />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Statistics;
