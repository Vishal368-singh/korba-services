import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;

const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
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
      {`${Math.round(percent)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const seg = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 min-w-[130px] text-xs">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: seg.color }}
          />
          <p className="text-xs font-semibold text-gray-800">{seg.label}</p>
        </div>
        <p className="text-gray-500 flex items-center justify-center">
          <span className="font-bold">Count: {seg.value}</span> ({Math.round(seg.percent)}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function PropertyDonutCard({ title, total, segments }) {
  // Filter out segments with value 0
  const filteredSegments = segments.filter(seg => seg.value > 0);
  
  // Sort by value descending (highest first)
  const sortedSegments = [...filteredSegments].sort((a, b) => b.value - a.value);
  
  // Calculate total if not provided
  const calculatedTotal = total || sortedSegments.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow">
      <h3
        className="text-sm font-bold mb-4 text-left ml-2 mt-0.5"
        style={{ color: "#7a1453" }}
      >
        {title}
      </h3>

      <div className="flex items-center justify-center gap-4">
        {/* Donut Chart */}
        <div className="w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedSegments}
                dataKey="value"
                innerRadius="35%"
                outerRadius="100%"
                label={renderLabel}
                labelLine={false}
                paddingAngle={2}
              >
                {sortedSegments.map((seg, idx) => (
                  <Cell key={idx} fill={seg.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    
    </div>
  );
}