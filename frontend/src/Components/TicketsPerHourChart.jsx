import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
import CardWrapper from "./CardWrapper";

function TicketsPerHourChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/bilet/hourly/sell")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Eroare la extragerea datelor pe ore:", err)
      );
  }, []);

  return (
    <CardWrapper title="Bilete vândute pe ore">
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ora"
              interval={2}
              angle={-20}
              textAnchor="end"
              tick={{ fontSize: 11 }}
            >
              <Label value="Ora" position="insideBottom" offset={-10} />
            </XAxis>

            <YAxis allowDecimals={false}>
              <Label
                value="Bilete vândute"
                angle={-90}
                position="center"
                style={{ textAnchor: "middle", fontSize: 15 }}
              />
            </YAxis>

            <Tooltip
              formatter={(value) => [`${value} bilete`, "Total"]}
              contentStyle={{
                backgroundColor: "#fdf8f3",
                borderColor: "#763932",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#763932"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
}

export default TicketsPerHourChart;
