import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_THEMES, HIGHLIGHT_COLOR, CROSS_FILTER_DIM_OPACITY } from "../../theme/colors";


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const seg = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs min-w-32.5">
        <p className="font-semibold text-gray-800 text-center">{seg.label}</p>
        <div className="border-t border-gray-200 mt-2 pt-2">
          <p className="text-gray-500 text-center">
            <span className="font-bold">Count-{seg.value}</span> ({seg.percent}%)
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const renderValueLabel = ({ payload, cx, cy, midAngle, innerRadius, outerRadius }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="600">
      {payload.percent}%
    </text>
  );
};

// themeKey: which CHART_THEMES entry to use, e.g. "tax_rate_zone", "property_location"
export default function DonutStatCard({ title, data, themeKey, selectedFilter, onSegmentClick }) {
  const [chartData, setChartData] = useState(null);
  const theme = CHART_THEMES[themeKey] || { base: "#7076b0", shades: ["#7076b0"] };

  useEffect(() => {
    if (data) setChartData(mapApiDataToChart(data));
  }, [data]);

  const mapApiDataToChart = (apiData) => {
    if (!apiData) return null;
    const zoneKeys = Object.keys(apiData);
    const totalCount = zoneKeys.reduce((sum, key) => sum + apiData[key].count, 0);
    const segments = zoneKeys.map((key, index) => ({
      label: key,
      value: apiData[key].count || 0,
      percent: apiData[key].percentage || 0,
      color: theme.shades[index % theme.shades.length],
      property_uids: apiData[key].property_uids || [],
    }));
    segments.sort((a, b) => b.value - a.value);
    return { totalCount, segments, compareLabel: `Total: ${totalCount} Properties` };
  };

  const selectedUidSet = useMemo(() => new Set(selectedFilter?.uids || []), [selectedFilter]);

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
      className="relative rounded-2xl border pb-5 overflow-hidden hover:shadow-md transition-shadow"
      // style={{ backgroundColor: `${theme.base}0D`, borderColor: `${theme.base}33` }}
    >
      {/* <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: theme.base }} /> */}

      <div className="flex items-center justify-center">
        <h3 className="text-sm font-semibold text-gray-800 mt-3">
          {title}
          {selectedFilter?.label && chartData.segments.some((s) => s.label === selectedFilter.label) && (
            <span className="text-xs font-normal text-gray-400 ml-4">({selectedFilter.label})</span>
          )}
        </h3>
      </div>

      <div className="flex items-center w-full justify-center gap-4 mt-3">
        <div className="h-38 shrink-0 relative w-1/2">
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
                  const hasOverlap = !selectedFilter || seg.property_uids.some((uid) => selectedUidSet.has(uid));
                  return (
                    <Cell
                      key={idx}
                      fill={seg.color}
                      fillOpacity={hasOverlap ? 1 : CROSS_FILTER_DIM_OPACITY}
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