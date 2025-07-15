import { useState, useEffect } from "react";
import axios from "axios";
import CardWrapper from "./CardWrapper";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CategoryHeatmapChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/bilet/stats/category")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Eroare la extragere:", err));
  }, []);

  return (
    <CardWrapper title="Rata de ocupare pe categorii">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis type="category" dataKey="categorie" fontSize={12} />
          <Tooltip />
          <Bar dataKey="ocupare" barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#763932" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
}

export default CategoryHeatmapChart;
