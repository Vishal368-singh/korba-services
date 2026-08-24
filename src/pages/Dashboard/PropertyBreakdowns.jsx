import { useState, useEffect } from "react";
import PropertyDonutCard from "./PropertyDonutCard";
import { fetchPropertyBreakdowns } from "../../services/api.js";

export default function PropertyBreakdowns() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyBreakdowns().then((res) => {
      setCharts(res.charts || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mt-6 py-6">
        <p className="text-gray-400 text-sm">Loading property breakdowns...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
      {charts.map((chart) => (
        <PropertyDonutCard
          key={chart.key}
          title={chart.title}
          total={chart.total}
          segments={chart.segments}
        />
      ))}
    </div>
  );
}
