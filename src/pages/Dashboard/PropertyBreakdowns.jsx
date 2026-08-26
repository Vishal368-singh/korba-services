import { useMemo } from "react";
import PropertyDonutCard from "./PropertyDonutCard";

const COLORS = {
  primary: ["#7a1453", "#a8306e", "#c96b98", "#e6b8cf", "#f5d6e6", "#fce4ec"],
};

export default function PropertyBreakdowns({ data, selectedFilter, onSegmentClick }) {
  const charts = useMemo(() => {
    const landBuilding = data?.land_building_analysis || {};
    const chartConfigs = [
      { key: "property_status", title: "Property Status", data: landBuilding.usage_factor },
      { key: "usage_details", title: "Usage Details", data: landBuilding.usage_type },
      { key: "construction_type", title: "Construction Type", data: landBuilding.construction_type },
      { key: "roof_type", title: "Roof Type", data: landBuilding.roof_type },
    ];

    return chartConfigs
      .filter((config) => config.data && Object.keys(config.data).length > 0)
      .map((config) => {
        const segments = Object.keys(config.data).map((key, index) => ({
          label: key,
          value: config.data[key]?.count || 0,
          percent: config.data[key]?.percentage || 0,
          color: COLORS.primary[index % COLORS.primary.length],
          property_uids: config.data[key]?.property_uids || [],
        }));

        segments.sort((a, b) => b.value - a.value);
        const total = segments.reduce((sum, seg) => sum + seg.value, 0);

        return { key: config.key, title: config.title, total, segments };
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
          total={chart.total}
          segments={chart.segments}
          selectedKey={selectedFilter?.label}
          onSegmentClick={onSegmentClick}
        />
      ))}
    </div>
  );
}