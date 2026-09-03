import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  CHART_THEMES,
  MAP_LOCATION_COLORS,
  HIGHLIGHT_COLOR,
  CARD_BORDER_COLOR,
} from "../../theme/colors";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const seg = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs min-w-32.5">
        <p className="font-semibold text-gray-800 text-center">{seg.label}</p>
        <div className="border-t border-gray-200 mt-2 pt-2">
          <p className="text-gray-500 text-center">
            <span className="font-bold">{seg.value}</span> ({seg.percent}
            %)
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const renderValueLabel = ({
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

export default function DonutStatCard({
  title,
  data,
  themeKey,
  selectedFilter,
  onSegmentClick,
}) {
  const [chartData, setChartData] = useState(null);
  const theme = CHART_THEMES[themeKey] || {
    base: "#7076b0",
    shades: ["#7076b0"],
  };

  useEffect(() => {
    if (data) setChartData(mapApiDataToChart(data));
  }, [data]);

  const mapApiDataToChart = (apiData) => {
    if (!apiData) return null;
    const zoneKeys = Object.keys(apiData);
    const totalCount = zoneKeys.reduce(
      (sum, key) => sum + apiData[key].count,
      0,
    );
    const segments = zoneKeys.map((key, index) => ({
      label: key,
      value: apiData[key].count || 0,
      percent: apiData[key].percentage || 0,

      color:
        themeKey === "property_location"
          ? MAP_LOCATION_COLORS[key] || theme.base
          : theme.shades[index % theme.shades.length],

      property_uids: apiData[key].property_uids || [],
    }));
    segments.sort((a, b) => b.value - a.value);
    return { totalCount, segments };
  };

  if (!chartData) {
    return (
      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 shadow-sm p-5 h-full flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  const isInteractive = typeof onSegmentClick === "function";
  const handleClick = (seg) => {
    if (isInteractive) onSegmentClick(seg.label, seg.property_uids);
  };

  return (
    <div
      className="relative rounded-2xl pb-5 overflow-hidden hover:shadow-md transition-shadow bg-white h-full flex flex-col"
      style={{ border: `1px solid ${CARD_BORDER_COLOR}` }}
    >
      <div className="flex items-center justify-center">
        <h3 className="text-sm font-semibold text-gray-800 mt-3">
          {title}
          {selectedFilter?.label &&
            chartData.segments.some(
              (s) => s.label === selectedFilter.label,
            ) && (
              <span className="text-xs font-normal text-gray-400 ml-4">
                ({selectedFilter.label})
              </span>
            )}
        </h3>
      </div>

      <div className="flex items-center w-full justify-center gap-4 mt-3">
        <div className="h-44 shrink-0 relative w-1/2">
          <ResponsiveContainer width="100%" height="100%" className="mt-1">
            <PieChart>
              <Pie
                data={chartData.segments}
                dataKey="value"
                innerRadius="35%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
                label={renderValueLabel}
                labelLine={false}
              >
                {chartData.segments.map((seg, idx) => {
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

      {/* <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 px-3">
        {chartData.segments.map((seg) => {
          const isOwnSelection = selectedFilter?.label === seg.label;
          return (
            <button
              key={seg.label}
              onClick={() => handleClick(seg)}
              disabled={!isInteractive}
              className={`flex items-center gap-1.5 text-xs rounded-md px-1.5 py-0.5 transition ${isInteractive ? "cursor-pointer hover:bg-gray-100" : ""} ${isOwnSelection ? "ring-1 ring-amber-400 bg-amber-50" : ""}`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-gray-600">{seg.label} ({seg.percent}%)</span>
            </button>
          );
        })}
      </div> */}
    </div>
  );
}
