// src/theme/colors.js
export const BRAND = "#7a1453"; // app shell only

export const HIGHLIGHT_COLOR = "#f59e0b"; // muted amber ring, less neon than before

// Softer, desaturated hues — same "one color per chart" idea, lower intensity
export const CHART_THEMES = {
  tax_rate_zone: {
    base: "#4f7cac",
    shades: ["#2f5478", "#4f7cac", "#7ba1c9", "#a5c1dd", "#c9dcec"],
  },
  property_location: {
    base: "#5B7FA3",
    shades: [
      "#5B7FA3", // Main Road
      "#6FA58A", // Market
      "#B88A68", // Others
    ],
  },
  property_age: {
    base: "#c17d4f",
    shades: ["#93582f", "#c17d4f", "#d3a077", "#e2bd9f", "#efd8c1"],
  },
  utilities: {
    base: "#8368a8",
    shades: ["#5c4779", "#8368a8", "#a68dc0", "#c3b2d6", "#ddd3e8"],
  },
  property_status: {
    base: "#b8557a",
    shades: ["#8a3457", "#b8557a", "#cd7f9c", "#dfa8bb", "#eecdd6"],
  },
  building_permissions: {
    base: "#4a9296",
    shades: ["#2d6a6d", "#4a9296", "#77b0b3", "#a4c8ca", "#c9dfe0"],
  },
  property_ownership: {
    base: "#c19a3f",
    shades: ["#93701f", "#c19a3f", "#d3b46f", "#e2c99a", "#efdec0"],
  },
  construction_type: {
    base: "#7076b0",
    shades: ["#484e82", "#7076b0", "#9498c5", "#b6b9d8", "#d5d7e9"],
  },
};

export const TRACK_COLOR = "#E9E9EC";

export const MAP_LOCATION_COLORS = {
  "Main Road": "#5B7FA3",
  Market: "#6FA58A",
  Others: "#B88A68",
};

export const MAP_ZONE_COLORS = {
  "Zone 1": "#4f7cac",
  "Zone 2": "#4c9a7a",
  "Zone 3": "#c17d4f",
  "Zone 4": "#8368a8",
};

export const MAP_DEFAULT_MARKER_COLOR = "#6b7280";

export const DIM_MARKER_OPACITY = 0.3;
export const DIM_MARKER_FILL_OPACITY = 0.15;

export const KPI_COLORS = {
  unique_parcels: "#4f7cac",
  unique_properties: "#4c9a7a",
  total_plot_area: "#c17d4f",
  total_builtup_area: "#8368a8",
  vacant_properties: "#b8557a",
  new_construction: "#4a9296",
  additional_floor_constructed: "#c19a3f",
};
export const KPI_DEFAULT_COLOR = "#7076b0";

export const GAUGE_COLORS = {
  owner_mobile_no: "#4f7cac",
  property_image: "#4c9a7a",
  geo_tag_completion: "#c17d4f",
  boundary_verification: "#8368a8",
};

// Cross-filter dim opacity — non-matching segments across ALL charts
export const CROSS_FILTER_DIM_OPACITY = 0.25;

export const UTILITY_COLORS = {
  "Water Supply": "#4F86F7",
  Electricity: "#F5A623",
  Sewerage: "#2E9B63",
  Drainage: "#269BB5",
  "Solid Waste": "#9B6FD3",
};

export const AGE_COLORS = {
  "0-5 Years": "#4CCB7A",
  "6-10 Years": "#8BCB24",
  "11-20 Years": "#F0B90B",
  "21-30 Years": "#F47B20",
  "31+ Years": "#D94A4A",
};

export const BAR_DEFAULT_COLOR = "#7076B0";

export const CARD_BORDER_COLOR = "#e5e7eb";
