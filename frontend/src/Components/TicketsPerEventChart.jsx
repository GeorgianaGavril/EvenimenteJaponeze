import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
import CardWrapper from "./CardWrapper";

function TicketsPerEventChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/bilet/per/eveniment")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Eroare la preluarea biletelor per eveniment:", err)
      );
  }, []);

  return (
    <CardWrapper title="Bilete vândute per eveniment">
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false}>
              <Label
                value="Număr bilete"
                offset={-5}
                position="insideBottom"
                style={{ fill: "#666", fontSize: 12 }}
              />
            </XAxis>
            <YAxis
              type="category"
              dataKey="titlu"
              width={160}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value.length > 35 ? value.slice(0, 33) + "…" : value
              }
            >
              <Label
                value="Eveniment"
                angle={-90}
                position="insideLeft"
                style={{ fill: "#666", fontSize: 12 }}
              />
            </YAxis>
            <Tooltip />
            <Bar dataKey="bileteVandute" fill="#763932" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
}

export default TicketsPerEventChart;
