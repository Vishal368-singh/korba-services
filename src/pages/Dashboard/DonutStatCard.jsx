import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FaEllipsisH, FaCaretUp, FaCaretDown } from "react-icons/fa";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const seg = payload[0].payload;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs min-w-[130px]">
        <p className="font-semibold text-gray-800 text-center">{seg.label}</p>
        <div className="border-t border-gray-200 mt-2 pt-2">
          <p className="text-gray-500 text-center">
            <span className="font-bold">Count-{seg.value}</span> ({seg.percent}
            %)
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const renderValueLabel = ({
  value,
  payload,
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
}) => {
  const RADIAN = Math.PI / 180;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight="600"
    >
      {payload.percent}%
    </text>
  );
};

export default function DonutStatCard({ title, fetchFn }) {
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

  const isUp = data.changeDirection === "up";

  return (
    <div className="bg-white  rounded-2xl border border-gray-200 shadow-sm pb-5 ">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
          {title}
        </h3>

       
      </div>

      <div className="flex items-center w-full justify-between gap-2.5 ">
        <div className=" h-38 shrink-0 relative w-1/2">
          <ResponsiveContainer width="100%" height="100%" className="mt-1">
            <PieChart>
              <Pie
                data={data.segments}
                dataKey="value"
                innerRadius="35%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
                label={renderValueLabel}
                labelLine={false}
              >
                {data.segments.map((seg, idx) => (
                  <Cell key={idx} fill={seg.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-1/2 flex-col gap-2 mt-3">
          {data.segments.map((seg) => (
            <div key={seg.label} className=" flex  gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />

              <span className="text-gray-600 truncate">{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
