// import { useState, useEffect } from "react";
// import PropertyDonutCard from "./PropertyDonutCard";
// import { fetchPropertyBreakdowns } from "../../services/api.js";

// export default function PropertyBreakdowns({data}) {
//   const [charts, setCharts] = useState({
//         charts: [
//           {
//             key: "property_status",
//             title: "Property Status",
//             total: 187,
//             segments: [
//               {
//                 label: "Occupied",
//                 value: 144,
//                 percent: 77.0,
//                 color: "#7a1453",
//               },
//               { label: "Vacant", value: 29, percent: 15.5, color: "#a8306e" },
//               {
//                 label: "Under Construction",
//                 value: 14,
//                 percent: 7.5,
//                 color: "#d68fb0",
//               },
//             ],
//           },
//           {
//             key: "usage_details",
//             title: "Usage details",
//             total: 187,
//             segments: [
//               {
//                 label: "Residential",
//                 value: 85,
//                 percent: 45.5,
//                 color: "#7a1453",
//               },
//               {
//                 label: "Commercial",
//                 value: 52,
//                 percent: 27.8,
//                 color: "#a8306e",
//               },
//               {
//                 label: "Institutional",
//                 value: 29,
//                 percent: 15.5,
//                 color: "#c96b98",
//               },
//               {
//                 label: "Industrial",
//                 value: 21,
//                 percent: 11.2,
//                 color: "#e6b8cf",
//               },
//             ],
//           },
//           {
//             key: "usage_factor",
//             title: "Usage Factor",
//             total: 187,
//             segments: [
//               { label: "High", value: 116, percent: 62.0, color: "#7a1453" },
//               { label: "Medium", value: 38, percent: 20.3, color: "#a8306e" },
//               { label: "Low", value: 19, percent: 10.2, color: "#c96b98" },
//               { label: "Very Low", value: 14, percent: 7.5, color: "#e6b8cf" },
//             ],
//           },
//           {
//             key: "construction_type",
//             title: "Construction Type",
//             total: 187,
//             segments: [
//               { label: "Pucca", value: 128, percent: 68.4, color: "#7a1453" },
//               {
//                 label: "Semi Pucca",
//                 value: 40,
//                 percent: 21.4,
//                 color: "#a8306e",
//               },
//               { label: "Kutcha", value: 13, percent: 7.0, color: "#c96b98" },
//               { label: "Others", value: 6, percent: 3.2, color: "#e6b8cf" },
//             ],
//           },
//         ],
//       });
//   const [loading, setLoading] = useState(true);



//   if (loading) {
//     return (
//       <div className="mt-6 py-6">
//         <p className="text-gray-400 text-sm">Loading property breakdowns...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
//       {charts.map((chart) => (
//         <PropertyDonutCard
//           key={chart.key}
//           title={chart.title}
//           total={chart.total}
//           segments={chart.segments}
//         />
//       ))}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import PropertyDonutCard from "./PropertyDonutCard";
import { fetchPropertyBreakdowns } from "../../services/api.js";

// Color palette for charts
const COLORS = {
  primary: ["#7a1453", "#a8306e", "#c96b98", "#e6b8cf", "#f5d6e6", "#fce4ec"],
};

export default function PropertyBreakdowns({ data }) {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      const landBuilding = data?.land_building_analysis || {};
      
      const chartConfigs = [
        {
          key: "property_status",
          title: "Property Status",
          data: landBuilding.usage_factor,
        },
        {
          key: "usage_details",
          title: "Usage Details",
          data: landBuilding.usage_type,
        },
         {
          key: "construction_type",
          title: "Construction Type",
          data: landBuilding.construction_type,
        },
        {
          key: "roof type",
          title: "Roof Type",
          data: landBuilding.roof_type,
        },
       
      ];

      const mappedCharts = chartConfigs
        .filter((config) => config.data && Object.keys(config.data).length > 0)
        .map((config, chartIndex) => {
          const dataEntries = Object.keys(config.data);
          const segments = dataEntries.map((key, index) => ({
            label: key,
            value: config.data[key]?.count || 0,
            percent: config.data[key]?.percentage || 0,
            color: COLORS.primary[index % COLORS.primary.length],
            property_uids: config.data[key]?.property_uids || [],
          }));

          // Sort by value descending
          segments.sort((a, b) => b.value - a.value);

          const total = segments.reduce((sum, seg) => sum + seg.value, 0);

          return {
            key: config.key,
            title: config.title,
            total: total,
            segments: segments,
          };
        });

      setCharts(mappedCharts);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="mt-6 py-6">
        <p className="text-gray-400 text-sm">Loading property breakdowns...</p>
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="mt-6 py-6">
        <p className="text-gray-400 text-sm">No property breakdown data available</p>
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