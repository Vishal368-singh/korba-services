import { useMemo } from "react";
import PropertyDonutCard from "./PropertyDonutCard";
import { CHART_THEMES } from "../../theme/colors";

export default function PropertyBreakdowns({ data, selectedFilter, onSegmentClick }) {
  const charts = useMemo(() => {
    const landBuilding = data?.land_building_analysis || {};
    const propertyStatus = data?.property_status || {};

    const chartConfigs = [
      { key: "property_status", title: "Property Status", themeKey: "property_status", data: propertyStatus.property_status },
      { key: "building_permissions", title: "Building Permissions", themeKey: "building_permissions", data: propertyStatus.building_permission_available },
      { key: "property_ownership", title: "Property Ownership", themeKey: "property_ownership", data: propertyStatus.property_ownership },
      { key: "construction_type", title: "Construction Type", themeKey: "construction_type", data: landBuilding.construction_type },
    ];

    return chartConfigs
      .filter((config) => config.data && Object.keys(config.data).length > 0)
      .map((config) => {
        const theme = CHART_THEMES[config.themeKey] || { shades: ["#6366f1"], base: "#6366f1" };
        const segments = Object.keys(config.data).map((key, index) => ({
          label: key,
          value: config.data[key]?.count || 0,
          percent: config.data[key]?.percentage || 0,
          color: theme.shades[index % theme.shades.length],
          property_uids: config.data[key]?.property_uids || [],
        }));

        segments.sort((a, b) => b.value - a.value);
        const total = segments.reduce((sum, seg) => sum + seg.value, 0);

        return { key: config.key, title: config.title, total, segments, accentColor: theme.base };
      });
  }, [data]);

  if (charts.length === 0) {
    return (
      <div className="mt-6 py-6">
        <p className="text-gray-400 text-sm">No property breakdown data available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
      {charts.map((chart) => (
        <PropertyDonutCard
          key={chart.key}
          title={chart.title}
          segments={chart.segments}
          accentColor={chart.accentColor}
          selectedFilter={selectedFilter}
          onSegmentClick={onSegmentClick}
        />
      ))}
    </div>
  );
}