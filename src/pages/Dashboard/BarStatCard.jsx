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
import {
  HIGHLIGHT_COLOR,
  CROSS_FILTER_DIM_OPACITY,
  UTILITY_COLORS,
  AGE_COLORS,
  BAR_DEFAULT_COLOR,
  CARD_BORDER_COLOR,
} from "../../theme/colors";

export default function BarStatCard({
  title,
  data,
  themeKey,
  selectedFilter,
  onBarClick,
}) {
  function mapApiDataToChart(apiData) {
    if (!apiData) return null;
    if (
      apiData.total_properties_with_utilities !== undefined &&
      apiData.utilities
    ) {
      return mapUtilitiesData(apiData);
    }
    const ageKeys = [
      "0-5 Years",
      "6-10 Years",
      "11-20 Years",
      "21-30 Years",
      "31+ Years",
    ];
    if (ageKeys.some((key) => apiData[key] !== undefined)) {
      return mapBuildingAgeData(apiData);
    }
    return mapGenericData(apiData);
  }

  // Pick the right per-category color map based on which dataset this chart represents
  const getColorMap = () => {
    if (themeKey === "utilities") return UTILITY_COLORS;
    if (themeKey === "property_age") return AGE_COLORS;
    return {};
  };

  const mapBuildingAgeData = (apiData) => {
    const ageOrder = [
      "0-5 Years",
      "6-10 Years",
      "11-20 Years",
      "21-30 Years",
      "31+ Years",
    ];
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
    const utilityOrder = [
      "water_supply",
      "electricity",
      "sewerage",
      "drainage",
      "solid_waste",
    ];
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

  const chartData = useMemo(
    () => (data ? mapApiDataToChart(data) : null),
    [data],
  );
  const selectedUidSet = useMemo(
    () => new Set(selectedFilter?.uids || []),
    [selectedFilter],
  );
  const colorMap = getColorMap();

  if (!chartData || chartData.data.length === 0) {
    return (
      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 shadow-sm p-5 h-full flex items-center justify-center text-gray-400 text-sm">
        No Data Available
      </div>
    );
  }

  const isInteractive = typeof onBarClick === "function";

  return (
    <div
      className="relative rounded-2xl p-5 h-full overflow-hidden hover:shadow-md transition-shadow bg-white"
      style={{ border: `1px solid ${CARD_BORDER_COLOR}` }}
    >
      <div className="flex items-center justify-center mt-4">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      </div>

      <div className="mt-4 w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData.data}
            margin={{
              top: 22,
              right: 8,
              left: -15,
              bottom: 2,
            }}
            barCategoryGap="18%"
          >
            <XAxis
              dataKey="label"
              tick={{
                fontSize: 7,
                fill: "#9ca3af",
              }}
              axisLine={{
                stroke: "#9ca3af",
              }}
              tickLine={false}
              interval={0}
              height={30}
            />

            <YAxis
              tick={{
                fontSize: 10,
                fill: "#9ca3af",
              }}
              axisLine={{
                stroke: "#9ca3af",
              }}
              tickLine={false}
              domain={[0, (dataMax) => Math.ceil(dataMax * 1.15)]}
            />

            <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={42}>
              <LabelList
                dataKey="value"
                position="top"
                offset={5}
                style={{
                  fontSize: 11,
                  fill: "#374151",
                  fontWeight: 700,
                }}
              />

              {chartData.data.map((entry) => {
                const isOwnSelection = selectedFilter?.label === entry.label;

                const hasOverlap =
                  !selectedFilter ||
                  entry.property_uids.some((uid) => selectedUidSet.has(uid));

                const barColor = colorMap[entry.label] || BAR_DEFAULT_COLOR;

                return (
                  <Cell
                    key={entry.label}
                    fill={barColor}
                    fillOpacity={hasOverlap ? 1 : CROSS_FILTER_DIM_OPACITY}
                    stroke={isOwnSelection ? HIGHLIGHT_COLOR : "none"}
                    strokeWidth={isOwnSelection ? 2 : 0}
                    cursor={isInteractive ? "pointer" : "default"}
                    onClick={() =>
                      isInteractive &&
                      entry.value > 0 &&
                      onBarClick(entry.label, entry.property_uids)
                    }
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — same category color reused across every chart that shows these categories */}
      {/* <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 px-3">
        {chartData.data.map((entry) => {
          const isOwnSelection = selectedFilter?.label === entry.label;
          const hasOverlap =
            !selectedFilter ||
            entry.property_uids.some((uid) => selectedUidSet.has(uid));
          const barColor = colorMap[entry.label] || BAR_DEFAULT_COLOR;
          return (
            <button
              key={entry.label}
              onClick={() =>
                isInteractive &&
                entry.value > 0 &&
                onBarClick(entry.label, entry.property_uids)
              }
              disabled={!isInteractive || entry.value === 0}
              className={`flex items-center gap-1.5 text-xs rounded-md px-1.5 py-0.5 transition ${
                isInteractive && entry.value > 0
                  ? "cursor-pointer hover:bg-gray-100"
                  : ""
              } ${isOwnSelection ? "ring-1 ring-amber-400 bg-amber-50" : ""}`}
              style={{ opacity: hasOverlap ? 1 : CROSS_FILTER_DIM_OPACITY }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: barColor }}
              />
              <span className="text-gray-600">{entry.label}</span>
            </button>
          );
        })}
      </div> */}
    </div>
  );
}
