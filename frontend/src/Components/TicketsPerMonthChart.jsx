import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import CardWrapper from "./CardWrapper";

const COLORS = ["#763932", "#B9997A", "#E4CEBA", "#dbb8d2"];

function TicketsPerMonthChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/bilet/stat/lunar")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Eroare la extragerea biletelor lunare:", err)
      );
  }, []);

  return (
    <CardWrapper title="Bilete vândute pentru evenimentele din fiecare lună">
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* Bar Chart */}
        <div style={{ flex: 1, minWidth: 200, height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="luna"
                label={{
                  value: "Luna evenimentului",
                  position: "insideBottom",
                  offset: -5,
                  style: { fill: "#999", fontSize: 12 },
                }}
              />
              <YAxis
                allowDecimals={false}
                label={{
                  value: "Bilete vândute",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fill: "#999", fontSize: 12 },
                }}
              />
              <Tooltip />
              <Bar dataKey="total" fill="#763932" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ flex: 1, minWidth: 200, height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="luna"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardWrapper>
  );
}

export default TicketsPerMonthChart;
