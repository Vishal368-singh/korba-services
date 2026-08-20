import GeographicOverview from "./GeographicOverview";
import DonutStatCard from "./DonutStatCard";
import BarStatCard from "./BarStatCard";
import {
  fetchRevenueBreakdown,
  fetchUsersBreakdown,
  fetchConversionsTrend,
  fetchSessionsTrend,
} from "../../services/api.js";

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full ">
      <div>
        <GeographicOverview />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
        <DonutStatCard title="Tax Rate Zone" fetchFn={fetchRevenueBreakdown} />
        <DonutStatCard
          title="Property Location"
          fetchFn={fetchUsersBreakdown}
        />
        <BarStatCard title="Property Age" fetchFn={fetchConversionsTrend} />
        <BarStatCard title="Utilities" fetchFn={fetchSessionsTrend} />
      </div>
    </div>
  );
}
