import { useEffect, useState } from "react";
import GaugeChart from "./GaugeChart";
import { fetchDataCompleteness } from "../../services/api";

export default function DataCompletenes() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchDataCompleteness().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        <p className="text-gray-400 text-sm">Loading data completeness...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
      <h3
        className="text-lg mt-1 ml-2 font-bold mb-6"
        style={{ color: "#7a1453" }}
      >
        Data Completeness
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
        {data.metrics.map((metric) => (
          <GaugeChart
            key={metric.key}
            label={metric.label}
            completed={metric.completed}
            total={data.total}
          />
        ))}
      </div>
    </div>
  );
}
