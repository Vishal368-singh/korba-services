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
          <span className="font-bold">Count: {seg.value}</span> (
          {Math.round(seg.percent)}%)
        </p>
      </div>
    );
  }
  return null;
};

// selectedKey: currently-highlighted segment label across the whole dashboard (string | null)
// onSegmentClick(label, property_uids): fired on slice/legend click — same signature as your other cards
export default function PropertyDonutCard({
  title,
  segments,
  selectedKey,
  onSegmentClick,
}) {
  const filteredSegments = segments.filter((seg) => seg.value > 0);
  const sortedSegments = [...filteredSegments].sort(
    (a, b) => b.value - a.value,
  );

  const isInteractive = typeof onSegmentClick === "function";
  const handleClick = (seg) => {
    if (isInteractive) onSegmentClick(seg.label, seg.property_uids);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow">
      <h3
        className="text-sm font-bold mb-4 text-left ml-2 mt-0.5"
        style={{ color: "#7a1453" }}
      >
        {title}
        {selectedKey && sortedSegments.some((s) => s.label === selectedKey) && (
          <span className="text-xs font-normal text-gray-400 ml-2">
            ({selectedKey})
          </span>
        )}
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
                  <Cell
                    key={idx}
                    fill={seg.color}
                    // opacity={!selectedKey || selectedKey === seg.label ? 1 : 0.3}
                    stroke={selectedKey === seg.label ? "#facc15" : "none"}
                    strokeWidth={selectedKey === seg.label ? 2 : 0}
                    cursor={isInteractive ? "pointer" : "default"}
                    onClick={() => handleClick(seg)}
                  />
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
