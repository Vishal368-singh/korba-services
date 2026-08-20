import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts";
import { FaEllipsisH } from "react-icons/fa";

const PRIMARY = "#7a1453";

export default function BarStatCard({ title, fetchFn, barColor = PRIMARY }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchFn().then(setData);
  }, [fetchFn]);

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full">
      <div className="flex items-center justify-between mt-1 ml-2">
        <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>
          {title}
        </h3>
        <FaEllipsisH className="text-gray-400 text-sm mr-2 cursor-pointer hover:text-black" />
      </div>

      <p className="text-xs text-gray-400 mt-2 ml-2">Properties</p>

      <div className="h-38 mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.data}
            margin={{ top: 5, right: 4, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 7, fill: "#9ca3af" }}
              axisLine={true}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={true}
              tickLine={false}
            >
              <Label
                position="insideLeft"
                style={{ textAnchor: "middle", fontSize: 11, fill: "#6b7280" }}
              />
            </YAxis>
            <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
