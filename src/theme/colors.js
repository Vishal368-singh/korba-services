export const BRAND = "#7a1453"; // app shell / chrome only, not used in charts

export const HIGHLIGHT_COLOR = "#facc15"; // selection ring, shared everywhere

// One base hue per chart — pick colors that are visually distinct from each other
export const CHART_THEMES = {
  tax_rate_zone: {
    base: "#3b82f6", // blue
    shades: ["#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
  },
  property_location: {
    base: "#22c55e", // green
    shades: ["#15803d", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"],
  },
  property_age: {
    base: "#f97316", // orange
    shades: ["#c2410c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"],
  },
  utilities: {
    base: "#a855f7", // purple
    shades: ["#7e22ce", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff", "#f3e8ff"],
  },
  property_status: {
    base: "#ec4899", // pink/rose
    shades: ["#be185d", "#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8", "#fce7f3"],
  },
  building_permissions: {
    base: "#14b8a6", // teal
    shades: ["#0f766e", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1"],
  },
  property_ownership: {
    base: "#eab308", // yellow/gold
    shades: ["#a16207", "#eab308", "#facc15", "#fde047", "#fef08a", "#fef9c3"],
  },
  construction_type: {
    base: "#6366f1", // indigo
    shades: ["#4338ca", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"],
  },
  data_completeness: {
    base: "#06b6d4", // cyan (used as single gauge fill, not a segment set)
  },
};

// Track color for gauges (unfilled portion) — shared neutral
export const TRACK_COLOR = "#E5E7EB";

// Map marker colors — deliberately reuse the SAME hues as tax_rate_zone / property_location
// themes so the map's coloring mode (whichever field is active) visually matches its chart
export const MAP_LOCATION_COLORS = {
  "Main Road": "#15803d",
  "Market": "#4ade80",
  "Others": "#86efac",
};

export const MAP_ZONE_COLORS = {
  "Zone 1": "#1d4ed8",
  "Zone 2": "#3b82f6",
  "Zone 3": "#60a5fa",
  "Zone 4": "#93c5fd",
};

export const MAP_DEFAULT_MARKER_COLOR = "#6b7280";

export const DIM_MARKER_OPACITY = 0.3;
export const DIM_MARKER_FILL_OPACITY = 0.15;