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

/***** 24/06/2026
Compared survey_information and survey_track_status tables to identify missing data
Identified 71 survey records that were present in survey_information but missing from survey_track_status
Corrected PostgreSQL CREATE TABLE schema  for multiple propertytax tables 
import the all data from the production databse into dev databse create all tables
Added  missing data and  Pending status survey records in survey_track_status tables
changing the complete survey api to get all updtaed records from db 
Added search support for Pending and Rejected surveys in the backend API
Updated the frontend Pending/Rejected API request to send the search parameter
*/