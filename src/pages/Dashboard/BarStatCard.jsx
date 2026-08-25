// import { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   LabelList,
//   Label,
// } from "recharts";
// import { FaEllipsisH } from "react-icons/fa";

// const PRIMARY = "#7a1453";

// export default function BarStatCard({ title,data, barColor = PRIMARY }) {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetchFn().then(setData);
//   }, [fetchFn]);

//   if (!data) {
//     return (
//       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full flex items-center justify-center text-gray-400 text-sm">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full">
//       <div className="flex items-center justify-between mt-1 ml-2">
//         <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>
//           {title}
//         </h3>
//         <FaEllipsisH className="text-gray-400 text-sm mr-2 cursor-pointer hover:text-black" />
//       </div>

//       <p className="text-xs text-gray-400 mt-2 ml-2">Properties</p>

//       <div className="h-38 mt-5">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data.data}
//             margin={{ top: 5, right: 4, left: -20, bottom: 0 }}
//           >
//             <XAxis
//               dataKey="label"
//               tick={{ fontSize: 7, fill: "#9ca3af" }}
//               axisLine={true}
//               tickLine={false}
//               interval={0}
//             />
//             <YAxis
//               tick={{ fontSize: 10, fill: "#9ca3af" }}
//               axisLine={true}
//               tickLine={false}
//             >
//               <Label
//                 position="insideLeft"
//                 style={{ textAnchor: "middle", fontSize: 11, fill: "#6b7280" }}
//               />
//             </YAxis>
//             <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]}>
//               <LabelList
//                 dataKey="value"
//                 position="top"
//                 style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
//               />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts";
import { FaEllipsisH } from "react-icons/fa";

const PRIMARY = "#7a1453";

export default function BarStatCard({ title, data, barColor = PRIMARY }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      // Detect data type and map accordingly
      const mappedData = mapApiDataToChart(data);
      setChartData(mappedData);
    }
  }, [data]);

  // Function to detect data type and map accordingly
  const mapApiDataToChart = (apiData) => {
    if (!apiData) return null;

    // Check if it's utilities data (has total_properties_with_utilities and utilities object)
    if (apiData.total_properties_with_utilities !== undefined && apiData.utilities) {
      return mapUtilitiesData(apiData);
    }
    
    // Check if it's building_age data (has age categories like "0-5 Years", "6-10 Years", etc.)
    const ageKeys = ["0-5 Years", "6-10 Years", "11-20 Years", "21-30 Years", "31+ Years"];
    const hasAgeKeys = ageKeys.some(key => apiData[key] !== undefined);
    if (hasAgeKeys) {
      return mapBuildingAgeData(apiData);
    }

    // Generic mapping for any other data format
    return mapGenericData(apiData);
  };

  // Map building age data
  const mapBuildingAgeData = (apiData) => {
    const ageOrder = [
      "0-5 Years",
      "6-10 Years",
      "11-20 Years",
      "21-30 Years",
      "31+ Years"
    ];

    const chartData = ageOrder.map((key) => ({
      label: key,
      value: apiData[key]?.count || 0,
      percentage: apiData[key]?.percentage || 0,
      property_uids: apiData[key]?.property_uids || [],
    }));

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return {
      total: total,
      data: chartData,
      type: 'building_age'
    };
  };

  // Map utilities data
  const mapUtilitiesData = (apiData) => {
    const utilities = apiData.utilities || {};
    const totalProperties = apiData.total_properties_with_utilities || 0;

    // Define the order of utilities
    const utilityOrder = [
      'water_supply',
      'electricity',
      'sewerage',
      'drainage',
      'solid_waste'
    ];

    // Map utility labels to display names
    const utilityLabels = {
      water_supply: 'Water Supply',
      electricity: 'Electricity',
      sewerage: 'Sewerage',
      drainage: 'Drainage',
      solid_waste: 'Solid Waste'
    };

    const chartData = utilityOrder.map((key) => ({
      label: utilityLabels[key] || key.replace('_', ' ').toUpperCase(),
      value: utilities[key]?.count || 0,
      percentage: utilities[key]?.percentage || 0,
      property_uids: utilities[key]?.property_uids || [],
    }));

    return {
      total: totalProperties,
      data: chartData,
      type: 'utilities'
    };
  };

  // Generic mapping for any other data format
  const mapGenericData = (apiData) => {
    const keys = Object.keys(apiData);
    
    const chartData = keys.map((key) => ({
      label: key.replace(/_/g, ' ').toUpperCase(),
      value: apiData[key]?.count || 0,
      percentage: apiData[key]?.percentage || 0,
      property_uids: apiData[key]?.property_uids || [],
    }));

    // Sort by value descending
    chartData.sort((a, b) => b.value - a.value);

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return {
      total: total,
      data: chartData,
      type: 'generic'
    };
  };

  if (!chartData || chartData.data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full flex items-center justify-center text-gray-400 text-sm">
        No Data Available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full">
      <div className="flex items-center justify-between mt-1 ml-2">
        <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>
          {title}
        </h3>
        
      </div>
{/* 
      <p className="text-xs text-gray-400 mt-2 ml-2">
        {chartData.type === 'utilities' ? 'Properties with Utilities' : 'Properties'}: {chartData.total}
      </p> */}

      <div className="h-38 mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData.data}
            margin={{ top: 5, right: 4, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 7, fill: "#9ca3af" }}
              axisLine={true}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={true}
              tickLine={false}
            >
              <Label
                position="insideLeft"
                style={{ textAnchor: "middle", fontSize: 11, fill: "#6b7280" }}
              />
            </YAxis>
            <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}