import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  fill,
}) => {
  const radius = outerRadius + 14;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};
const renderLabel = ({
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
      fontSize={11}
      fontWeight="600"
    >
      {payload.percent}%
    </text>
  );
};
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const seg = payload[0].payload;
    console.log("**********", seg);
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md  gap-0 px-3 py-2  min-w-[130px] text-xs">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-xs font-semibold text-gray-800">{seg.label}</p>
        </div>
        <p className="text-gray-500 flex items-center justify-center">
          <span className="font-bold">Count-{seg.value}</span> ({seg.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function PropertyDonutCard({ title, total, segments }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm   p-5 cursor-pointer">
      <h3
        className="text-sm font-bold mb-4 mt-2 ml-2"
        style={{ color: "#7a1453" }}
      >
        {title}
      </h3>

      <div className="flex items-center gap-5">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                innerRadius="35%"
                outerRadius="100%"
                label={renderLabel}
                labelLine={false}
              >
                {segments.map((seg, idx) => (
                  <Cell key={idx} fill={seg.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 min-w-0 items-end">
          <ul className="flex flex-col gap-2 mr-4">
            {segments.map((seg) => (
              <li
                key={seg.label}
                className="flex items-center justify-between text-sm gap-3"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-gray-700 truncate">{seg.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
