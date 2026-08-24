import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import App from './App.jsx'
import "leaflet/dist/leaflet.css";
import './index.css'
import "./utils/leafletIconFix";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
/***
 * 
Added new dashboard indicators for New Construction and Additional Floor Constructed.
Updated indicator cards with suitable icons and improved compact layout
Enhanced donut charts with percentage labels and improved tooltips showing count and percentage
Improved chart card styling and alignment for a consistent dashboard theme
Added dropdown support for Property Location, Tax Rate Zone, and Zone fields
Reused common constants for dropdown options such as Zones and Tax Rate Zones
Created reusable MUI DropdownField component for survey information fields
Added edit-mode control so dropdown values can only be changed after clicking Edit Section
Improved dropdown styling, positioning, and scrolling behavior
Added proper dropdown value handling and section save/cancel integration */