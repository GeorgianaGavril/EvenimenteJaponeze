import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CardWrapper from "./CardWrapper";

function CategoryRateChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/bilet/stats/category")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Eroare la extragere:", err));
  }, []);

  return (
    <CardWrapper title="Rata de ocupare pe categorii">
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="categorie" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Ocupare"
              dataKey="ocupare"
              stroke="#763932"
              fill="#763932"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
}

export default CategoryRateChart;
