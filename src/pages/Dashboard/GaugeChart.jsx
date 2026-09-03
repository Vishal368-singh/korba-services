import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TRACK_COLOR } from "../../theme/colors";

export default function GaugeChart({ label, completed, total, fillColor = "#6366f1" }) {
  const percent = total > 0 ? (completed / total) * 100 : 0;
  const displaypercent = percent < 1 && percent > 0 ? percent.toFixed(1) : Math.round(percent);

  const data = [
    { name: "filled", value: percent },
    { name: "remaining", value: 100 - percent },
  ];

  return (
    <div className="flex flex-col items-center mx-auto w-full max-w-40 sm:max-w-50 lg:max-w-60">
      <p className="text-sm font-semibold text-gray-800 mb-2 text-center">{label}</p>
      <div className="relative w-full aspect-2/1 max-w-45">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              cx="50%"
              cy="100%"
              innerRadius={55}
              outerRadius={75}
              stroke="none"
              cornerRadius={1}
            >
              <Cell fill={fillColor} />
              <Cell fill={TRACK_COLOR} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-xl font-bold text-gray-900">{displaypercent}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between w-full max-w-45 text-xs text-gray-400 mt-1">
        <span>0%</span>
        <span className="font-medium text-gray-500">{completed} of {total}</span>
        <span>100%</span>
      </div>
    </div>
  );
}