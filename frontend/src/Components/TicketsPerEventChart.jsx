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
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="titlu" width={100} />
            <Tooltip />
            <Bar dataKey="bileteVandute" fill="#763932" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
}

export default TicketsPerEventChart;
