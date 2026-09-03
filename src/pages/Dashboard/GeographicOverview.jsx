import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MAP_LOCATION_COLORS as LOCATION_COLORS,
  MAP_ZONE_COLORS as ZONE_COLORS,
  MAP_DEFAULT_MARKER_COLOR,
  HIGHLIGHT_COLOR,
  DIM_MARKER_OPACITY,
  DIM_MARKER_FILL_OPACITY,
} from "../../theme/colors";

const KORBA_CENTER = [22.351866935224848, 82.69620636172175];
//22.356614966594247, 82.7061557631624
const DEFAULT_ZOOM = 14;

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], DEFAULT_ZOOM, { animate: true });
    } else {
      map.fitBounds(
        points.map((p) => [p.lat, p.lng]),
        { padding: [40, 40], animate: true, maxZoom: DEFAULT_ZOOM },
      );
    }
  }, [points, map]);
  return null;
}

// Resets the map back to Korba whenever the filter is cleared
function ResetOnClear({ active }) {
  const map = useMap();
  useEffect(() => {
    if (!active) {
      map.setView(KORBA_CENTER, DEFAULT_ZOOM, { animate: true });
    }
  }, [active, map]);
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

function mapApiDataToLocations(mapData, statusLookup) {
  if (!mapData || !Array.isArray(mapData)) return [];
  return mapData
    .filter((loc) => loc.latitude && loc.longitude)
    .map((loc) => {
      let color = MAP_DEFAULT_MARKER_COLOR;
      if (loc.property_location) {
        const locationKey = Object.keys(LOCATION_COLORS).find((key) =>
          loc.property_location.toLowerCase().includes(key.toLowerCase()),
        );
        if (locationKey) color = LOCATION_COLORS[locationKey];
      } else if (loc.tax_rate_zone) {
        color = ZONE_COLORS[loc.tax_rate_zone] || MAP_DEFAULT_MARKER_COLOR;
      }
      return {
        name: loc.parcel_no || loc.property_id || loc.property_uid,
        lat: parseFloat(loc.latitude),
        lng: parseFloat(loc.longitude),
        color,
        property_uid: loc.property_uid,
        parcel_no: loc.parcel_no,
        property_id: loc.property_id,
        property_location: loc.property_location,
        tax_rate_zone: loc.tax_rate_zone,
        status: statusLookup[loc.property_uid] || null,
      };
    });
}

export default function GeographicOverview({
  data,
  selectedFilter,
  onClearFilter,
}) {
  const locations = useMemo(() => {
    if (!data?.map_locations) return [];
    const statusLookup = buildStatusLookup(data.property_status);
    const mapped = mapApiDataToLocations(data.map_locations, statusLookup);
    return deconflictOverlaps(mapped);
  }, [data]);
  const loading = !data;

  const selectedUidSet = useMemo(
    () => new Set(selectedFilter?.uids || []),
    [selectedFilter],
  );

  const highlighted = selectedFilter
    ? locations.filter((l) => selectedUidSet.has(l.property_uid))
    : locations;
  const dimmed = selectedFilter
    ? locations.filter((l) => !selectedUidSet.has(l.property_uid))
    : [];

  const missingCoordsCount =
    (data?.map_locations?.length || 0) - locations.length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
        <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
          Geographic Overview
        </h3>
        <div className="relative z-0 w-full h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col">
        <h3 className="text-sm font-semibold text-[#7a1453] mt-1 ml-2">
          Geographic Overview
        </h3>
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
        {selectedFilter && (
          <button
            onClick={onClearFilter}
            className="text-xs font-medium text-[#7a1453] bg-[#f5e4ee] px-2 py-1 rounded-md mr-2 hover:bg-[#efd2e3]"
          >
            {selectedFilter.label} selected ✕
          </button>
        )}
      </div>

      <div className="relative z-0 w-full mt-2 h-65 sm:h-80 lg:h-110 rounded-xl overflow-hidden">
        <MapContainer
          center={KORBA_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          zoomControl
          attributionControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {!selectedFilter && <FitBounds points={locations} />}
          {selectedFilter && <FitBounds points={highlighted} />}

          <ResetOnClear active={!!selectedFilter} />

          {dimmed.map((loc, index) => (
            <CircleMarker
              key={`dim-${loc.property_uid || index}`}
              center={[loc.lat, loc.lng]}
              radius={6}
              pathOptions={{
                color: "#fff",
                weight: 1,
                fillColor: loc.color,
                fillOpacity: DIM_MARKER_FILL_OPACITY,
                opacity: DIM_MARKER_OPACITY,
              }}
            />
          ))}

          {highlighted.map((loc, index) => (
            <CircleMarker
              key={loc.property_uid || index}
              center={[loc.lat, loc.lng]}
              radius={selectedFilter ? 11 : 9}
              pathOptions={{
                color: selectedFilter ? HIGHLIGHT_COLOR : "#fff",
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

                  {loc.property_location && (
                    <p>Location: {loc.property_location}</p>
                  )}

                  {loc.tax_rate_zone && <p>Zone: {loc.tax_rate_zone}</p>}

                  {loc.status && <p>Status: {loc.status}</p>}
                </div>
              </Popup>
            </CircleMarker>
          ))}

          <div className="absolute bottom-0 right-0 z-[1000] bg-gray-100 px-2 py-2 rounded text-[12px] text-gray-500 shadow-sm">
            Powered by{" "}
            <span className="font-semibold text-[#7a1453]">MLInfoMap</span>
          </div>
        </MapContainer>
      </div>

      {missingCoordsCount > 0 && (
        <p className="text-xs text-amber-600 mt-2 px-2">
          {missingCoordsCount} propert{missingCoordsCount === 1 ? "y" : "ies"}{" "}
          missing coordinates and not shown on map.
        </p>
      )}

      <div className="flex flex-wrap m-2 gap-3 px-4">
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
