import GaugeChart from "./GaugeChart";

const METRICS = [
  { key: "owner_mobile_no", label: "Owner Mobile No" },
  { key: "property_image", label: "Property Image" },
  { key: "geo_tag_completion", label: "Geo-tag Completion" },
  { key: "boundary_verification", label: "Boundary Verification" },
];

// Per-metric accent color — distinct from chart palette so each gauge stands apart
const GAUGE_COLORS = {
  owner_mobile_no: "#3b82f6", // blue
  property_image: "#22c55e", // green
  geo_tag_completion: "#f97316", // orange
  boundary_verification: "#a855f7", // purple
};

// data: dashboardData?.data_completeness — { [key]: { completed, total, percentage, property_uids } }
// selectedKey / onSegmentClick: optional, same pattern as DashboardCharts, for map highlight
export default function DataCompletenes({ data, selectedKey, onSegmentClick }) {
  if (!data) {
    return (
      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        <p className="text-gray-400 text-sm">Loading data completeness...</p>
      </div>
    );
  }

  const isInteractive = typeof onSegmentClick === "function";

  return (
   <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
      <div className="flex items-center justify-center mb-2 mt-4">
        <h3 className="text-lg font-bold text-gray-800">Data Completeness</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
        {METRICS.map(({ key, label }) => {
          const metric = data[key];
          if (!metric) return null;

          const color = GAUGE_COLORS[key] || "#6366f1";
          const isSelected = selectedKey === label;

          return (
            <div
              key={key}
              onClick={
                isInteractive
                  ? () => onSegmentClick(label, metric.property_uids)
                  : undefined
              }
              className={`relative rounded-xl transition-all overflow-hidden ${
                isInteractive ? "cursor-pointer hover:shadow-md" : ""
              } ${isSelected ? "ring-2 ring-[#facc15]" : ""} py-4 px-2`}
              // style={{
              //   backgroundColor: `${color}0D`, // ~5% tint
              //   border: `1px solid ${color}33`, // ~20% border
              // }}
            >
              {/* Accent bar on top edge */}

              <GaugeChart
                label={label}
                completed={metric.completed}
                total={metric.total}
                fillColor={color}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
