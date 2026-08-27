import GeographicOverview from "./GeographicOverview";
import DonutStatCard from "./DonutStatCard";
import BarStatCard from "./BarStatCard";

export default function DashboardCharts({
  data,
  selectedFilter,
  onSegmentClick,
  onClearFilter,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      <div>
        <GeographicOverview
          data={data?.survey_analysis}
          selectedFilter={selectedFilter}
          onClearFilter={onClearFilter}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
        <DonutStatCard
          title="Tax Rate Zone"
          themeKey="tax_rate_zone"
          data={data?.survey_analysis?.tax_rate_zones}
          selectedKey={selectedFilter?.label}
          onSegmentClick={onSegmentClick}
        />

        <DonutStatCard
          title="Property Location"
          themeKey="property_location"
          data={data?.survey_analysis?.property_locations}
          selectedKey={selectedFilter?.label}
          onSegmentClick={onSegmentClick}
        />

        <BarStatCard
          title="Property Age"
          themeKey="property_age"
          data={data?.land_building_analysis?.building_age}
          selectedKey={selectedFilter?.label}
          onBarClick={onSegmentClick}
        />

        <BarStatCard
          title="Utilities"
          themeKey="utilities"
          data={data?.utility_analysis}
          selectedKey={selectedFilter?.label}
          onBarClick={onSegmentClick}
        />
      </div>
    </div>
  );
}
