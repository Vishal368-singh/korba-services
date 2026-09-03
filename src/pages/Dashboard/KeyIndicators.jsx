import {
  FaMapMarkedAlt,
  FaThLarge,
  FaBuilding,
  FaPlusSquare,
  FaLayerGroup,
  FaCity,
} from "react-icons/fa";
import { LandPlot } from "lucide-react";
import { KPI_COLORS, KPI_DEFAULT_COLOR } from "../../theme/colors";

const ICON_MAP = {
  unique_parcels: FaMapMarkedAlt,
  unique_properties: FaCity,
  total_plot_area: FaThLarge,
  total_builtup_area: FaBuilding,
  vacant_properties: LandPlot,
  new_construction: FaPlusSquare,
  additional_floor_constructed: FaLayerGroup,
};

const formatValue = (value) =>
  typeof value === "number" ? value.toLocaleString("en-US") : value;

function IndicatorCard({ item }) {
  const Icon = ICON_MAP[item.key] || FaThLarge;
  const color = KPI_COLORS[item.key] || KPI_DEFAULT_COLOR;

  return (
    <div
      className="relative rounded-xl h-[100%] border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col gap-3 cursor-pointer overflow-hidden"
      style={{
        backgroundColor: `${color}0D`,
        borderColor: `${color}33`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />

      <div className="flex flex-row items-center gap-3">
        <div
          style={{ backgroundColor: color }}
          className="flex items-center mt-2 ml-2 justify-center w-11 h-11 rounded-lg text-white text-lg shrink-0 shadow-md"
        >
          <Icon />
        </div>
        <p className="text-xs text-gray-600 leading-snug font-medium">{item.label}</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {formatValue(item.value)}
        </h2>
        <p className="text-xs text-gray-500 leading-snug">{item.subtext}</p>
      </div>
    </div>
  );
}

// data: dashboardData?.key_indicators from Dashboard.jsx
// shape per your backend: { unique_parcels: {value, percentage, property_uids}, unique_properties: {...}, ... }
export default function KeyIndicators({ data }) {
  if (!data) {
    return (
      <div className="py-6">
        <p className="text-gray-400 text-sm">Loading key indicators...</p>
      </div>
    );
  }

  // Convert the API's object shape into the array IndicatorCard expects
  const LABELS = {
    unique_parcels: "Land Parcels",
    unique_properties: "Unique Properties",
    total_plot_area: "Total Plot Area (sq.ft.)",
    total_builtup_area: "Total Built-up Area (sq.ft.)",
    vacant_properties: "Vacant Properties",
    new_construction: "New Construction",
    additional_floor: "Additional Floor Constructed",
  };

  const indicators = Object.entries(data).map(([key, val]) => ({
    key,
    label: LABELS[key] || key.replace(/_/g, " "),
    value: val.value,
    // subtext: `${val.percentage}% of Total`,
    property_uids: val.property_uids || [],
  }));

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Key Indicators</h3>

      <div className="grid grid-cols-2 mb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {indicators.map((item) => (
          <IndicatorCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}