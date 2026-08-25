import { useState } from "react";
import GeographicOverview from "./GeographicOverview";
import DonutStatCard from "./DonutStatCard";
import BarStatCard from "./BarStatCard";

export default function DashboardCharts({ data }) {
  const [selectedFilter, setSelectedFilter] = useState(null); // { label, uids } | null

  const handleSegmentClick = (label, uids) => {
    setSelectedFilter((prev) => (prev?.label === label ? null : { label, uids: uids || [] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      <div>
        <GeographicOverview
          data={data?.survey_analysis}
          selectedFilter={selectedFilter}
          onClearFilter={() => setSelectedFilter(null)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
        <DonutStatCard
          title="Tax Rate Zone"
          data={data?.survey_analysis?.tax_rate_zones}
          selectedKey={selectedFilter?.label}
          onSegmentClick={handleSegmentClick}
        />

        <DonutStatCard
          title="Property Location"
          data={data?.survey_analysis?.property_locations}
          selectedKey={selectedFilter?.label}
          onSegmentClick={handleSegmentClick}
        />

        <BarStatCard
          title="Property Age"
          data={data?.land_building_analysis?.building_age}
          selectedKey={selectedFilter?.label}
          onBarClick={handleSegmentClick}
        />

        <BarStatCard
          title="Utilities"
          data={data?.utility_analysis}
          selectedKey={selectedFilter?.label}
          onBarClick={handleSegmentClick}
        />
      </div>
    </div>
  );
}