import { useState, useEffect } from "react";
import {
  FaMapMarkedAlt,

  FaThLarge,
  FaBuilding,
 
  FaPlusSquare,
  FaLayerGroup,
  FaCity,
} from "react-icons/fa";
import { LandPlot } from "lucide-react";
import { fetchKeyIndicators } from "../../services/api.js";
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
        backgroundColor: `${color}0D`, // ~5% opacity tint of the theme color
        borderColor: `${color}33`,     // ~20% opacity border
      }}
    >
      {/* Accent bar on top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />

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
      </div>
    </div>
  );
}


export default function KeyIndicators() {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadIndicators = async () => {
      try {
        const response = await fetchKeyIndicators();
        if (!cancelled) {
          setIndicators(response.indicators || []);
        }
      } catch (error) {
        console.error("Error fetching key indicators:", error);
        if (!cancelled) {
          setIndicators([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadIndicators();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-6">
        <p className="text-gray-400 text-sm">Loading key indicators...</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Key Indicators
      </h3>

      <div className="grid grid-cols-2 mb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {indicators.map((item) => (
          <IndicatorCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}