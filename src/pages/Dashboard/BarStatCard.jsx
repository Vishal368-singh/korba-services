import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts";

const PRIMARY = "#7a1453";

// selectedKey: label of currently-highlighted bar (string | null)
// onBarClick(label, property_uids): fired when a bar is clicked
export default function BarStatCard({ title, data, barColor = PRIMARY, selectedKey, onBarClick }) {
  function mapApiDataToChart(apiData) {
    if (!apiData) return null;

    if (apiData.total_properties_with_utilities !== undefined && apiData.utilities) {
      return mapUtilitiesData(apiData);
    }

    const ageKeys = ["0-5 Years", "6-10 Years", "11-20 Years", "21-30 Years", "31+ Years"];
    const hasAgeKeys = ageKeys.some((key) => apiData[key] !== undefined);
    if (hasAgeKeys) {
      return mapBuildingAgeData(apiData);
    }

    return mapGenericData(apiData);
  }

  const mapBuildingAgeData = (apiData) => {
    const ageOrder = ["0-5 Years", "6-10 Years", "11-20 Years", "21-30 Years", "31+ Years"];
    const chartData = ageOrder.map((key) => ({
      label: key,
      value: apiData[key]?.count || 0,
      percentage: apiData[key]?.percentage || 0,
      property_uids: apiData[key]?.property_uids || [],
    }));
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return { total, data: chartData, type: "building_age" };
  };

  const mapUtilitiesData = (apiData) => {
    const utilities = apiData.utilities || {};
    const totalProperties = apiData.total_properties_with_utilities || 0;
    const utilityOrder = ["water_supply", "electricity", "sewerage", "drainage", "solid_waste"];
    const utilityLabels = {
      water_supply: "Water Supply",
      electricity: "Electricity",
      sewerage: "Sewerage",
      drainage: "Drainage",
      solid_waste: "Solid Waste",
    };
    const chartData = utilityOrder.map((key) => ({
      label: utilityLabels[key] || key.replace("_", " ").toUpperCase(),
      value: utilities[key]?.count || 0,
      percentage: utilities[key]?.percentage || 0,
      property_uids: utilities[key]?.property_uids || [],
    }));
    return { total: totalProperties, data: chartData, type: "utilities" };
  };

  const mapGenericData = (apiData) => {
    const keys = Object.keys(apiData);
    const chartData = keys.map((key) => ({
      label: key.replace(/_/g, " ").toUpperCase(),
      value: apiData[key]?.count || 0,
      percentage: apiData[key]?.percentage || 0,
      property_uids: apiData[key]?.property_uids || [],
    }));
    chartData.sort((a, b) => b.value - a.value);
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return { total, data: chartData, type: "generic" };
  };

  const chartData = useMemo(() => (data ? mapApiDataToChart(data) : null), [data]);

  if (!chartData || chartData.data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full flex items-center justify-center text-gray-400 text-sm">
        No Data Available
      </div>
    );
  }

  const isInteractive = typeof onBarClick === "function";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full">
      <div className="flex items-center justify-between mt-1 ml-2">
        <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>
          {title}
        </h3>
      </div>

      <div className="h-38 mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.data} margin={{ top: 5, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 7, fill: "#9ca3af" }} axisLine={true} tickLine={false} interval={0} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={true} tickLine={false}>
              <Label position="insideLeft" style={{ textAnchor: "middle", fontSize: 11, fill: "#6b7280" }} />
            </YAxis>
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }} />
              {chartData.data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={barColor}
                  opacity={!selectedKey || selectedKey === entry.label ? 1 : 0.3}
                  stroke={selectedKey === entry.label ? "#facc15" : "none"}
                  strokeWidth={selectedKey === entry.label ? 2 : 0}
                  cursor={isInteractive ? "pointer" : "default"}
                  onClick={() => isInteractive && entry.value > 0 && onBarClick(entry.label, entry.property_uids)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}