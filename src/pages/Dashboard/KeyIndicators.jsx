import { useState, useEffect } from "react";
import {
  FaMapMarkedAlt,
  FaHome,
  FaThLarge,
  FaBuilding,
  FaLock,
} from "react-icons/fa";
import { fetchKeyIndicators } from "../../services/api.js";

const PRIMARY = "#7a1453";

const ICON_MAP = {
  unique_parcels: FaMapMarkedAlt,
  unique_properties: FaHome,
  total_plot_area: FaThLarge,
  total_builtup_area: FaBuilding,
  vacant_properties: FaLock,
};

const formatValue = (value) =>
  typeof value === "number" ? value.toLocaleString("en-US") : value;

function IndicatorCard({ item }) {
  const Icon = ICON_MAP[item.key] || FaThLarge;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col gap-3 cursor-pointer">
      <div className="flex items-center gap-3">
        <div
          style={{ backgroundColor: PRIMARY }}
          className="flex items-center justify-center w-11 h-11 rounded-lg text-white text-lg shrink-0"
        >
          <Icon />
        </div>
        <p className="text-sm text-gray-500 font-medium leading-snug">
          {item.label}
        </p>
      </div>

      <div className="flex flex-col items-center gap-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {formatValue(item.value)}
        </h2>
        <p className="text-xs  text-gray-400 mt-1">{item.subtext}</p>
      </div>
    </div>
  );
}

export default function KeyIndicators() {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndicators();
  }, []);

  const loadIndicators = async () => {
    try {
      setLoading(true);
      const response = await fetchKeyIndicators();
      setIndicators(response.indicators || []);
    } catch (error) {
      console.error("Error fetching key indicators:", error);
      setIndicators([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <p className="text-gray-400 text-sm">Loading key indicators...</p>
      </div>
    );
  }

  return (
    <div className="  py-[200px]   h-[300px]">
      <h3 className="text-lg font-bold text-gray-900 ">Key Indicators</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 h-[170px]">
        {indicators.map((item) => (
          <IndicatorCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}