import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LOCATION_COLORS = {
  "Main Road": "#7a1453",
  "Market": "#a8306e",
  "Others": "#c96b98",
};

const ZONE_COLORS = {
  "Zone 1": "#7a1453",
  "Zone 2": "#a8306e",
  "Zone 3": "#c96b98",
  "Zone 4": "#e6b8cf",
};

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15, { animate: true });
    } else {
      map.fitBounds(points.map((p) => [p.lat, p.lng]), { padding: [40, 40], animate: true, maxZoom: 16 });
    }
  }, [points, map]);
  return null;
}

function buildStatusLookup(propertyStatus) {
  const lookup = {};
  if (!propertyStatus) return lookup;
  Object.entries(propertyStatus).forEach(([status, val]) => {
    (val?.property_uids || []).forEach((uid) => {
      lookup[uid] = status;
    });
  });
  return lookup;
}

function deconflictOverlaps(rawLocations) {
  const groups = {};
  rawLocations.forEach((loc) => {
    const key = `${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(loc);
  });

  const OFFSET = 0.00025;
  const result = [];

  Object.values(groups).forEach((group) => {
    if (group.length === 1) {
      result.push(group[0]);
      return;
    }
    group.forEach((loc, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      result.push({
        ...loc,
        lat: loc.lat + OFFSET * Math.sin(angle),
        lng: loc.lng + OFFSET * Math.cos(angle),
        _wasOverlapping: true,
      });
    });
  });

  return result;
}

export default function GeographicOverview({ data, selectedFilter, onClearFilter }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data?.map_locations) {
      const statusLookup = buildStatusLookup(data.property_status);
      const mapped = mapApiDataToLocations(data.map_locations, statusLookup);
      setLocations(deconflictOverlaps(mapped));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [data]);

  const mapApiDataToLocations = (mapData, statusLookup) => {
    if (!mapData || !Array.isArray(mapData)) return [];
    return mapData
      .filter((loc) => loc.latitude && loc.longitude)
      .map((loc) => {
        let color = "#7a1453";
        if (loc.property_location) {
          const locationKey = Object.keys(LOCATION_COLORS).find((key) =>
            loc.property_location.toLowerCase().includes(key.toLowerCase())
          );
          if (locationKey) color = LOCATION_COLORS[locationKey];
        } else if (loc.tax_rate_zone) {
          color = ZONE_COLORS[loc.tax_rate_zone] || "#7a1453";
        }
        return {
          name: loc.parcel_no || loc.property_id || loc.property_uid,
          lat: parseFloat(loc.latitude),
          lng: parseFloat(loc.longitude),
          color,
          property_uid: loc.property_uid, // <-- the join key
          parcel_no: loc.parcel_no,
          property_id: loc.property_id,
          property_location: loc.property_location,
          tax_rate_zone: loc.tax_rate_zone,
          status: statusLookup[loc.property_uid] || null,
        };
      });
  };

  const defaultCenter = [22.7196, 75.8577];
  const mapCenter = locations.length > 0 ? [locations[0].lat, locations[0].lng] : defaultCenter;

  // Pure property_uid membership check — works identically no matter which chart triggered it
  const selectedUidSet = useMemo(
    () => new Set(selectedFilter?.uids || []),
    [selectedFilter]
  );

  const highlighted = selectedFilter
    ? locations.filter((l) => selectedUidSet.has(l.property_uid))
    : locations;
  const dimmed = selectedFilter
    ? locations.filter((l) => !selectedUidSet.has(l.property_uid))
    : [];

  const missingCoordsCount = (data?.map_locations?.length || 0) - locations.length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
        <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">Geographic Overview</h3>
        <div className="relative z-0 w-full h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
        <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">Geographic Overview</h3>
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
          <span className="text-xs font-normal text-gray-400 ml-2">
            {highlighted.length} propert{highlighted.length === 1 ? "y" : "ies"}
            {selectedFilter ? " matched" : " on map"}
          </span>
        </h3>
        {selectedFilter && (
          <button
            onClick={onClearFilter}
            className="text-xs font-medium text-[#7a1453] bg-[#f5e4ee] px-2 py-1 rounded-md mr-2 hover:bg-[#efd2e3]"
          >
            {selectedFilter.label} selected ✕
          </button>
        )}
      </div>

      <div className="relative z-0 w-full h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={selectedFilter ? highlighted : locations} />

          {dimmed.map((loc, index) => (
            <CircleMarker
              key={`dim-${loc.property_uid || index}`}
              center={[loc.lat, loc.lng]}
              radius={6}
              pathOptions={{ color: "#fff", weight: 1, fillColor: loc.color, fillOpacity: 0.15, opacity: 0.3 }}
            />
          ))}

          {highlighted.map((loc, index) => (
            <CircleMarker
              key={loc.property_uid || index}
              center={[loc.lat, loc.lng]}
              radius={selectedFilter ? 11 : 9}
              pathOptions={{
                color: selectedFilter ? "#facc15" : "#fff",
                weight: selectedFilter ? 3 : 2,
                fillColor: loc.color,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-[#7a1453]">{loc.name}</p>
                  {loc.property_uid && <p>Property UID: {loc.property_uid}</p>}
                  {loc.parcel_no && <p>Parcel: {loc.parcel_no}</p>}
                  {loc.property_id && <p>Property ID: {loc.property_id}</p>}
                  {loc.property_location && <p>Location: {loc.property_location}</p>}
                  {loc.tax_rate_zone && <p>Zone: {loc.tax_rate_zone}</p>}
                  {loc.status && <p>Status: {loc.status}</p>}
                  {loc._wasOverlapping && (
                    <p className="text-[10px] text-gray-400 italic">Position adjusted (shared coordinates)</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {missingCoordsCount > 0 && (
        <p className="text-xs text-amber-600 mt-2 px-2">
          {missingCoordsCount} propert{missingCoordsCount === 1 ? "y" : "ies"} missing coordinates and not shown on map.
        </p>
      )}

      <div className="flex flex-wrap gap-3 mt-3 px-2">
        {Object.entries(LOCATION_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}