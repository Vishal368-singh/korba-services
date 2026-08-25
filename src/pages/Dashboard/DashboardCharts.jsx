import GeographicOverview from "./GeographicOverview";
import DonutStatCard from "./DonutStatCard";
import BarStatCard from "./BarStatCard";
import {
  fetchRevenueBreakdown,
  fetchUsersBreakdown,
  fetchConversionsTrend,
  fetchSessionsTrend,
} from "../../services/api.js";

export default function DashboardCharts({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full ">
      <div>
        <GeographicOverview data={data?.survey_analysis} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
        <DonutStatCard
          title="Tax Rate Zone"
          data={data?.survey_analysis?.tax_rate_zones}
        />

        <DonutStatCard
          title="Property Location"
          data={data?.survey_analysis?.property_locations}
        />

        <BarStatCard
          title="Property Age"
          data={data?.land_building_analysis?.building_age}
        />

        <BarStatCard
          title="Utilities"
          data={data?.utility_analysis}
        />
      </div>
    </div>
  );
}
