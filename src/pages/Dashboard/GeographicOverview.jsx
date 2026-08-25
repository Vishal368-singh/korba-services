// import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
// import { FaEllipsisH } from "react-icons/fa";
// import { fetchGeographicOverview } from "../../services/api.js";

// export default function GeographicOverview({data}) {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchGeographicOverview().then((res) => {
//       setLocations(res.locations || []);
//       setLoading(false);
//     });
//   }, []);

//   const defaultCenter = [22.7196, 75.8577];
//   const mapCenter =
//     locations.length > 0 ? [locations[0].lat, locations[0].lng] : defaultCenter;

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
//           Geographic Overview
//         </h3>
//         {/* <FaEllipsisH className="text-gray-400 text-sm cursor-pointer mr-2 hover:text-black"/> */}
//       </div>

//       {/* Explicit responsive height instead of flex-1/h-full, prevents Leaflet sizing glitches */}
//       <div className="relative z-0 w-full h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden">
//         {!loading && (
//           <MapContainer
//             center={mapCenter}
//             zoom={12}
//             scrollWheelZoom={false}
//             style={{ height: "100%", width: "100%" }}
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             {locations.map((loc) => (
//               <CircleMarker
//                 key={loc.name}
//                 center={[loc.lat, loc.lng]}
//                 radius={8}
//                 pathOptions={{
//                   color: "#fff",
//                   weight: 2,
//                   fillColor: loc.color,
//                   fillOpacity: 1,
//                 }}
//               >
//                 <Popup>{loc.name}</Popup>
//               </CircleMarker>
//             ))}
//           </MapContainer>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { FaEllipsisH } from "react-icons/fa";
import { fetchGeographicOverview } from "../../services/api.js";
import "leaflet/dist/leaflet.css";

// Color mapping for different property locations
const LOCATION_COLORS = {
  "Main Road": "#7a1453",
  "Market": "#a8306e",
  "Others": "#c96b98",
};

// Color mapping for tax zones
const ZONE_COLORS = {
  "Zone 1": "#7a1453",
  "Zone 2": "#a8306e",
  "Zone 3": "#c96b98",
  "Zone 4": "#e6b8cf",
};

export default function GeographicOverview({ data }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data?.map_locations) {
      // Map the API data to the format expected by the map
      const mappedLocations = mapApiDataToLocations(data.map_locations);
      setLocations(mappedLocations);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [data]);

  // Function to map API data to location format
  const mapApiDataToLocations = (mapData) => {
    if (!mapData || !Array.isArray(mapData)) return [];

    return mapData
      .filter((loc) => loc.latitude && loc.longitude) // Filter out null coordinates
      .map((loc) => {
        // Determine color based on property_location or tax_rate_zone
        let color = "#7a1453"; // Default color
        
        if (loc.property_location) {
          // Check if property_location exists in our color mapping
          const locationKey = Object.keys(LOCATION_COLORS).find(
            (key) => loc.property_location.toLowerCase().includes(key.toLowerCase())
          );
          if (locationKey) {
            color = LOCATION_COLORS[locationKey];
          }
        } else if (loc.tax_rate_zone) {
          // Fallback to tax zone color
          color = ZONE_COLORS[loc.tax_rate_zone] || "#7a1453";
        }

        return {
          name: loc.parcel_no || loc.property_id || loc.property_uid,
          lat: parseFloat(loc.latitude),
          lng: parseFloat(loc.longitude),
          color: color,
          property_uid: loc.property_uid,
          parcel_no: loc.parcel_no,
          property_id: loc.property_id,
          property_location: loc.property_location,
          tax_rate_zone: loc.tax_rate_zone,
        };
      });
  };

  // Default center (Indore coordinates)
  const defaultCenter = [22.7196, 75.8577];
  
  // Set map center to first location or default
  const mapCenter = locations.length > 0 
    ? [locations[0].lat, locations[0].lng] 
    : defaultCenter;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
            Geographic Overview
          </h3>
        </div>
        <div className="relative z-0 w-full h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
            Geographic Overview
          </h3>
        </div>
        <div className="relative z-0 w-full h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden flex items-center justify-center">
          <p className="text-gray-400 text-sm">No location data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
          Geographic Overview
        </h3>
      </div>

      {/* Map container with responsive height */}
      <div className="relative z-0 w-full h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((loc, index) => (
            <CircleMarker
              key={loc.property_uid || index}
              center={[loc.lat, loc.lng]}
              radius={8}
              pathOptions={{
                color: "#fff",
                weight: 2,
                fillColor: loc.color,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">{loc.name}</p>
                  {loc.parcel_no && <p>Parcel: {loc.parcel_no}</p>}
                  {loc.property_id && <p>Property: {loc.property_id}</p>}
                  {loc.property_location && <p>Location: {loc.property_location}</p>}
                  {loc.tax_rate_zone && <p>Zone: {loc.tax_rate_zone}</p>}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 px-2">
        {Object.entries(LOCATION_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}