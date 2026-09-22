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
/**
 * 
Implemented force logout functionality for users already logged in on another browser or window.
Added backend API to clear the existing user's active session.
Added login conflict handling for HTTP 409 response.
Added confirmation popup for forcefully logging out an existing session.
Integrated force logout API with the React login flow.
Implemented re-login automatically after successful force logout.
Updated Axios API service with response interceptor handling.
Added automatic redirect to login page on 401 Unauthorized session errors.
Tested force logout API through Postman and verified session status handling.
Debugged and refined the login/session flow for multiple browser or device scenarios. 
Added a ProtectedRoute guard in AppRoutes.jsx to enforce login-check before rendering protected routes.
Fixed direct URL access bypassing authentication (e.g. typing /dashboard without login).
Fixed routes not re-validating auth state after logout/back-navigation.
Restricted /edit route to supervisor role only.
Removed incorrect role restriction on /surveys/:surveyId so supervisors can access the survey update form.
Removed incorrect role restriction on /dashboard, /survey, /users that was blocking valid roles like admin and office, keeping role restriction only on /edit.
*/