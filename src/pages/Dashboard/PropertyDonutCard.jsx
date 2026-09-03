import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;
const HIGHLIGHT_COLOR = "#facc15";

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
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
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
          <p className="text-xs font-semibold text-gray-800">{seg.label}</p>
        </div>
        <p className="text-gray-500 flex items-center justify-center">
          <span className="font-bold">{seg.value}</span> ({Math.round(seg.percent)}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function PropertyDonutCard({ title, segments, selectedFilter, onSegmentClick }) {
  const filteredSegments = segments.filter((seg) => seg.value > 0);
  const sortedSegments = [...filteredSegments].sort((a, b) => b.value - a.value);

  const isInteractive = typeof onSegmentClick === "function";
  const handleClick = (seg) => {
    if (isInteractive) onSegmentClick(seg.label, seg.property_uids);
  };

  return (
    <div className="relative flex flex-col items-center rounded-2xl p-5 hover:shadow-md transition-shadow overflow-hidden bg-white" style={{ border: "1px solid #e5e7eb" }}>
      <h3 className="text-sm font-bold mb-2 text-center mt-2 text-gray-800">
        {title}
        {selectedFilter?.label && sortedSegments.some((s) => s.label === selectedFilter.label) && (
          <span className="text-xs font-normal text-gray-400 ml-2">({selectedFilter.label})</span>
        )}
      </h3>

      <div className="flex items-center justify-center gap-4">
        <div className="w-36 h-42 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sortedSegments} dataKey="value" innerRadius="35%" outerRadius="100%" label={renderLabel} labelLine={false} paddingAngle={2}>
                {sortedSegments.map((seg, idx) => {
                  const isOwnSelection = selectedFilter?.label === seg.label;
                  return (
                    <Cell
                      key={idx}
                      fill={seg.color}
                      stroke={isOwnSelection ? HIGHLIGHT_COLOR : "none"}
                      strokeWidth={isOwnSelection ? 2 : 0}
                      cursor={isInteractive ? "pointer" : "default"}
                      onClick={() => handleClick(seg)}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}