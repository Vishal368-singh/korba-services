import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import App from './App.jsx'
import "leaflet/dist/leaflet.css";
import './index.css'
import "./utils/leafletIconFix";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/PropSurvey/">
    <App />
  </BrowserRouter>,
);
/**23/09/2026 
 * 
Implemented server-side search for the Approved/Completed Survey API.
Updated the Approved Survey API to accept the search parameter.
Fixed the frontend Approved tab search parameter mapping.
Ensured search is applied before pagination.
Added search support for Survey ID, Parcel No, Property ID, Surveyor Name, Surveyor ID, and Zone.
Verified that search results are calculated from the complete database records, not just the current page.
Maintained existing pagination and total record count after applying search.
Debugged the API request payload where search was incorrectly receiving 20.
Updated the frontend API call to send the actual search text.
Tested the search  pagination flow for Approved/Completed surveys.
*/

/*
16/0902026
Added dynamic layer detection for Soil, LULC, and None
Updated layer toggle function to activity log
Connected activity logging with Layer and Date Range selectors
Updated Activity Log to show real API data instead of mock data
Created Activity Log table with search, filters, sorting, and active session status
Created shared useAuthUser and useIsAdmin hooks for user and role handling
Added RequireAdmin route protection for Activity Log
Updated Sidebar to show Activity Log only for admins
Implemented admin-only visibility for the Activity Log option in the sidebar
Verified activity data and API responses through browser console logs
Debugged and verified Activity API requests using browser Network and debugger tools
Verified databse for Activity capturing */