// Small registry so generateDashboardPdf.js can access the live Leaflet
// map instance without prop-drilling it through the whole component tree.
let currentMap = null;

export const setActiveMap = (map) => {
  currentMap = map;
};

export const getActiveMap = () => currentMap;