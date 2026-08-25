import GaugeChart from "./GaugeChart";

const METRICS = [
  { key: "owner_mobile_no", label: "Owner Mobile No" },
  { key: "property_image", label: "Property Image" },
  { key: "geo_tag_completion", label: "Geo-tag Completion" },
  { key: "boundary_verification", label: "Boundary Verification" },
];

// data: dashboardData?.data_completeness — { [key]: { completed, total, percentage, property_uids } }
// selectedKey / onSegmentClick: optional, same pattern as DashboardCharts, for map highlight
export default function DataCompletenes({ data, selectedKey, onSegmentClick }) {
  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        <p className="text-gray-400 text-sm">Loading data completeness...</p>
      </div>
    );
  }

  const isInteractive = typeof onSegmentClick === "function";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
      <h3 className="text-lg mt-1 ml-2 font-bold mb-6" style={{ color: "#7a1453" }}>
        Data Completeness
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
        {METRICS.map(({ key, label }) => {
          const metric = data[key];
          if (!metric) return null;

          const isSelected = selectedKey === label;

          return (
            <div
              key={key}
              onClick={
                isInteractive ? () => onSegmentClick(label, metric.property_uids) : undefined
              }
              className={`rounded-xl transition-all ${
                isInteractive ? "cursor-pointer hover:bg-gray-50" : ""
              } ${isSelected ? "ring-2 ring-[#facc15] bg-gray-50" : ""} ${
                selectedKey && !isSelected ? "opacity-40" : ""
              } py-1`}
            >
              <GaugeChart
                label={label}
                completed={metric.completed}
                total={metric.total} // <-- each metric's OWN total, not a shared one
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}