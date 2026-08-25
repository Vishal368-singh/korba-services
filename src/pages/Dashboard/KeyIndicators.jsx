import { useState, useEffect } from "react";
import {
  FaMapMarkedAlt,
  FaHome,
  FaThLarge,
  FaBuilding,
  FaLock,
  FaPlusSquare,
  FaLayerGroup,
  FaCity,
} from "react-icons/fa";
import { LandPlot } from "lucide-react";
import { fetchKeyIndicators } from "../../services/api.js";

const PRIMARY = "#7a1453";

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

  return (
    <div className="bg-white rounded-xl h-[80%] border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col gap-3 cursor-pointer">
      <div className="flex flex-row items-center gap-3">
        <div
          style={{ backgroundColor: PRIMARY }}
          className="flex items-center  mt-2 ml-2 justify-center w-11 h-11 rounded-lg text-white text-lg shrink-0"
        >
          <Icon />
        </div>
        <p className="text-xs text-gray-500  leading-snug">{item.label}</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {formatValue(item.value)}
        </h2>

        <p className="text-xs  text-[#7a1453] mb-10">{item.subtext}</p>
      </div>
    </div>
  );
}

export default function KeyIndicators({ data }) {
  const [indicators, setIndicators] = useState([
    {
      key: "unique_parcels",
      label: "Unique Parcels",
      value: 181,
      subtext: "96.8% of Total Surveys",
    },
    {
      key: "unique_properties",
      label: "Unique Properties",
      value: 187,
      subtext: "100% of Total Surveys",
    },
    {
      key: "total_plot_area",
      label: "Total Plot Area (sq.ft.)",
      value: 301355,
      subtext: "100% of Total Surveys",
    },
    {
      key: "total_builtup_area",
      label: "Total Built-up Area (sq.ft.)",
      value: 248853,
      subtext: "82.6% of Plot Area",
    },
    {
      key: "vacant_properties",
      label: "Vacant Properties",
      value: 26,
      subtext: "13.9% of Total Properties",
    },
    {
      key: "new_construction",
      label: "New Construction",
      value: 12,
      subtext: "6.4% of Total Properties",
    },
    {
      key: "additional_floor_constructed",
      label: "Additional Floor Constructed",
      value: 15,
      subtext: "8.0% of Total Properties",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      const mappedIndicators = [
        {
          key: "unique_parcels",
          label: "Unique Parcels",
          value: data.unique_parcels?.value || 0,
          subtext: `${data.unique_parcels?.percentage || 0}% of Total Surveys`,
        },
        {
          key: "unique_properties",
          label: "Unique Properties",
          value: data.unique_properties?.value || 0,
          subtext: `${data.unique_properties?.percentage || 0}% of Total Surveys`,
        },
        {
          key: "total_plot_area",
          label: "Total Plot Area (sq.ft.)",
          value: data.total_plot_area?.value || 0,
          subtext: `${data.total_plot_area?.percentage || 0}% of Total Surveys`,
        },
        {
          key: "total_builtup_area",
          label: "Total Built-up Area (sq.ft.)",
          value: data.total_builtup_area?.value || 0,
          subtext: `${data.total_builtup_area?.percentage || 0}% of Plot Area`,
        },
        {
          key: "vacant_properties",
          label: "Vacant Properties",
          value: data.vacant_properties?.value || 0,
          subtext: `${data.vacant_properties?.percentage || 0}% of Total Properties`,
        },
        {
          key: "new_construction",
          label: "New Construction",
          value: data.new_construction?.value || 0,
          subtext: `${data.new_construction?.percentage || 0}% of Total Properties`,
        },
        {
          key: "additional_floor",
          label: "Additional Floor Constructed",
          value: data.additional_floor?.value || 0,
          subtext: `${data.additional_floor?.percentage || 0}% of Total Properties`,
        },
      ];

      setIndicators(mappedIndicators);
    }
  }, [data]);

  // useEffect(() => {
  //   loadIndicators();
  // }, []);

  // const loadIndicators = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetchKeyIndicators();
  //     setIndicators(response.indicators || []);
  //   } catch (error) {
  //     console.error("Error fetching key indicators:", error);
  //     setIndicators([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div className="py-6">
  //       <p className="text-gray-400 text-sm">Loading key indicators...</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#7a1453] mb-2 ">
        Key Indicators
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {indicators.map((item) => (
          <IndicatorCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}
