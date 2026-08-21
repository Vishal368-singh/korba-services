import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { FaEllipsisH } from "react-icons/fa";
import { fetchGeographicOverview } from "../../services/api.js";

export default function GeographicOverview() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeographicOverview().then((res) => {
      setLocations(res.locations || []);
      setLoading(false);
    });
  }, []);

  const defaultCenter = [22.7196, 75.8577];
  const mapCenter =
    locations.length > 0 ? [locations[0].lat, locations[0].lng] : defaultCenter;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
          Geographic Overview
        </h3>
        <FaEllipsisH className="text-gray-400 text-sm cursor-pointer mr-2 hover:text-black"/>
      </div>

      {/* Explicit responsive height instead of flex-1/h-full, prevents Leaflet sizing glitches */}
      <div className="relative z-0 w-full h-[260px] sm:h-[320px] lg:h-[440px] rounded-xl overflow-hidden">
        {!loading && (
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

            {locations.map((loc) => (
              <CircleMarker
                key={loc.name}
                center={[loc.lat, loc.lng]}
                radius={8}
                pathOptions={{
                  color: "#fff",
                  weight: 2,
                  fillColor: loc.color,
                  fillOpacity: 1,
                }}
              >
                <Popup>{loc.name}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
